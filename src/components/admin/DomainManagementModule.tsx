import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Globe } from "lucide-react";

export function DomainManagementModule() {
  const [domains, setDomains] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [domainsRes, regsRes] = await Promise.all([
      supabase.from('domains').select('*').order('created_at', { ascending: false }),
      supabase.from('domain_registrations').select('*').order('created_at', { ascending: false })
    ]);
    setDomains(domainsRes.data || []);
    setRegistrations(regsRes.data || []);
    setLoading(false);
  };

  const allDomains = [...domains.map(d => ({ ...d, source: 'domains' })), ...registrations.map(r => ({ ...r, domain_name: r.domain_name + r.tld, source: 'registration' }))];
  const filtered = allDomains.filter(d => !searchTerm || d.domain_name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Domain Management</h2><p className="text-gray-600">Domain registrations and DNS</p></div>
        <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{allDomains.length}</div><div className="text-xs text-gray-500">Total Domains</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{allDomains.filter(d => d.status === 'active').length}</div><div className="text-xs text-gray-500">Active</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-yellow-600">{allDomains.filter(d => d.status === 'pending').length}</div><div className="text-xs text-gray-500">Pending</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search domains..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Domain</TableHead><TableHead>Status</TableHead><TableHead>Auto Renew</TableHead><TableHead>Expires</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.domain_name}</TableCell>
                  <TableCell><Badge variant={d.status === 'active' ? 'default' : d.status === 'expired' ? 'destructive' : 'secondary'}>{d.status}</Badge></TableCell>
                  <TableCell>{d.auto_renew ? '✅' : '❌'}</TableCell>
                  <TableCell className="text-xs">{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : d.expires_at ? new Date(d.expires_at).toLocaleDateString() : '-'}</TableCell>
                  <TableCell className="text-xs">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">No domains found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
