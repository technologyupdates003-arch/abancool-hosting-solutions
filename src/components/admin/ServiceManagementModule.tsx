import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Server, ExternalLink, Settings, Pause, Play, Trash2, Plus } from "lucide-react";

interface ServiceData {
  id: string;
  domain: string;
  status: string;
  billing_cycle: string;
  next_due_date: string;
  created_at: string;
  user_email: string;
  user_name: string;
  hosting_plans: {
    name: string;
    monthly_price: number;
  };
  directadmin_accounts: {
    username: string;
    server_ip: string;
    package_name: string;
    status: string;
  }[];
}

export function ServiceManagementModule() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          id,
          domain,
          status,
          billing_cycle,
          next_due_date,
          created_at,
          hosting_plans (
            name,
            monthly_price
          ),
          directadmin_accounts (
            username,
            server_ip,
            package_name,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedServices = (data || []).map((service: any) => ({
        ...service,
        user_email: 'N/A',
        user_name: 'Customer'
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.hosting_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active" },
      pending: { variant: "secondary" as const, label: "Pending" },
      suspended: { variant: "destructive" as const, label: "Suspended" },
      cancelled: { variant: "outline" as const, label: "Cancelled" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatBillingCycle = (cycle: string) => {
    const cycles = {
      monthly: "Monthly",
      quarterly: "Quarterly", 
      annually: "Annually",
      biennial: "Biennial"
    };
    return cycles[cycle as keyof typeof cycles] || cycle;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openDirectAdminPanel = (serverIp: string) => {
    const panelUrl = `http://${serverIp}:2222`;
    window.open(panelUrl, '_blank');
  };

  const updateServiceStatus = async (serviceId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;
      
      // Reload services
      loadServices();
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Service Management</h2>
          <p className="text-gray-600">Manage hosting services and DirectAdmin accounts</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{services.length}</p>
              </div>
              <Server className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {services.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">
                  {services.filter(s => s.status === 'suspended').length}
                </p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services by domain, user, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>DirectAdmin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.domain}</div>
                      <div className="text-sm text-gray-500">
                        {formatBillingCycle(service.billing_cycle)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.user_name}</div>
                      <div className="text-sm text-gray-500">{service.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.hosting_plans?.name}</div>
                      <div className="text-sm text-gray-500">
                        KSh {service.hosting_plans?.monthly_price?.toFixed(2)}/mo
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {service.directadmin_accounts?.[0] ? (
                      <div>
                        <div className="font-medium text-sm">
                          {service.directadmin_accounts[0].username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {service.directadmin_accounts[0].server_ip}
                        </div>
                      </div>
                    ) : (
                      <Badge variant="outline">Not Created</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(service.status)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{formatDate(service.next_due_date)}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => updateServiceStatus(service.id, service.status === 'active' ? 'suspended' : 'active')}
                      >
                        {service.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      {service.directadmin_accounts?.[0] && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openDirectAdminPanel(service.directadmin_accounts[0].server_ip)}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}