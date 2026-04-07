import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Server, ExternalLink } from "lucide-react";

export function ServerManagementModule() {
  const [servers, setServers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [serversRes, packagesRes, accountsRes] = await Promise.all([
      supabase.from('directadmin_servers').select('*'),
      supabase.from('directadmin_packages').select('*'),
      supabase.from('directadmin_accounts').select('*').order('created_at', { ascending: false }).limit(50)
    ]);
    setServers(serversRes.data || []);
    setPackages(packagesRes.data || []);
    setAccounts(accountsRes.data || []);
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Server Management</h2><p className="text-gray-600">DirectAdmin servers and accounts</p></div>
        <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{servers.length}</div><div className="text-xs text-gray-500">Servers</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{packages.length}</div><div className="text-xs text-gray-500">Packages</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{accounts.length}</div><div className="text-xs text-gray-500">Accounts</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Servers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Hostname</TableHead><TableHead>IP</TableHead><TableHead>Accounts</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {servers.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.hostname}</TableCell>
                  <TableCell className="font-mono text-xs">{s.ip_address}</TableCell>
                  <TableCell>{s.current_accounts}/{s.max_accounts}</TableCell>
                  <TableCell><Badge variant={s.status === 'active' ? 'default' : 'secondary'}>{s.status}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => window.open(`https://${s.hostname}:${s.port || 2222}`, '_blank')}>
                      <ExternalLink className="w-3 h-3 mr-1" />Panel
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {servers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No servers configured</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Accounts</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Username</TableHead><TableHead>Domain</TableHead><TableHead>Package</TableHead><TableHead>Server IP</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead></TableRow></TableHeader>
            <TableBody>
              {accounts.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono">{a.username}</TableCell>
                  <TableCell>{a.domain}</TableCell>
                  <TableCell><Badge variant="outline">{a.package_name}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{a.server_ip}</TableCell>
                  <TableCell><Badge variant={a.status === 'active' ? 'default' : 'secondary'}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {accounts.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No accounts provisioned yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
