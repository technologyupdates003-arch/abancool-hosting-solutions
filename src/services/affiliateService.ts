import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export const affiliateService = {
  async activateAffiliateAccount() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if affiliate account already exists
    const { data: existing } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      // Update existing account to active
      const { data, error } = await supabase
        .from('affiliate_accounts')
        .update({ is_active: true })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Generate affiliate code
    const affiliateCode = `AFF_${user.id.substring(0, 8).toUpperCase()}_${Date.now().toString().slice(-6)}`;

    // Create new affiliate account
    const { data, error } = await supabase
      .from('affiliate_accounts')
      .insert({
        user_id: user.id,
        affiliate_code: affiliateCode,
        is_active: true,
        commission_rate: 10.00,
        total_earnings: 0.00
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAffiliateAccount(userId: string) {
    const { data, error } = await supabase
      .from('affiliate_accounts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateAffiliateAccount(userId: string, updates: Partial<Tables<'affiliate_accounts'>>) {
    const { data, error } = await supabase
      .from('affiliate_accounts')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};