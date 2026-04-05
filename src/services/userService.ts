import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export const userService = {
  // User Invitations
  async inviteUser(email: string, permissions: string = 'all') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('user_invitations')
      .insert({
        inviter_id: user.id,
        email,
        permissions,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserInvitations(userId: string) {
    const { data, error } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('inviter_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Profile Management
  async updateProfile(updates: TablesUpdate<'profiles'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async refreshSupportPIN() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const newPIN = Math.floor(100000 + Math.random() * 900000).toString();
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ support_pin: newPIN })
      .eq('id', user.id)
      .select('support_pin')
      .single();

    if (error) throw error;
    return data.support_pin;
  },

  async updateSSOSettings(enabled: boolean) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({ sso_enabled: enabled })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateEmailPreferences(preferences: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .update({ email_preferences: preferences })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};