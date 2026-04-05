import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useServices } from "@/hooks/useServices";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Server, Search, Filter, ExternalLink, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MyServices = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const { services, loading: servicesLoading } = useServices(user);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (!session?.user) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const getDirectAdminUrl = async (serviceId: string) => {
    try {
      // Get DirectAdmin account details for this service
      const { data: account, error } = await supabase
        .from('directadmin_accounts')
        .select('*')
        .eq('service_id', serviceId)
        .single();

      if (error || !account) {
        toast({
          title: "Panel Access Error",
          description: "DirectAdmin account not found. Please contact support.",
          variant: "destructive"
        });
        return;
      }

      // Construct DirectAdmin URL
      const panelUrl = `http://${account.server_ip}:2222`;
      
      // Open in new tab
      window.open(panelUrl, '_blank');
      
      toast({
        title: "Opening Control Panel",
        description: "DirectAdmin panel is opening in a new tab.",
      });
    } catch (error) {
      console.error('Error getting DirectAdmin URL:', error);
      toast({
        title: "Error",
        description: "Failed to access control panel. Please try again.",
        variant: "destructive"
      });
    }
  };

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

  const formatNextDueDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.hosting_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || servicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-muted border-b border-border">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/client-area")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Server className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Web Hosting</h1>
              <p className="text-muted-foreground">Manage hosting & websites</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 flex-1">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Filter services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Server className="w-4 h-4 mr-2" />
              Hostname
            </Button>
            
            <Button variant="outline" size="sm">
              Next Due Date
            </Button>
          </div>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Server className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Services Found</h3>
              <p className="text-muted-foreground mb-4">
                {services.length === 0 
                  ? "You don't have any hosting services yet." 
                  : "No services match your current filters."
                }
              </p>
              {services.length === 0 && (
                <Button asChild>
                  <Link to="/store">Browse Hosting Plans</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    {/* Service Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-1">
                            {service.hosting_plans?.name || 'Hosting Service'}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {service.domain} | Next Due Date: {formatNextDueDate(service.next_due_date)}
                          </p>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Registration Date:</p>
                          <p className="font-medium">
                            {new Date(service.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment terms:</p>
                          <p className="font-medium">
                            KSh {service.hosting_plans?.monthly_price?.toFixed(2) || '0.00'} / {formatBillingCycle(service.billing_cycle)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment Method:</p>
                          <p className="font-medium">Mpesa</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next Due Date:</p>
                          <p className="font-medium">
                            {formatNextDueDate(service.next_due_date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:w-48 p-6 bg-muted/30 flex flex-row lg:flex-col gap-2">
                      <Button 
                        asChild 
                        className="flex-1 lg:w-full"
                        variant="default"
                      >
                        <Link to={`/service/${service.id}/manage`}>
                          <Settings className="w-4 h-4 mr-2" />
                          Manage
                        </Link>
                      </Button>
                      
                      <Button 
                        onClick={() => getDirectAdminUrl(service.id)}
                        className="flex-1 lg:w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Panel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyServices;