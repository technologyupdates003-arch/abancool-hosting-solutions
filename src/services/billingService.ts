import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export const billingService = {
  // Invoices
  async getUserInvoices(userId: string, status?: string) {
    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status as any);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getInvoiceStats(userId: string) {
    const { data, error } = await supabase
      .from('invoices')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      paid: 0,
      unpaid: 0,
      cancelled: 0,
      refunded: 0
    };

    data.forEach(invoice => {
      stats[invoice.status as keyof typeof stats]++;
    });

    return stats;
  },

  // Quotes
  async getUserQuotes(userId: string, status?: string) {
    let query = supabase
      .from('quotes')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status as any);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getQuoteStats(userId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      draft: 0,
      sent: 0,
      accepted: 0,
      declined: 0,
      expired: 0
    };

    data.forEach(quote => {
      stats[quote.status as keyof typeof stats]++;
    });

    return stats;
  },

  // Payments
  async addFunds(amount: number, paymentMethod: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount,
        payment_method: paymentMethod,
        currency: 'KSh',
        status: 'pending'
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // In a real implementation, you would integrate with payment gateway here
    // For now, we'll simulate successful payment and update credit balance
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update payment status to completed
    await supabase
      .from('payments')
      .update({ 
        status: 'completed',
        transaction_id: `TXN_${Date.now()}`
      })
      .eq('id', payment.id);

    // Update user's credit balance
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credit_balance')
      .eq('id', user.id)
      .single();

    if (profileError) throw profileError;

    const newBalance = (profile.credit_balance || 0) + amount;

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ credit_balance: newBalance })
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return { payment, profile: updatedProfile };
  },

  async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};