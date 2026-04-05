import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export const ticketService = {
  async createTicket(ticketData: {
    department: string;
    subject: string;
    message: string;
    priority?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Generate a ticket number
    const ticketNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

    const { data, error } = await supabase
      .from('support_tickets')
      .insert([{
        user_id: user.id,
        ticket_number: ticketNumber,
        subject: ticketData.subject,
        message: ticketData.message,
        priority: (ticketData.priority || 'medium') as any,
        status: 'open' as const
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserTickets(userId: string, status?: string) {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId);

    if (status) {
      query = query.eq('status', status as any);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTicketById(ticketId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        ticket_replies (
          *,
          profiles (first_name, last_name, email)
        )
      `)
      .eq('id', ticketId)
      .single();

    if (error) throw error;
    return data;
  },

  async addTicketReply(ticketId: string, message: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('ticket_replies')
      .insert({
        ticket_id: ticketId,
        user_id: user.id,
        message,
        is_staff_reply: false
      })
      .select()
      .single();

    if (error) throw error;

    // Update ticket status to 'open' when user replies
    await supabase
      .from('support_tickets')
      .update({ status: 'open' })
      .eq('id', ticketId);

    return data;
  },

  async getTicketStats(userId: string) {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      open: 0,
      answered: 0,
      customer_reply: 0,
      closed: 0
    };

    data.forEach(ticket => {
      switch (ticket.status) {
        case 'open':
          stats.open++;
          break;
        case 'in_progress':
          stats.answered++;
          break;
        case 'resolved':
          stats.customer_reply++;
          break;
        case 'closed':
          stats.closed++;
          break;
      }
    });

    return stats;
  }
};