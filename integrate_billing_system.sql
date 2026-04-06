-- Integrate Billing System with Orders and Services
-- This creates invoices automatically when orders are completed and sets up recurring billing

-- First, let's enhance the invoices table to link with orders and services
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS invoice_type TEXT DEFAULT 'one_time', -- 'one_time', 'recurring', 'setup'
ADD COLUMN IF NOT EXISTS billing_period_start DATE,
ADD COLUMN IF NOT EXISTS billing_period_end DATE,
ADD COLUMN IF NOT EXISTS auto_pay BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoices_service_id ON invoices(service_id);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

-- Function to create invoice from completed order
CREATE OR REPLACE FUNCTION create_invoice_from_order()
RETURNS TRIGGER AS $
BEGIN
    -- Only create invoice when order status changes to completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Create invoice for the order
        INSERT INTO invoices (
            user_id,
            order_id,
            amount,
            currency,
            status,
            invoice_type,
            due_date,
            items,
            created_at
        ) VALUES (
            NEW.user_id,
            NEW.id,
            NEW.total,
            NEW.currency,
            CASE 
                WHEN NEW.payment_status = 'completed' THEN 'paid'::invoice_status
                ELSE 'unpaid'::invoice_status
            END,
            'one_time',
            NOW() + INTERVAL '7 days', -- Due in 7 days
            NEW.items,
            NOW()
        );
        
        RAISE NOTICE 'Invoice created for order: %', NEW.order_number;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for automatic invoice creation
DROP TRIGGER IF EXISTS create_invoice_on_order_completion ON orders;
CREATE TRIGGER create_invoice_on_order_completion
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION create_invoice_from_order();

-- Function to generate recurring invoices for services
CREATE OR REPLACE FUNCTION generate_recurring_invoices()
RETURNS INTEGER AS $
DECLARE
    service_record RECORD;
    invoice_count INTEGER := 0;
    next_invoice_date DATE;
    billing_amount DECIMAL(10,2);
BEGIN
    -- Loop through active services that need invoicing
    FOR service_record IN 
        SELECT 
            s.*,
            hp.name as plan_name,
            hp.price as plan_price,
            hp.currency
        FROM services s
        JOIN hosting_plans hp ON s.plan_id = hp.id
        WHERE s.status = 'active'
        AND s.next_due_date <= NOW() + INTERVAL '7 days' -- Invoice 7 days before due
        AND NOT EXISTS (
            -- Don't create if there's already a pending invoice for this period
            SELECT 1 FROM invoices i 
            WHERE i.service_id = s.id 
            AND i.status = 'unpaid'
            AND i.billing_period_start = s.next_due_date::DATE - 
                CASE 
                    WHEN s.billing_cycle = 'monthly' THEN INTERVAL '1 month'
                    WHEN s.billing_cycle = 'quarterly' THEN INTERVAL '3 months'
                    WHEN s.billing_cycle = 'annually' THEN INTERVAL '1 year'
                    WHEN s.billing_cycle = 'biennial' THEN INTERVAL '2 years'
                    ELSE INTERVAL '1 month'
                END
        )
    LOOP
        -- Calculate billing amount based on cycle
        billing_amount := service_record.plan_price;
        
        -- Apply billing cycle multipliers
        CASE service_record.billing_cycle
            WHEN 'quarterly' THEN billing_amount := billing_amount * 3;
            WHEN 'annually' THEN billing_amount := billing_amount * 12;
            WHEN 'biennial' THEN billing_amount := billing_amount * 24;
            ELSE billing_amount := billing_amount; -- monthly
        END CASE;
        
        -- Create recurring invoice
        INSERT INTO invoices (
            user_id,
            service_id,
            amount,
            currency,
            status,
            invoice_type,
            billing_period_start,
            billing_period_end,
            due_date,
            items,
            created_at
        ) VALUES (
            service_record.user_id,
            service_record.id,
            billing_amount,
            service_record.currency,
            'unpaid'::invoice_status,
            'recurring',
            service_record.next_due_date::DATE - 
                CASE 
                    WHEN service_record.billing_cycle = 'monthly' THEN INTERVAL '1 month'
                    WHEN service_record.billing_cycle = 'quarterly' THEN INTERVAL '3 months'
                    WHEN service_record.billing_cycle = 'annually' THEN INTERVAL '1 year'
                    WHEN service_record.billing_cycle = 'biennial' THEN INTERVAL '2 years'
                    ELSE INTERVAL '1 month'
                END,
            service_record.next_due_date::DATE,
            service_record.next_due_date,
            jsonb_build_array(
                jsonb_build_object(
                    'type', 'hosting',
                    'name', service_record.plan_name,
                    'domain', service_record.domain,
                    'billing_cycle', service_record.billing_cycle,
                    'amount', billing_amount
                )
            ),
            NOW()
        );
        
        invoice_count := invoice_count + 1;
    END LOOP;
    
    RETURN invoice_count;
END;
$ LANGUAGE plpgsql;

-- Function to update service next due date after payment
CREATE OR REPLACE FUNCTION update_service_after_payment()
RETURNS TRIGGER AS $
BEGIN
    -- When invoice is marked as paid, update the service next due date
    IF NEW.status = 'paid' AND OLD.status != 'paid' AND NEW.service_id IS NOT NULL THEN
        UPDATE services 
        SET next_due_date = CASE 
            WHEN billing_cycle = 'monthly' THEN next_due_date + INTERVAL '1 month'
            WHEN billing_cycle = 'quarterly' THEN next_due_date + INTERVAL '3 months'
            WHEN billing_cycle = 'annually' THEN next_due_date + INTERVAL '1 year'
            WHEN billing_cycle = 'biennial' THEN next_due_date + INTERVAL '2 years'
            ELSE next_due_date + INTERVAL '1 month'
        END,
        updated_at = NOW()
        WHERE id = NEW.service_id;
        
        RAISE NOTICE 'Service % next due date updated after payment', NEW.service_id;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Create trigger for service updates after payment
DROP TRIGGER IF EXISTS update_service_on_payment ON invoices;
CREATE TRIGGER update_service_on_payment
    AFTER UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_service_after_payment();

-- Function to suspend services for overdue invoices
CREATE OR REPLACE FUNCTION suspend_overdue_services()
RETURNS INTEGER AS $
DECLARE
    suspended_count INTEGER := 0;
BEGIN
    -- Suspend services with overdue invoices (more than 7 days past due)
    UPDATE services 
    SET status = 'suspended'::service_status,
        updated_at = NOW()
    WHERE id IN (
        SELECT DISTINCT i.service_id
        FROM invoices i
        WHERE i.service_id IS NOT NULL
        AND i.status = 'unpaid'
        AND i.due_date < NOW() - INTERVAL '7 days'
        AND EXISTS (
            SELECT 1 FROM services s 
            WHERE s.id = i.service_id 
            AND s.status = 'active'
        )
    );
    
    GET DIAGNOSTICS suspended_count = ROW_COUNT;
    RETURN suspended_count;
END;
$ LANGUAGE plpgsql;

-- Create a view for billing dashboard
CREATE OR REPLACE VIEW billing_dashboard AS
SELECT 
    u.id as user_id,
    u.email,
    p.first_name,
    p.last_name,
    p.credit_balance,
    COUNT(DISTINCT s.id) as active_services,
    COUNT(DISTINCT CASE WHEN i.status = 'unpaid' THEN i.id END) as unpaid_invoices,
    COALESCE(SUM(CASE WHEN i.status = 'unpaid' THEN i.amount END), 0) as outstanding_balance,
    MIN(CASE WHEN i.status = 'unpaid' THEN i.due_date END) as next_due_date,
    COUNT(DISTINCT CASE WHEN i.due_date < NOW() AND i.status = 'unpaid' THEN i.id END) as overdue_invoices
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN services s ON u.id = s.user_id AND s.status = 'active'
LEFT JOIN invoices i ON u.id = i.user_id
GROUP BY u.id, u.email, p.first_name, p.last_name, p.credit_balance;

-- Grant access to the view
GRANT SELECT ON billing_dashboard TO authenticated;

-- Create RLS policy for billing dashboard
CREATE POLICY "Users can view own billing dashboard" ON billing_dashboard
    FOR SELECT USING (auth.uid() = user_id);

-- Function to process automatic payments from credit balance
CREATE OR REPLACE FUNCTION process_auto_payments()
RETURNS INTEGER AS $
DECLARE
    payment_count INTEGER := 0;
    invoice_record RECORD;
BEGIN
    -- Process payments for invoices where user has sufficient credit balance
    FOR invoice_record IN 
        SELECT 
            i.*,
            p.credit_balance
        FROM invoices i
        JOIN profiles p ON i.user_id = p.id
        WHERE i.status = 'unpaid'
        AND i.due_date <= NOW()
        AND p.credit_balance >= i.amount
        AND i.auto_pay = true
    LOOP
        -- Deduct from credit balance
        UPDATE profiles 
        SET credit_balance = credit_balance - invoice_record.amount,
            updated_at = NOW()
        WHERE id = invoice_record.user_id;
        
        -- Mark invoice as paid
        UPDATE invoices 
        SET status = 'paid'::invoice_status,
            paid_at = NOW(),
            updated_at = NOW()
        WHERE id = invoice_record.id;
        
        -- Create payment record
        INSERT INTO payments (
            user_id,
            invoice_id,
            amount,
            currency,
            payment_method,
            status,
            created_at
        ) VALUES (
            invoice_record.user_id,
            invoice_record.id,
            invoice_record.amount,
            invoice_record.currency,
            'credit_balance',
            'completed'::payment_status,
            NOW()
        );
        
        payment_count := payment_count + 1;
    END LOOP;
    
    RETURN payment_count;
END;
$ LANGUAGE plpgsql;

-- Create a scheduled job function (to be called by cron or external scheduler)
CREATE OR REPLACE FUNCTION run_billing_tasks()
RETURNS JSONB AS $
DECLARE
    result JSONB;
    invoices_generated INTEGER;
    payments_processed INTEGER;
    services_suspended INTEGER;
BEGIN
    -- Generate recurring invoices
    SELECT generate_recurring_invoices() INTO invoices_generated;
    
    -- Process automatic payments
    SELECT process_auto_payments() INTO payments_processed;
    
    -- Suspend overdue services
    SELECT suspend_overdue_services() INTO services_suspended;
    
    result := jsonb_build_object(
        'invoices_generated', invoices_generated,
        'payments_processed', payments_processed,
        'services_suspended', services_suspended,
        'run_at', NOW()
    );
    
    RETURN result;
END;
$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION generate_recurring_invoices() TO authenticated;
GRANT EXECUTE ON FUNCTION process_auto_payments() TO authenticated;
GRANT EXECUTE ON FUNCTION suspend_overdue_services() TO authenticated;
GRANT EXECUTE ON FUNCTION run_billing_tasks() TO authenticated;

COMMENT ON FUNCTION generate_recurring_invoices() IS 'Generates recurring invoices for active services';
COMMENT ON FUNCTION process_auto_payments() IS 'Processes automatic payments from credit balance';
COMMENT ON FUNCTION suspend_overdue_services() IS 'Suspends services with overdue invoices';
COMMENT ON FUNCTION run_billing_tasks() IS 'Runs all billing maintenance tasks';