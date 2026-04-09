import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RefreshCw, ExternalLink, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export function ServerManagementModule() {
  const [servers, setServers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addServerOpen, setAddServerOpen] = useState(false);
  const [selectedServers, setSelectedServers] = useState<Set<string>>(new Set());
  const [ns1, setNs1] = useState("ns1.abancool.com");
  const [ns2, setNs2] = useState("ns2.abancool.com");
  const [newServer, setNewServer] = useState({
    name: "", hostname: "", ip_address: "", port: 2222,
    api_username: "admin", api_password: "", ssl_enabled: true,
    max_accounts: 100, location: ""
  });

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

  const addServer = async () => {
    if (!newServer.name || !newServer.hostname || !newServer.ip_address || !newServer.api_username) {
      toast.error("Please fill in all required fields");
      return;
    }
    const { error } = await supabase.from('directadmin_servers').insert({
      name: newServer.name, hostname: newServer.hostname, ip_address: newServer.ip_address,
      port: newServer.port, api_username: newServer.api_username, api_password: newServer.api_password,
      ssl_enabled: newServer.ssl_enabled, max_accounts: newServer.max_accounts,
      location: newServer.location, status: 'active'
    } as any);
    if (error) {
      toast.error("Failed to add server: " + error.message);
    } else {
      toast.success("Server added successfully");
      setAddServerOpen(false);
      setNewServer({ name: "", hostname: "", ip_address: "", port: 2222, api_username: "admin", api_password: "", ssl_enabled: true, max_accounts: 100, location: "" });
      loadData();
    }
  };

  const deleteServer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this server?")) return;
    const { error } = await supabase.from('directadmin_servers').delete().eq('id', id);
    if (error) toast.error("Failed to delete server");
    else { toast.success("Server deleted"); loadData(); }
  };

  const deleteSelected = async () => {
    if (selectedServers.size === 0) return;
    if (!confirm(`Delete ${selectedServers.size} selected server(s)?`)) return;
    for (const id of selectedServers) {
      await supabase.from('directadmin_servers').delete().eq('id', id);
    }
    setSelectedServers(new Set());
    toast.success("Selected servers deleted");
    loadData();
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedServers);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedServers(next);
  };

  const saveNameservers = () => {
    // Store in localStorage for now; these are used during provisioning
    localStorage.setItem('ns1', ns1);
    localStorage.setItem('ns2', ns2);
    toast.success("Nameservers saved");
  };

  useEffect(() => {
    const saved1 = localStorage.getItem('ns1');
    const saved2 = localStorage.getItem('ns2');
    if (saved1) setNs1(saved1);
    if (saved2) setNs2(saved2);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Server Management</h2><p className="text-gray-600">DirectAdmin servers and accounts</p></div>
        <div className="flex gap-2">
          <Dialog open={addServerOpen} onOpenChange={setAddServerOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Server</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Add DirectAdmin Server</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Server Name *</Label><Input value={newServer.name} onChange={e => setNewServer({...newServer, name: e.target.value})} placeholder="Production Server 1" /></div>
                  <div><Label>Hostname *</Label><Input value={newServer.hostname} onChange={e => setNewServer({...newServer, hostname: e.target.value})} placeholder="server1.abancool.com" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>IP Address *</Label><Input value={newServer.ip_address} onChange={e => setNewServer({...newServer, ip_address: e.target.value})} placeholder="192.168.1.1" /></div>
                  <div><Label>Port</Label><Input type="number" value={newServer.port} onChange={e => setNewServer({...newServer, port: parseInt(e.target.value) || 2222})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>API Username *</Label><Input value={newServer.api_username} onChange={e => setNewServer({...newServer, api_username: e.target.value})} /></div>
                  <div><Label>API Password</Label><Input type="password" value={newServer.api_password} onChange={e => setNewServer({...newServer, api_password: e.target.value})} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Max Accounts</Label><Input type="number" value={newServer.max_accounts} onChange={e => setNewServer({...newServer, max_accounts: parseInt(e.target.value) || 100})} /></div>
                  <div><Label>Location</Label><Input value={newServer.location} onChange={e => setNewServer({...newServer, location: e.target.value})} placeholder="Nairobi, Kenya" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={newServer.ssl_enabled} onCheckedChange={v => setNewServer({...newServer, ssl_enabled: v})} />
                  <Label>SSL Enabled</Label>
                </div>
                <Button className="w-full" onClick={addServer}>Add Server</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={loadData}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{servers.length}</div><div className="text-xs text-gray-500">Servers</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{packages.length}</div><div className="text-xs text-gray-500">Packages</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{accounts.length}</div><div className="text-xs text-gray-500">Accounts</div></CardContent></Card>
      </div>

      {/* Servers Table with selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Servers</span>
            {selectedServers.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-normal text-gray-500">With selected ({selectedServers.size} / {servers.length}):</span>
                <Button variant="outline" size="sm" onClick={deleteSelected}><Trash2 className="w-3 h-3 mr-1" />Delete</Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={selectedServers.size === servers.length && servers.length > 0}
                    onCheckedChange={(v) => {
                      if (v) setSelectedServers(new Set(servers.map(s => s.id)));
                      else setSelectedServers(new Set());
                    }}
                  />
                </TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>User(s)</TableHead>
                <TableHead>Name Server</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.map(s => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Checkbox checked={selectedServers.has(s.id)} onCheckedChange={() => toggleSelect(s.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{s.ip_address}</TableCell>
                  <TableCell><Badge variant={s.status === 'active' ? 'default' : 'secondary'}>{s.status}</Badge></TableCell>
                  <TableCell>{s.current_accounts}</TableCell>
                  <TableCell className="text-sm">{s.hostname}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => window.open(`https://${s.hostname}:${s.port || 2222}`, '_blank')}>
                        <ExternalLink className="w-3 h-3 mr-1" />Panel
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteServer(s.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {servers.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">No servers configured. Click "Add Server" to get started.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Nameserver Configuration */}
      <Card>
        <CardHeader><CardTitle>Set the Name servers that will be assigned to new users</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name Server 1</Label>
              <Input value={ns1} onChange={e => setNs1(e.target.value)} placeholder="ns1.abancool.com" />
            </div>
            <div>
              <Label>Name Server 2</Label>
              <Input value={ns2} onChange={e => setNs2(e.target.value)} placeholder="ns2.abancool.com" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveNameservers}><Save className="w-4 h-4 mr-2" />Save</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Accounts */}
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
