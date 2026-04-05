import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";

export interface OrderData {
  items: CartItem[];
  domainOption?: {
    type: 'new' | 'existing' | 'subdomain';
    domain?: string;
    price?: number;
  };
  paymentMethod: string;
  promoCode?: string;
  discount?: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  items: any[];
  domain_option?: any;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  total: number;
  currency: string;
  promo_code?: string;
  discount_percentage?: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export const orderService = {
  async createOrder(orderData: OrderData): Promise<Order> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + item.price + (item.setupFee || 0), 0) + 
                    (orderData.domainOption?.price || 0);
    
    const discountAmount = orderData.discount ? (subtotal * orderData.discount / 100) : 0;
    const total = subtotal - discountAmount;

    // Create order
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        user_id: user.id,
        items: orderData.items,
        domain_option: orderData.domainOption,
        payment_method: orderData.paymentMethod,
        subtotal,
        discount_amount: discountAmount,
        total,
        currency: orderData.items[0]?.currency || 'KSh',
        promo_code: orderData.promoCode,
        discount_percentage: orderData.discount,
        status: 'pending',
        payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }

    // Create order items for better tracking
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      type: item.type,
      plan_id: item.planId,
      name: item.name,
      description: `${item.name} - ${item.billingCycle}`,
      unit_price: item.price,
      total_price: item.price,
      billing_cycle: item.billingCycle,
      domain: item.domain,
      features: item.features,
      setup_fee: item.setupFee || 0,
      renewal_price: item.renewalPrice
    }));

    // Add domain as separate item if applicable
    if (orderData.domainOption?.type === 'new' && orderData.domainOption.domain && orderData.domainOption.price) {
      orderItems.push({
        order_id: order.id,
        type: 'domain',
        plan_id: null,
        name: `Domain Registration - ${orderData.domainOption.domain}`,
        description: `1 year registration for ${orderData.domainOption.domain}`,
        unit_price: orderData.domainOption.price,
        total_price: orderData.domainOption.price,
        billing_cycle: 'annually',
        domain: orderData.domainOption.domain,
        features: ['1 Year Registration', 'Free DNS Management'],
        setup_fee: 0,
        renewal_price: orderData.domainOption.price
      });
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Don't throw here as the main order was created successfully
    }

    return order as Order;
  },

  async processPayment(orderId: string, paymentData: any): Promise<boolean> {
    // Simulate payment processing
    // In a real application, this would integrate with payment gateways like:
    // - M-Pesa for mobile payments
    // - PayPal for international payments
    // - Stripe for credit cards
    // - Cryptocurrency processors

    try {
      // Create payment transaction record
      const { error: transactionError } = await supabase
        .from('payment_transactions')
        .insert([{
          order_id: orderId,
          transaction_id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          payment_method: paymentData.method,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'completed', // Simulating successful payment
          gateway_response: {
            simulated: true,
            timestamp: new Date().toISOString(),
            ...paymentData
          },
          processed_at: new Date().toISOString()
        }]);

      if (transactionError) {
        console.error('Error creating payment transaction:', transactionError);
        return false;
      }

      // Update order status - this will trigger the automation
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) {
        console.error('Error updating order status:', orderError);
        return false;
      }

      // Trigger automation rules for order completion
      await this.triggerOrderCompletionAutomation(orderId);

      return true;
    } catch (error) {
      console.error('Payment processing error:', error);
      return false;
    }
  },

  async getUserOrders(userId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }

    return data as Order[];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Order not found
      }
      console.error('Error fetching order:', error);
      throw error;
    }

    return data as Order;
  },

  async validatePromoCode(code: string, orderTotal: number): Promise<{ valid: boolean; discount?: number; error?: string }> {
    const { data, error } = await supabase
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Invalid promo code' };
    }

    // Check if code is still valid
    if (data.valid_until && new Date(data.valid_until) < new Date()) {
      return { valid: false, error: 'Promo code has expired' };
    }

    // Check minimum order amount
    if (data.min_order_amount && orderTotal < data.min_order_amount) {
      return { 
        valid: false, 
        error: `Minimum order amount of ${data.min_order_amount} required` 
      };
    }

    // Check usage limit
    if (data.usage_limit && data.used_count >= data.usage_limit) {
      return { valid: false, error: 'Promo code usage limit exceeded' };
    }

    let discount = data.discount_value;
    
    // Apply maximum discount limit for percentage discounts
    if (data.discount_type === 'percentage') {
      const calculatedDiscount = (orderTotal * data.discount_value) / 100;
      if (data.max_discount_amount && calculatedDiscount > data.max_discount_amount) {
        discount = data.max_discount_amount;
      } else {
        discount = data.discount_value; // Return percentage value
      }
    }

    return { valid: true, discount };
  },

  async updatePromoCodeUsage(code: string): Promise<void> {
    const { error } = await supabase
      .from('promo_codes')
      .update({
        used_count: supabase.raw('used_count + 1')
      })
      .eq('code', code.toUpperCase());

    if (error) {
      console.error('Error updating promo code usage:', error);
    }
  },

  /**
   * Trigger automation rules when order is completed
   */
  async triggerOrderCompletionAutomation(orderId: string): Promise<void> {
    try {
      // Get order details
      const order = await this.getOrderById(orderId);
      if (!order) {
        console.error('Order not found for automation:', orderId);
        return;
      }

      // Get user details
      const { data: user } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not found for order automation');
        return;
      }

      // Prepare automation event data
      const eventData = {
        orderId: order.id,
        orderNumber: order.order_number,
        userId: order.user_id,
        email: user.user?.email,
        total: order.total,
        currency: order.currency,
        items: order.items,
        paymentMethod: order.payment_method
      };

      // Call the database function to trigger automation rules
      const { error } = await supabase.rpc('trigger_automation_rules', {
        event_name: 'order_completed',
        event_data: eventData
      });

      if (error) {
        console.error('Error triggering automation rules:', error);
      } else {
        console.log('Automation rules triggered successfully for order:', orderId);
      }
    } catch (error) {
      console.error('Error in order completion automation:', error);
    }
  },

  /**
   * Get order statistics for dashboard
   */
  async getOrderStats(userId?: string): Promise<any> {
    let query = supabase
      .from('orders')
      .select('status, total, created_at');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching order stats:', error);
      return null;
    }

    const stats = {
      total: data?.length || 0,
      completed: data?.filter(o => o.status === 'completed').length || 0,
      pending: data?.filter(o => o.status === 'pending').length || 0,
      revenue: data?.filter(o => o.status === 'completed').reduce((sum, o) => sum + parseFloat(o.total), 0) || 0
    };

    return stats;
  }
};