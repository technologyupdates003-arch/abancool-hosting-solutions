import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, UserPlus, Edit, Mail, Shield, Eye, X } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  credit_balance: number;
  created_at: string;
  last_sign_in_at?: string;
}

export function UserManagementModule() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setUsers((data || []) as UserProfile[]);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getUserStatus = (user: UserProfile) => {
    if (user.last_sign_in_at) {
      const days = (Date.now() - new Date(user.last_sign_in_at).getTime()) / (1000 * 60 * 60 * 24);
      if (days < 7) return { status: 'active', color: 'default' };
      if (days < 30) return { status: 'inactive', color: 'secondary' };
      return { status: 'dormant', color: 'outline' };
    }
    return { status: 'new', color: 'secondary' };
  };

  const openView = (user: UserProfile) => setViewUser(user);

  const openEdit = (user: UserProfile) => {
    setEditUser(user);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email,
      phone: user.phone || '',
      company: user.company || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      postcode: user.postcode || '',
      country: user.country || '',
      credit_balance: user.credit_balance || 0,
    });
  };

  const saveUser = async () => {
    if (!editUser) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        phone: editForm.phone,
        company: editForm.company,
        address: editForm.address,
        city: editForm.city,
        state: editForm.state,
        postcode: editForm.postcode,
        country: editForm.country,
        credit_balance: editForm.credit_balance,
      })
      .eq('id', editUser.id);
    if (error) {
      toast.error("Failed to update user: " + error.message);
    } else {
      toast.success("User updated successfully");
      setEditUser(null);
      loadUsers();
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-600">Manage customer accounts and profiles</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search users by name, email, or company..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="dormant">Dormant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Users ({filteredUsers.length})</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" />Bulk Email</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Credit Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const userStatus = getUserStatus(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0]}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {user.phone && <div>📞 {user.phone}</div>}
                        <div>✉️ {user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm">{user.company || '-'}</span></TableCell>
                    <TableCell>
                      <Badge variant={user.credit_balance > 0 ? "default" : "outline"}>
                        KSh {(user.credit_balance || 0).toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant={userStatus.color as any}>{userStatus.status}</Badge></TableCell>
                    <TableCell><span className="text-sm">{formatDate(user.created_at)}</span></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openView(user)} title="View"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(user)} title="Edit"><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" title="Email"><Mail className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" title="Roles"><Shield className="w-4 h-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={!!viewUser} onOpenChange={() => setViewUser(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-xs text-gray-500">First Name</Label><p className="font-medium">{viewUser.first_name || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Last Name</Label><p className="font-medium">{viewUser.last_name || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Email</Label><p className="font-medium">{viewUser.email}</p></div>
                <div><Label className="text-xs text-gray-500">Phone</Label><p className="font-medium">{viewUser.phone || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Company</Label><p className="font-medium">{viewUser.company || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Credit Balance</Label><p className="font-medium">KSh {(viewUser.credit_balance || 0).toFixed(2)}</p></div>
                <div><Label className="text-xs text-gray-500">Address</Label><p className="font-medium">{viewUser.address || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">City</Label><p className="font-medium">{viewUser.city || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">State</Label><p className="font-medium">{viewUser.state || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Country</Label><p className="font-medium">{viewUser.country || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Postcode</Label><p className="font-medium">{viewUser.postcode || '-'}</p></div>
                <div><Label className="text-xs text-gray-500">Joined</Label><p className="font-medium">{formatDate(viewUser.created_at)}</p></div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => { setViewUser(null); openEdit(viewUser); }}>
                <Edit className="w-4 h-4 mr-2" />Edit User
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input value={editForm.first_name || ''} onChange={e => setEditForm({...editForm, first_name: e.target.value})} /></div>
              <div><Label>Last Name</Label><Input value={editForm.last_name || ''} onChange={e => setEditForm({...editForm, last_name: e.target.value})} /></div>
            </div>
            <div><Label>Email (read-only)</Label><Input value={editForm.email || ''} disabled className="bg-gray-100" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Phone</Label><Input value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} /></div>
              <div><Label>Company</Label><Input value={editForm.company || ''} onChange={e => setEditForm({...editForm, company: e.target.value})} /></div>
            </div>
            <div><Label>Address</Label><Input value={editForm.address || ''} onChange={e => setEditForm({...editForm, address: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>City</Label><Input value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} /></div>
              <div><Label>State</Label><Input value={editForm.state || ''} onChange={e => setEditForm({...editForm, state: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Postcode</Label><Input value={editForm.postcode || ''} onChange={e => setEditForm({...editForm, postcode: e.target.value})} /></div>
              <div><Label>Country</Label><Input value={editForm.country || ''} onChange={e => setEditForm({...editForm, country: e.target.value})} /></div>
            </div>
            <div><Label>Credit Balance (KSh)</Label><Input type="number" value={editForm.credit_balance || 0} onChange={e => setEditForm({...editForm, credit_balance: parseFloat(e.target.value) || 0})} /></div>
            <Button className="w-full" onClick={saveUser}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
