import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, DollarSign, FileText, CreditCard } from "lucide-react";
import { toast } from "sonner";

export function BillingManagementModule() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [invRes, payRes] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100)
    ]);
    setInvoices(invRes.data || []);
    setPayments(payRes.data || []);
    setLoading(false);
  };

  const updateInvoiceStatus = async (id: string, status: string) => {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (status === 'paid') updates.paid_at = new Date().toISOString();
    const { error } = await supabase.from('invoices').update(updates).eq('id', id);
    if (error) toast.error("Failed to update invoice");
    else { toast.success(`Invoice marked as ${status}`); loadData(); }
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchStatus = statusFilter === "all" || inv.status === statusFilter;
    const matchSearch = !searchTerm || inv.invoice_number?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);
  const unpaidTotal = invoices.filter(i => i.status === 'unpaid').reduce((s, i) => s + (i.amount || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Billing & Invoices</h2><p className="text-gray-600">Financial management</p></div>
        <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{invoices.length}</div><div className="text-xs text-gray-500">Total Invoices</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-red-600">{invoices.filter(i => i.status === 'unpaid').length}</div><div className="text-xs text-gray-500">Unpaid</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">KSh {totalRevenue.toFixed(0)}</div><div className="text-xs text-gray-500">Revenue Collected</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-orange-600">KSh {unpaidTotal.toFixed(0)}</div><div className="text-xs text-gray-500">Outstanding</div></CardContent></Card>
      </div>

      <div className="flex gap-2">
        <Button variant={activeTab === "invoices" ? "default" : "outline"} onClick={() => setActiveTab("invoices")}><FileText className="w-4 h-4 mr-2" />Invoices ({invoices.length})</Button>
        <Button variant={activeTab === "payments" ? "default" : "outline"} onClick={() => setActiveTab("payments")}><CreditCard className="w-4 h-4 mr-2" />Payments ({payments.length})</Button>
      </div>

      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Search by invoice number..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Due Date</TableHead><TableHead>Paid At</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredInvoices.map(inv => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">#{inv.invoice_number}</TableCell>
                    <TableCell>KSh {inv.amount?.toFixed(2)}</TableCell>
                    <TableCell><Badge variant={inv.status === 'paid' ? 'default' : inv.status === 'unpaid' ? 'destructive' : 'secondary'}>{inv.status}</Badge></TableCell>
                    <TableCell className="text-xs">{new Date(inv.due_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-xs">{inv.paid_at ? new Date(inv.paid_at).toLocaleDateString() : '-'}</TableCell>
                    <TableCell>
                      {inv.status === 'unpaid' && (
                        <Button size="sm" variant="outline" onClick={() => updateInvoiceStatus(inv.id, 'paid')}>Mark Paid</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredInvoices.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No invoices found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "payments" && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader><TableRow><TableHead>Transaction ID</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {payments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.transaction_id || p.id.slice(0, 8)}</TableCell>
                    <TableCell>KSh {p.amount?.toFixed(2)}</TableCell>
                    <TableCell><Badge variant="outline">{p.payment_method}</Badge></TableCell>
                    <TableCell><Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>{p.status}</Badge></TableCell>
                    <TableCell className="text-xs">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {payments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No payments found</TableCell></TableRow>}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
