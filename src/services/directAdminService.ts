import { supabase } from "@/integrations/supabase/client";

export interface DirectAdminAccount {
  username: string;
  password: string;
  domain: string;
  package: string;
  email: string;
  ip: string;
}

export interface DirectAdminCredentials {
  username: string;
  password: string;
  loginUrl: string;
  serverIp: string;
}

export const directAdminService = {
  /**
   * Create a new hosting account in DirectAdmin
   */
  async createAccount(orderData: any, customerData: any): Promise<DirectAdminCredentials> {
    try {
      const username = this.generateUsername(customerData.email);
      const password = this.generatePassword();
      const serverIp = "197.248.184.158"; // Your server IP
      const loginUrl = `http://${serverIp}:2222`;
      const domain = orderData.domainOption?.domain || `${username}.abancool.com`;

      // Get the appropriate package for the hosting plan
      const packageName = this.mapPlanToPackage(orderData.items[0]?.name);

      // Simulate DirectAdmin API call
      const accountData: DirectAdminAccount = {
        username,
        password,
        domain,
        package: packageName,
        email: customerData.email,
        ip: serverIp
      };

      console.log('Creating DirectAdmin account:', {
        ...accountData,
        password: '***hidden***' // Don't log actual password
      });

      // In production, this would be the actual DirectAdmin API call:
      // const response = await this.callDirectAdminAPI('create_user', accountData);
      
      // Store account details in database
      await this.storeAccountDetails(orderData.orderId, accountData, customerData.userId);

      // Queue welcome email with credentials
      await this.queueWelcomeEmail(customerData, {
        username,
        password,
        loginUrl,
        serverIp,
        domain,
        packageName
      });

      return {
        username,
        password,
        loginUrl,
        serverIp
      };
    } catch (error) {
      console.error('Error creating DirectAdmin account:', error);
      throw new Error('Failed to create hosting account. Please contact support.');
    }
  },

  /**
   * Generate a unique username from email
   */
  generateUsername(email: string): string {
    const baseUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${baseUsername}${randomSuffix}`.substring(0, 8); // DirectAdmin username limit
  },

  /**
   * Generate a secure password
   */
  generatePassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  },

  /**
   * Map hosting plan to DirectAdmin package
   */
  mapPlanToPackage(planName: string): string {
    const packageMap: { [key: string]: string } = {
      'Web_Starter': 'starter_package',
      'Web_Basic': 'basic_package',
      'Web_Power': 'power_package',
      'Web_Business': 'business_package',
      'Starter Hosting': 'shared_starter',
      'Business Hosting': 'shared_business',
      'Premium Hosting': 'shared_premium',
      'Enterprise Hosting': 'shared_enterprise'
    };

    return packageMap[planName] || 'default_package';
  },

  /**
   * Store account details in database
   */
  async storeAccountDetails(orderId: string, accountData: DirectAdminAccount, userId: string): Promise<void> {
    try {
      // Store in service_provisioning table
      const { error: provisioningError } = await supabase
        .from('service_provisioning')
        .insert([{
          order_id: orderId,
          status: 'provisioned',
          domain: accountData.domain,
          provisioning_data: {
            directadmin: {
              username: accountData.username,
              domain: accountData.domain,
              package: accountData.package,
              server_ip: accountData.ip,
              created_at: new Date().toISOString()
            }
          },
          provisioned_at: new Date().toISOString()
        }]);

      if (provisioningError) {
        console.error('Error storing provisioning details:', provisioningError);
      }

      // Store in directadmin_accounts table
      const { error: accountError } = await supabase
        .from('directadmin_accounts')
        .insert([{
          user_id: userId,
          order_id: orderId,
          username: accountData.username,
          domain: accountData.domain,
          package_name: accountData.package,
          server_ip: accountData.ip,
          status: 'active'
        }]);

      if (accountError) {
        console.error('Error storing DirectAdmin account:', accountError);
      }
    } catch (error) {
      console.error('Error storing account details:', error);
      throw error;
    }
  },

  /**
   * Queue welcome email with DirectAdmin credentials
   */
  async queueWelcomeEmail(customerData: any, credentials: DirectAdminCredentials & { domain: string; packageName: string }): Promise<void> {
    try {
      const emailData = {
        to_email: customerData.email,
        template_name: 'welcome_hosting',
        template_data: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          username: credentials.username,
          password: credentials.password,
          loginUrl: credentials.loginUrl,
          serverIp: credentials.serverIp,
          domain: credentials.domain,
          packageName: credentials.packageName,
          supportEmail: 'support@abancool.com',
          supportPhone: '+254 700 000 000',
          companyName: 'Abancool Technology'
        }
      };

      // Queue email for immediate sending
      const { error } = await supabase
        .from('email_queue')
        .insert([emailData]);

      if (error) {
        console.error('Error queueing welcome email:', error);
        throw error;
      }

      console.log('Welcome email queued successfully for:', customerData.email);

      // Also store in email history
      const { error: historyError } = await supabase
        .from('email_history')
        .insert([{
          user_id: customerData.userId,
          subject: 'Welcome to Abancool Technology - Your Hosting Account is Ready!',
          email_type: 'welcome_hosting',
          sent_at: new Date().toISOString()
        }]);

      if (historyError) {
        console.error('Error storing email history:', historyError);
      }
    } catch (error) {
      console.error('Error queueing welcome email:', error);
      throw error;
    }
  },

  /**
   * Queue invoice email
   */
  async sendInvoiceEmail(orderData: any, customerData: any): Promise<void> {
    try {
      const invoiceData = {
        to_email: customerData.email,
        template_name: 'invoice',
        template_data: {
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          orderNumber: orderData.orderNumber,
          total: orderData.total,
          currency: orderData.currency,
          items: orderData.items,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          paymentMethods: 'M-Pesa, Bank Transfer, PayPal',
          companyName: 'Abancool Technology',
          supportEmail: 'support@abancool.com'
        }
      };

      // Queue invoice email
      const { error } = await supabase
        .from('email_queue')
        .insert([invoiceData]);

      if (error) {
        console.error('Error queueing invoice email:', error);
        throw error;
      }

      console.log('Invoice email queued successfully for:', customerData.email);

      // Store email in history
      const { error: historyError } = await supabase
        .from('email_history')
        .insert([{
          user_id: customerData.userId,
          subject: `Invoice #${orderData.orderNumber} - Abancool Technology`,
          email_type: 'invoice',
          sent_at: new Date().toISOString()
        }]);

      if (historyError) {
        console.error('Error storing email history:', historyError);
      }
    } catch (error) {
      console.error('Error queueing invoice email:', error);
      throw error;
    }
  },

  /**
   * Get account status from DirectAdmin
   */
  async getAccountStatus(username: string): Promise<{ status: string; usage: any }> {
    // In real implementation, this would query DirectAdmin API
    return {
      status: 'active',
      usage: {
        disk: { used: '1.2 GB', total: '10 GB', percentage: 12 },
        bandwidth: { used: '500 MB', total: 'Unlimited', percentage: 0 },
        domains: { used: 1, total: 5 },
        emails: { used: 3, total: 25 }
      }
    };
  },

  /**
   * Call DirectAdmin API (production implementation)
   */
  async callDirectAdminAPI(action: string, params: any): Promise<any> {
    // This would be the actual DirectAdmin API integration
    // Example implementation:
    /*
    const serverConfig = await this.getServerConfig();
    const apiUrl = `https://${serverConfig.hostname}:${serverConfig.port}/CMD_API_${action.toUpperCase()}`;
    
    const formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${serverConfig.api_username}:${serverConfig.api_password}`)}`
      },
      body: formData
    });
    
    return await response.text();
    */
    
    // For now, return simulated success
    console.log(`DirectAdmin API call: ${action}`, params);
    return { success: true, message: 'Account created successfully' };
  },

  /**
   * Get server configuration
   */
  async getServerConfig(): Promise<any> {
    const { data, error } = await supabase
      .from('directadmin_servers')
      .select('*')
      .eq('status', 'active')
      .limit(1)
      .single();

    if (error || !data) {
      throw new Error('No active DirectAdmin server found');
    }

    return data;
  },

  /**
   * Process email queue (can be called by a cron job)
   */
  async processEmailQueue(): Promise<void> {
    try {
      const { data: emails, error } = await supabase
        .from('email_queue')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .lt('attempts', 3)
        .order('scheduled_at')
        .limit(10);

      if (error) {
        console.error('Error fetching email queue:', error);
        return;
      }

      for (const email of emails || []) {
        try {
          // Update attempts
          await supabase
            .from('email_queue')
            .update({ 
              attempts: email.attempts + 1,
              updated_at: new Date().toISOString()
            })
            .eq('id', email.id);

          // In production, integrate with email service here
          // await this.sendEmailViaService(email);
          
          console.log(`Processing email: ${email.subject} to ${email.to_email}`);
          
          // Mark as sent (simulated)
          await supabase
            .from('email_queue')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', email.id);

        } catch (emailError) {
          console.error(`Error processing email ${email.id}:`, emailError);
          
          // Mark as failed if max attempts reached
          if (email.attempts >= 2) {
            await supabase
              .from('email_queue')
              .update({
                status: 'failed',
                error_message: emailError instanceof Error ? emailError.message : 'Unknown error',
                updated_at: new Date().toISOString()
              })
              .eq('id', email.id);
          }
        }
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  }
};