import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Server, ExternalLink, AlertTriangle, CheckCircle, Clock, Globe, Mail, Database, HardDrive, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ServiceData {
  id: string;
  domain: string;
  status: string;
  billing_cycle: string;
  next_due_date: string;
  created_at: string;
  hosting_plans: {
    name: string;
    monthly_price: number;
    features: any;
  };
}

interface DirectAdminAccount {
  username: string;
  server_ip: string;
  package_name: string;
  status: string;
}

interface UsageData {
  disk: { used: string; total: string; percentage: number };
  bandwidth: { used: string; total: string; percentage: number };
  domains: { used: number; total: number };
  emails: { used: number; total: number };
  databases: { used: number; total: number };
}

const ServiceManage = () => {
  const { serviceId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<ServiceData | null>(null);
  const [directAdminAccount, setDirectAdminAccount] = useState<DirectAdminAccount | null>(null);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (user && serviceId) {
      fetchServiceData();
    }
  }, [user, serviceId]);

  const fetchServiceData = async () => {
    try {
      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select(`
          *,
          hosting_plans (*)
        `)
        .eq('id', serviceId)
        .eq('user_id', user?.id)
        .single();

      if (serviceError) throw serviceError;
      setService(serviceData as any);

      // Fetch DirectAdmin account
      const { data: accountData, error: accountError } = await supabase
        .from('directadmin_accounts')
        .select('*')
        .eq('service_id', serviceId)
        .single();

      if (!accountError && accountData) {
        setDirectAdminAccount(accountData);
        
        // Simulate usage data (in production, this would come from DirectAdmin API)
        setUsage({
          disk: { used: "1.2 GB", total: "10 GB", percentage: 12 },
          bandwidth: { used: "500 MB", total: "Unlimited", percentage: 0 },
          domains: { used: 1, total: 5 },
          emails: { used: 3, total: 25 },
          databases: { used: 2, total: 10 }
        });
      }
    } catch (error) {
      console.error('Error fetching service data:', error);
      toast({
        title: "Error",
        description: "Failed to load service data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openDirectAdminPanel = () => {
    if (directAdminAccount) {
      const panelUrl = `http://${directAdminAccount.server_ip}:2222`;
      window.open(panelUrl, '_blank');
      
      toast({
        title: "Opening Control Panel",
        description: "DirectAdmin panel is opening in a new tab.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: "default" as const, label: "Active", icon: CheckCircle },
      pending: { variant: "secondary" as const, label: "Pending", icon: Clock },
      suspended: { variant: "destructive" as const, label: "Suspended", icon: AlertTriangle },
      cancelled: { variant: "outline" as const, label: "Cancelled", icon: AlertTriangle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-8 flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="py-12 text-center">
              <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Service Not Found</h3>
              <p className="text-muted-foreground mb-4">
                The requested service could not be found or you don't have access to it.
              </p>
              <Button asChild>
                <Link to="/my-services">Back to My Services</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
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
            <Button variant="outline" size="sm" asChild>
              <Link to="/my-services">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Manage Product - {service.domain}
              </h1>
              <p className="text-muted-foreground">
                Portal Home / Client Area / My Products & Services / Product Details
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={openDirectAdminPanel} className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="w-4 h-4 mr-2" />
                Control Panel
              </Button>
              <Button variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Resource Usage
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 flex-1">
        {/* Service Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                {service.hosting_plans.name}
              </CardTitle>
              {getStatusBadge(service.status)}
            </div>
            <p className="text-muted-foreground">
              {service.domain} - Web Hosting
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Registration Date:</p>
                <p className="font-semibold">
                  {new Date(service.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment terms:</p>
                <p className="font-semibold">
                  KSh {service.hosting_plans.monthly_price.toFixed(2)} / {formatBillingCycle(service.billing_cycle)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Next Due Date:</p>
                <p className="font-semibold">
                  {new Date(service.next_due_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method:</p>
                <p className="font-semibold">Mpesa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="usage">Resource Usage</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button onClick={openDirectAdminPanel} className="h-auto p-4 flex-col gap-2">
                    <Server className="w-6 h-6" />
                    <span className="text-sm">Control Panel</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <Globe className="w-6 h-6" />
                    <span className="text-sm">Quick Access Panel</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <Mail className="w-6 h-6" />
                    <span className="text-sm">WordPress Management</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                    <Database className="w-6 h-6" />
                    <span className="text-sm">File Manager</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            {directAdminAccount && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Server Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Username:</span>
                          <span className="font-medium">{directAdminAccount.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Server IP:</span>
                          <span className="font-medium">{directAdminAccount.server_ip}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Package:</span>
                          <span className="font-medium">{directAdminAccount.package_name}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Service Features</h4>
                      <div className="space-y-1">
                        {service.hosting_plans.features?.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="usage" className="space-y-6">
            {usage && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HardDrive className="w-5 h-5" />
                      Disk Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Used: {usage.disk.used}</span>
                        <span>Total: {usage.disk.total}</span>
                      </div>
                      <Progress value={usage.disk.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {usage.disk.percentage}% of disk space used
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Bandwidth Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Used: {usage.bandwidth.used}</span>
                        <span>Total: {usage.bandwidth.total}</span>
                      </div>
                      <Progress value={usage.bandwidth.percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Unlimited bandwidth available
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Domains & Emails
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Domains:</span>
                        <span className="font-medium">{usage.domains.used} / {usage.domains.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email Accounts:</span>
                        <span className="font-medium">{usage.emails.used} / {usage.emails.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Databases
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">MySQL Databases:</span>
                        <span className="font-medium">{usage.databases.used} / {usage.databases.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Server className="w-4 h-4 mr-2" />
                    Upgrade/Downgrade Package
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Cancellation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Open Support Ticket
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="w-4 h-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Service Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Current Plan</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-medium">{service.hosting_plans.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing Cycle:</span>
                        <span className="font-medium">{formatBillingCycle(service.billing_cycle)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">KSh {service.hosting_plans.monthly_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Next Payment</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Due Date:</span>
                        <span className="font-medium">
                          {new Date(service.next_due_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount Due:</span>
                        <span className="font-medium">KSh {service.hosting_plans.monthly_price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceManage;