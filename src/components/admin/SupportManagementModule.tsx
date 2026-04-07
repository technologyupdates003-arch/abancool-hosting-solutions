import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, RefreshCw, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function SupportManagementModule() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    setLoading(true);
    const { data } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  const openTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true });
    setReplies(data || []);
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('ticket_replies').insert({
      ticket_id: selectedTicket.id,
      user_id: session?.user?.id,
      message: replyText,
      is_staff_reply: true
    });
    if (error) toast.error("Failed to send reply");
    else {
      toast.success("Reply sent");
      setReplyText("");
      openTicket(selectedTicket);
      // Update ticket status to in_progress if open
if (selectedTicket.status === 'open') {
        await supabase.from('support_tickets').update({ status: 'in_progress' as const }).eq('id', selectedTicket.id);
        loadTickets();
      }
    }
  };

  const updateTicketStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('support_tickets').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error("Failed to update");
    else { toast.success(`Ticket ${status}`); loadTickets(); }
  };

  const filteredTickets = tickets.filter(t => {
    const matchStatus = statusFilter === "all" || t.status === statusFilter;
    const matchSearch = !searchTerm || t.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || t.ticket_number?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const getPriorityColor = (p: string) => p === 'urgent' ? 'destructive' : p === 'high' ? 'destructive' : p === 'medium' ? 'default' : 'secondary';

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Support Center</h2><p className="text-gray-600">Manage customer tickets</p></div>
        <Button variant="outline" onClick={loadTickets}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{tickets.length}</div><div className="text-xs text-gray-500">Total Tickets</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{tickets.filter(t => t.status === 'open').length}</div><div className="text-xs text-gray-500">Open</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'in_progress').length}</div><div className="text-xs text-gray-500">In Progress</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length}</div><div className="text-xs text-gray-500">Resolved</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search tickets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Ticket #</TableHead><TableHead>Subject</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {filteredTickets.map(t => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => openTicket(t)}>
                  <TableCell className="font-medium">#{t.ticket_number}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{t.subject}</TableCell>
                  <TableCell><Badge variant={getPriorityColor(t.priority) as any}>{t.priority}</Badge></TableCell>
                  <TableCell><Badge variant={t.status === 'open' ? 'destructive' : t.status === 'in_progress' ? 'default' : 'secondary'}>{t.status}</Badge></TableCell>
                  <TableCell className="text-xs">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {t.status !== 'resolved' && <Button size="sm" variant="outline" onClick={() => updateTicketStatus(t.id, 'resolved')}>Resolve</Button>}
                      {t.status !== 'closed' && <Button size="sm" variant="ghost" onClick={() => updateTicketStatus(t.id, 'closed')}>Close</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTickets.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No tickets found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicket?.ticket_number} - {selectedTicket?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Card><CardContent className="p-4"><p className="text-sm whitespace-pre-wrap">{selectedTicket?.message}</p><p className="text-xs text-gray-400 mt-2">Customer · {selectedTicket?.created_at && new Date(selectedTicket.created_at).toLocaleString()}</p></CardContent></Card>
            {replies.map(r => (
              <Card key={r.id} className={r.is_staff_reply ? 'border-blue-200 bg-blue-50' : ''}>
                <CardContent className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{r.is_staff_reply ? 'Staff' : 'Customer'} · {new Date(r.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
            <div className="flex gap-2">
              <Textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your reply..." className="flex-1" />
              <Button onClick={sendReply} className="self-end"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
