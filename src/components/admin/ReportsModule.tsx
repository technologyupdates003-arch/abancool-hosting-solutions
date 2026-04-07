import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";

export function ReportsModule() {
  const [data, setData] = useState<any>({ orders: [], services: [], invoices: [], users: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [ordersRes, servicesRes, invoicesRes, usersRes] = await Promise.all([
      supabase.from('orders').select('id, total, status, payment_status, created_at').order('created_at', { ascending: false }),
      supabase.from('services').select('id, status, billing_cycle, created_at'),
      supabase.from('invoices').select('id, amount, status, created_at'),
      supabase.from('profiles').select('id, created_at')
    ]);
    setData({ orders: ordersRes.data || [], services: servicesRes.data || [], invoices: invoicesRes.data || [], users: usersRes.data || [] });
    setLoading(false);
  };

  const totalRevenue = data.orders.filter((o: any) => o.payment_status === 'completed').reduce((s: number, o: any) => s + (o.total || 0), 0);
  const monthlyRevenue = data.orders.filter((o: any) => {
    const d = new Date(o.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.payment_status === 'completed';
  }).reduce((s: number, o: any) => s + (o.total || 0), 0);

  const conversionRate = data.orders.length > 0 ? ((data.orders.filter((o: any) => o.status === 'completed').length / data.orders.length) * 100).toFixed(1) : '0';

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2><p className="text-gray-600">Business intelligence overview</p></div>
        <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><DollarSign className="w-8 h-8 text-green-600" /><div><div className="text-2xl font-bold">KSh {totalRevenue.toFixed(0)}</div><div className="text-xs text-gray-500">Total Revenue</div></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><TrendingUp className="w-8 h-8 text-blue-600" /><div><div className="text-2xl font-bold">KSh {monthlyRevenue.toFixed(0)}</div><div className="text-xs text-gray-500">This Month</div></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><Users className="w-8 h-8 text-purple-600" /><div><div className="text-2xl font-bold">{data.users.length}</div><div className="text-xs text-gray-500">Total Users</div></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center gap-3"><ShoppingCart className="w-8 h-8 text-orange-600" /><div><div className="text-2xl font-bold">{conversionRate}%</div><div className="text-xs text-gray-500">Conversion Rate</div></div></div></CardContent></Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm">Services by Status</CardTitle></CardHeader>
          <CardContent>
            {['active', 'pending', 'suspended', 'cancelled'].map(status => {
              const count = data.services.filter((s: any) => s.status === status).length;
              const pct = data.services.length > 0 ? (count / data.services.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3 mb-3">
                  <span className="text-xs w-20 capitalize">{status}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3"><div className={`h-3 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : status === 'suspended' ? 'bg-red-500' : 'bg-gray-400'}`} style={{ width: `${pct}%` }} /></div>
                  <span className="text-xs font-bold w-8 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Orders by Status</CardTitle></CardHeader>
          <CardContent>
            {['pending', 'processing', 'completed', 'cancelled'].map(status => {
              const count = data.orders.filter((o: any) => o.status === status).length;
              const pct = data.orders.length > 0 ? (count / data.orders.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3 mb-3">
                  <span className="text-xs w-20 capitalize">{status}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3"><div className={`h-3 rounded-full ${status === 'completed' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : status === 'processing' ? 'bg-blue-500' : 'bg-gray-400'}`} style={{ width: `${pct}%` }} /></div>
                  <span className="text-xs font-bold w-8 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Invoice Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span>Total Invoices</span><span className="font-bold">{data.invoices.length}</span></div>
              <div className="flex justify-between text-sm"><span>Paid</span><span className="font-bold text-green-600">{data.invoices.filter((i: any) => i.status === 'paid').length}</span></div>
              <div className="flex justify-between text-sm"><span>Unpaid</span><span className="font-bold text-red-600">{data.invoices.filter((i: any) => i.status === 'unpaid').length}</span></div>
              <div className="flex justify-between text-sm"><span>Total Amount</span><span className="font-bold">KSh {data.invoices.reduce((s: number, i: any) => s + (i.amount || 0), 0).toFixed(0)}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Services by Billing Cycle</CardTitle></CardHeader>
          <CardContent>
            {['monthly', 'quarterly', 'annually', 'biennial'].map(cycle => {
              const count = data.services.filter((s: any) => s.billing_cycle === cycle).length;
              return (
                <div key={cycle} className="flex justify-between text-sm mb-2">
                  <span className="capitalize">{cycle}</span>
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
