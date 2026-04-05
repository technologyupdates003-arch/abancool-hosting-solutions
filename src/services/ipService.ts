import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export const ipService = {
  async checkIPStatus(ipAddress: string) {
    const { data, error } = await supabase
      .from('blocked_ips')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('is_blocked', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    return {
      isBlocked: !!data,
      blockInfo: data
    };
  },

  async unblockIP(ipAddress: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update existing blocked IP record
    const { data, error } = await supabase
      .from('blocked_ips')
      .update({
        is_blocked: false,
        unblocked_at: new Date().toISOString()
      })
      .eq('ip_address', ipAddress)
      .eq('is_blocked', true)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBlockedIPs(userId?: string) {
    let query = supabase
      .from('blocked_ips')
      .select('*')
      .eq('is_blocked', true);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('blocked_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mock function for demonstration
  async mockCheckIP(ipAddress: string) {
    // Simulate different scenarios
    const scenarios = [
      {
        isBlocked: false,
        message: `No block found on server: da25.host-ww.net - Hosting`
      },
      {
        isBlocked: true,
        message: `IP ${ipAddress} is currently blocked due to suspicious activity. Click "Unblock" to remove the block.`
      }
    ];

    // Return random scenario (70% chance not blocked)
    const scenario = Math.random() > 0.3 ? scenarios[0] : scenarios[1];
    
    return {
      ...scenario,
      ipAddress,
      server: 'da25.host-ww.net',
      service: 'Hosting'
    };
  }
};