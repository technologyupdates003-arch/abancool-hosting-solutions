import { supabase } from "@/integrations/supabase/client";
import { directAdminService } from "./directAdminService";
import { emailService } from "./emailService";

export interface AutomationRule {
  id: string;
  name: string;
  description?: string;
  trigger_event: string;
  conditions: any;
  actions: any[];
  is_active: boolean;
  execution_count: number;
  last_executed?: string;
}

export const automationService = {
  /**
   * Process all pending automations
   */
  async processAutomations(): Promise<void> {
    try {
      // Process email queue
      await emailService.processQueue();
      
      // Process DirectAdmin queue
      await directAdminService.processEmailQueue();
      
      console.log('Automation processing completed');
    } catch (error) {
      console.error('Error processing automations:', error);
    }
  },

  /**
   * Trigger automation rules for a specific event
   */
  async triggerEvent(eventName: string, eventData: any): Promise<void> {
    try {
      // Get matching automation rules
      const { data: rules, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('trigger_event', eventName)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching automation rules:', error);
        return;
      }

      // Process each rule
      for (const rule of rules || []) {
        await this.executeRule(rule, eventData);
      }
    } catch (error) {
      console.error('Error triggering automation event:', error);
    }
  },

  /**
   * Execute a specific automation rule
   */
  async executeRule(rule: AutomationRule, eventData: any): Promise<void> {
    try {
      console.log(`Executing automation rule: ${rule.name}`);

      // Check conditions if any
      if (rule.conditions && !this.checkConditions(rule.conditions, eventData)) {
        console.log(`Conditions not met for rule: ${rule.name}`);
        return;
      }

      // Execute actions
      for (const action of rule.actions) {
        await this.executeAction(action, eventData);
      }

      // Update rule execution count
      await supabase
        .from('automation_rules')
        .update({
          execution_count: rule.execution_count + 1,
          last_executed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', rule.id);

      console.log(`Automation rule executed successfully: ${rule.name}`);
    } catch (error) {
      console.error(`Error executing automation rule ${rule.name}:`, error);
    }
  },

  /**
   * Execute a specific action
   */
  async executeAction(action: any, eventData: any): Promise<void> {
    const delay = action.delay || 0;

    // Apply delay if specified
    if (delay > 0) {
      setTimeout(async () => {
        await this.performAction(action, eventData);
      }, delay * 1000);
    } else {
      await this.performAction(action, eventData);
    }
  },

  /**
   * Perform the actual action
   */
  async performAction(action: any, eventData: any): Promise<void> {
    switch (action.type) {
      case 'send_email':
        await this.sendEmailAction(action, eventData);
        break;
      
      case 'create_directadmin_account':
        await this.createDirectAdminAccountAction(action, eventData);
        break;
      
      case 'update_order_status':
        await this.updateOrderStatusAction(action, eventData);
        break;
      
      case 'send_notification':
        await this.sendNotificationAction(action, eventData);
        break;
      
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  },

  /**
   * Send email action
   */
  async sendEmailAction(action: any, eventData: any): Promise<void> {
    if (!eventData.email || !action.template) {
      console.error('Missing email or template for send_email action');
      return;
    }

    await emailService.queueEmail({
      to: eventData.email,
      template: action.template,
      data: eventData,
      scheduledAt: action.delay ? new Date(Date.now() + action.delay * 1000) : undefined
    });
  },

  /**
   * Create DirectAdmin account action
   */
  async createDirectAdminAccountAction(action: any, eventData: any): Promise<void> {
    if (!eventData.orderId) {
      console.error('Missing orderId for create_directadmin_account action');
      return;
    }

    try {
      // Get order details
      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', eventData.orderId)
        .single();

      if (error || !order) {
        console.error('Order not found for DirectAdmin account creation:', eventData.orderId);
        return;
      }

      // Get user details
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('id', order.user_id)
        .single();

      if (userError || !userData) {
        console.error('User not found for DirectAdmin account creation:', order.user_id);
        return;
      }

      // Create DirectAdmin account
      await directAdminService.createAccount(
        {
          orderId: order.id,
          items: order.items,
          domainOption: order.domain_option
        },
        {
          email: userData.email,
          firstName: userData.user_metadata?.first_name || '',
          lastName: userData.user_metadata?.last_name || '',
          userId: userData.id
        }
      );
    } catch (error) {
      console.error('Error creating DirectAdmin account via automation:', error);
    }
  },

  /**
   * Update order status action
   */
  async updateOrderStatusAction(action: any, eventData: any): Promise<void> {
    if (!eventData.orderId || !action.status) {
      console.error('Missing orderId or status for update_order_status action');
      return;
    }

    await supabase
      .from('orders')
      .update({
        status: action.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', eventData.orderId);
  },

  /**
   * Send notification action
   */
  async sendNotificationAction(action: any, eventData: any): Promise<void> {
    // This could integrate with push notifications, SMS, Slack, etc.
    console.log('Notification:', {
      type: action.notification_type || 'info',
      message: action.message,
      data: eventData
    });
  },

  /**
   * Check if conditions are met
   */
  checkConditions(conditions: any, eventData: any): boolean {
    // Simple condition checking - can be expanded
    if (conditions.min_order_amount && eventData.total < conditions.min_order_amount) {
      return false;
    }

    if (conditions.payment_method && eventData.paymentMethod !== conditions.payment_method) {
      return false;
    }

    if (conditions.user_type && eventData.userType !== conditions.user_type) {
      return false;
    }

    return true;
  },

  /**
   * Create a new automation rule
   */
  async createRule(ruleData: {
    name: string;
    description?: string;
    triggerEvent: string;
    conditions?: any;
    actions: any[];
  }): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .insert([{
        name: ruleData.name,
        description: ruleData.description,
        trigger_event: ruleData.triggerEvent,
        conditions: ruleData.conditions || {},
        actions: ruleData.actions,
        is_active: true
      }]);

    if (error) {
      console.error('Error creating automation rule:', error);
      throw error;
    }
  },

  /**
   * Get all automation rules
   */
  async getRules(): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching automation rules:', error);
      return [];
    }

    return data as AutomationRule[];
  },

  /**
   * Start automation processing (can be called periodically)
   */
  startAutomationProcessor(intervalMs: number = 30000): void {
    console.log('Starting automation processor...');
    
    // Process immediately
    this.processAutomations();
    
    // Set up interval processing
    setInterval(() => {
      this.processAutomations();
    }, intervalMs);
  }
};