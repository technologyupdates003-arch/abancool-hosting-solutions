import { supabase } from "@/integrations/supabase/client";

export interface ResellerApplication {
  id?: string;
  user_id?: string;
  company_name: string;
  website?: string;
  business_type: string;
  expected_clients: number;
  experience_level: string;
  marketing_plan?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export const resellerService = {
  async submitApplication(application: ResellerApplication) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be logged in to submit reseller application');
    }

    const { data, error } = await supabase
      .from('reseller_applications')
      .insert([{
        user_id: user.id,
        company_name: application.company_name,
        website: application.website,
        business_type: application.business_type,
        expected_clients: application.expected_clients,
        experience_level: application.experience_level,
        marketing_plan: application.marketing_plan,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error submitting reseller application:', error);
      throw error;
    }

    return data;
  },

  async getUserApplication(userId: string) {
    const { data, error } = await supabase
      .from('reseller_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user reseller application:', error);
      throw error;
    }

    return data as ResellerApplication | null;
  },

  async getResellerPlans() {
    const { data, error } = await supabase
      .from('hosting_plans')
      .select('*')
      .eq('category', 'Reseller Hosting')
      .eq('is_active', true)
      .order('price');

    if (error) {
      console.error('Error fetching reseller plans:', error);
      throw error;
    }

    return data;
  }
};