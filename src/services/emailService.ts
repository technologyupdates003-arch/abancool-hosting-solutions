import { supabase } from "@/integrations/supabase/client";

export interface EmailTemplate {
  id: string;
  template_name: string;
  subject: string;
  html_content: string;
  text_content?: string;
  variables: string[];
}

export interface QueuedEmail {
  id: string;
  to_email: string;
  from_email: string;
  subject: string;
  html_content: string;
  text_content?: string;
  template_name?: string;
  template_data: any;
  status: 'pending' | 'sent' | 'failed' | 'retry';
  attempts: number;
  max_attempts: number;
  scheduled_at: string;
  sent_at?: string;
  error_message?: string;
}

export const emailService = {
  /**
   * Queue an email for sending
   */
  async queueEmail(emailData: {
    to: string;
    subject?: string;
    template: string;
    data: any;
    scheduledAt?: Date;
  }): Promise<void> {
    try {
      // Get template
      const template = await this.getTemplate(emailData.template);
      if (!template) {
        throw new Error(`Email template '${emailData.template}' not found`);
      }

      // Process template with data
      const processedEmail = this.processTemplate(template, emailData.data);

      // Queue the email
      const { error } = await supabase
        .from('email_queue')
        .insert([{
          to_email: emailData.to,
          subject: emailData.subject || processedEmail.subject,
          html_content: processedEmail.html_content,
          text_content: processedEmail.text_content,
          template_name: emailData.template,
          template_data: emailData.data,
          scheduled_at: emailData.scheduledAt?.toISOString() || new Date().toISOString()
        }]);

      if (error) {
        throw error;
      }

      console.log(`Email queued successfully: ${emailData.template} to ${emailData.to}`);
    } catch (error) {
      console.error('Error queueing email:', error);
      throw error;
    }
  },

  /**
   * Get email template by name
   */
  async getTemplate(templateName: string): Promise<EmailTemplate | null> {
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('template_name', templateName)
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching email template:', error);
      return null;
    }

    return data as EmailTemplate;
  },

  /**
   * Process template with data
   */
  processTemplate(template: EmailTemplate, data: any): { subject: string; html_content: string; text_content?: string } {
    let subject = template.subject;
    let htmlContent = template.html_content;
    let textContent = template.text_content;

    // Replace variables in template
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      const value = data[key] || '';
      
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      htmlContent = htmlContent.replace(new RegExp(placeholder, 'g'), value);
      if (textContent) {
        textContent = textContent.replace(new RegExp(placeholder, 'g'), value);
      }
    });

    return {
      subject,
      html_content: htmlContent,
      text_content: textContent
    };
  },

  /**
   * Process email queue (to be called by cron job or background process)
   */
  async processQueue(): Promise<void> {
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
        await this.processEmail(email);
      }
    } catch (error) {
      console.error('Error processing email queue:', error);
    }
  },

  /**
   * Process individual email
   */
  async processEmail(email: QueuedEmail): Promise<void> {
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
      // Examples:
      // - SendGrid: await this.sendViaSendGrid(email);
      // - Mailgun: await this.sendViaMailgun(email);
      // - AWS SES: await this.sendViaSES(email);
      
      console.log(`Processing email: ${email.subject} to ${email.to_email}`);
      console.log('Email content preview:', {
        subject: email.subject,
        to: email.to_email,
        template: email.template_name,
        htmlPreview: email.html_content.substring(0, 200) + '...'
      });
      
      // Simulate successful sending
      await this.markEmailAsSent(email.id);

    } catch (error) {
      console.error(`Error processing email ${email.id}:`, error);
      await this.markEmailAsFailed(email.id, error instanceof Error ? error.message : 'Unknown error');
    }
  },

  /**
   * Mark email as sent
   */
  async markEmailAsSent(emailId: string): Promise<void> {
    await supabase
      .from('email_queue')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', emailId);
  },

  /**
   * Mark email as failed
   */
  async markEmailAsFailed(emailId: string, errorMessage: string): Promise<void> {
    const { data: email } = await supabase
      .from('email_queue')
      .select('attempts, max_attempts')
      .eq('id', emailId)
      .single();

    const status = email && email.attempts >= email.max_attempts ? 'failed' : 'retry';

    await supabase
      .from('email_queue')
      .update({
        status,
        error_message: errorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('id', emailId);
  },

  /**
   * Get email history for user
   */
  async getEmailHistory(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('email_history')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching email history:', error);
      return [];
    }

    return data || [];
  },

  /**
   * Send test email (for development/testing)
   */
  async sendTestEmail(to: string, template: string, data: any): Promise<void> {
    await this.queueEmail({
      to,
      template,
      data: {
        ...data,
        testMode: true,
        sentAt: new Date().toISOString()
      }
    });

    // Process immediately for testing
    setTimeout(() => {
      this.processQueue();
    }, 1000);
  }
};