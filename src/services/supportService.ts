import { supabase } from "@/integrations/supabase/client";

export interface SupportCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sort_order: number;
  is_active: boolean;
}

export interface AbuseReport {
  id?: string;
  reporter_email: string;
  report_type: string;
  domain_url: string;
  description: string;
  evidence?: string;
  contact_info?: string;
  status?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category?: string;
  status?: string;
}

export interface SystemStatus {
  id: string;
  service_name: string;
  status: 'operational' | 'degraded' | 'outage';
  description: string;
  last_updated: string;
}

export const supportService = {
  async getSupportCategories() {
    const { data, error } = await supabase
      .from('support_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error) {
      console.error('Error fetching support categories:', error);
      throw error;
    }

    return data as SupportCategory[];
  },

  async submitAbuseReport(report: AbuseReport) {
    const { data, error } = await supabase
      .from('abuse_reports')
      .insert([{
        reporter_email: report.reporter_email,
        report_type: report.report_type,
        domain_url: report.domain_url,
        description: report.description,
        evidence: report.evidence,
        contact_info: report.contact_info,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting abuse report:', error);
      throw error;
    }

    return data;
  },

  async submitContactMessage(message: ContactMessage) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        category: message.category || 'general',
        status: 'new'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting contact message:', error);
      throw error;
    }

    return data;
  },

  async getSystemStatus() {
    const { data, error } = await supabase
      .from('system_status')
      .select('*')
      .order('service_name');

    if (error) {
      console.error('Error fetching system status:', error);
      throw error;
    }

    return data as SystemStatus[];
  },

  async subscribeToNewsletter(email: string, name?: string) {
    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert([{
        email,
        name,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      // If email already exists, update the subscription
      if (error.code === '23505') {
        const { data: updateData, error: updateError } = await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            unsubscribed_at: null,
            name: name || undefined
          })
          .eq('email', email)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating newsletter subscription:', updateError);
          throw updateError;
        }

        return updateData;
      }

      console.error('Error subscribing to newsletter:', error);
      throw error;
    }

    return data;
  }
};