import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { RefreshCw, Send, Search, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export function EmailManagementModule() {
  const [emails, setEmails] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"queue" | "templates">("queue");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [queueRes, templatesRes] = await Promise.all([
      supabase.from('email_queue').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('email_templates').select('*').order('created_at', { ascending: false })
    ]);
    setEmails(queueRes.data || []);
    setTemplates(templatesRes.data || []);
    setLoading(false);
  };

  const processQueue = async () => {
    toast.info("Processing email queue...");
    const { error } = await supabase.rpc('process_email_queue');
    if (error) toast.error("Failed to process queue");
    else { toast.success("Email queue processed"); loadData(); }
  };

  const filteredEmails = emails.filter(e => {
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchSearch = !searchTerm || e.to_email?.toLowerCase().includes(searchTerm.toLowerCase()) || e.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    pending: emails.filter(e => e.status === 'pending').length,
    sent: emails.filter(e => e.status === 'sent').length,
    failed: emails.filter(e => e.status === 'failed').length,
    total: emails.length
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Email System</h2>
          <p className="text-gray-600">Manage email queue and templates</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={processQueue} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />Process Queue
          </Button>
          <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{stats.total}</div><div className="text-xs text-gray-500">Total Emails</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div><div className="text-xs text-gray-500">Pending</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{stats.sent}</div><div className="text-xs text-gray-500">Sent</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{stats.failed}</div><div className="text-xs text-gray-500">Failed</div></CardContent></Card>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === "queue" ? "default" : "outline"} onClick={() => setActiveTab("queue")}>Email Queue</Button>
        <Button variant={activeTab === "templates" ? "default" : "outline"} onClick={() => setActiveTab("templates")}>Templates ({templates.length})</Button>
      </div>

      {activeTab === "queue" && (
        <Card>
          <CardHeader>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search by email or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Scheduled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.map(email => (
                  <TableRow key={email.id}>
                    <TableCell>{getStatusIcon(email.status)}</TableCell>
                    <TableCell className="text-sm">{email.to_email}</TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{email.subject}</TableCell>
                    <TableCell><Badge variant="outline">{email.template_name || 'Custom'}</Badge></TableCell>
                    <TableCell>{email.attempts}/{email.max_attempts}</TableCell>
                    <TableCell className="text-xs">{new Date(email.scheduled_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {filteredEmails.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No emails found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "templates" && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map(t => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.template_name}</TableCell>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell><Badge variant={t.is_active ? "default" : "secondary"}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell className="text-xs">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {templates.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500">No templates configured</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
