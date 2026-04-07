import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserManagementModule } from "@/components/admin/UserManagementModule";
import { ServiceManagementModule } from "@/components/admin/ServiceManagementModule";
import { OrderManagementModule } from "@/components/admin/OrderManagementModule";
import { 
  Users, 
  Server, 
  ShoppingCart, 
  Mail, 
  Settings, 
  BarChart3, 
  Database, 
  Globe, 
  CreditCard,
  FileText,
  Activity,
  Shield,
  HardDrive,
  Minimize2,
  Maximize2,
  X,
  Folder,
  Home,
  Search
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalServices: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  activeServices: number;
  pendingEmails: number;
  supportTickets: number;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  time: string;
  color: string;
}

const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalServices: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingEmails: 0,
    supportTickets: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeWindow, setActiveWindow] = useState("dashboard");
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
    loadStats();
    loadRecentActivity();
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate("/login");
      return;
    }
    
    // Check admin role from user_roles table
    const { data: roleData } = await (supabase as any)
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      navigate("/client-area");
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const [usersResult, servicesResult, ordersResult, emailsResult, ticketsResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('services').select('id, status', { count: 'exact' }),
        supabase.from('orders').select('id, status, total', { count: 'exact' }),
        supabase.from('email_queue').select('id, status', { count: 'exact' }),
        supabase.from('support_tickets').select('id, status', { count: 'exact' })
      ]);

      const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
      const activeServices = servicesResult.data?.filter(s => s.status === 'active').length || 0;
      const pendingOrders = ordersResult.data?.filter(o => o.status === 'pending').length || 0;
      const pendingEmails = emailsResult.data?.filter(e => e.status === 'pending').length || 0;
      const openTickets = ticketsResult.data?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0;

      setStats({
        totalUsers: usersResult.count || 0,
        totalServices: servicesResult.count || 0,
        totalOrders: ordersResult.count || 0,
        pendingOrders,
        totalRevenue,
        activeServices,
        pendingEmails,
        supportTickets: openTickets
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const [ordersRes, servicesRes] = await Promise.all([
        supabase.from('orders').select('id, order_number, status, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('services').select('id, domain, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);
      const activities: RecentActivity[] = [];
      ordersRes.data?.forEach(o => activities.push({ id: o.id, type: 'order', message: `Order #${o.order_number || o.id.slice(0, 8)} - ${o.status}`, time: o.created_at || '', color: o.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500' }));
      servicesRes.data?.forEach(s => activities.push({ id: s.id, type: 'service', message: `Service ${s.domain || 'new'} - ${s.status}`, time: s.created_at || '', color: s.status === 'active' ? 'bg-green-500' : 'bg-purple-500' }));
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 8));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const adminModules = [
    {
      id: "users", 
      title: "User Management", 
      icon: Users, 
      description: "Manage customer accounts",
      count: stats.totalUsers
    },
    { 
      id: "services", 
      title: "Service Management", 
      icon: Server, 
      description: "Hosting services & DirectAdmin",
      count: stats.totalServices
    },
    { 
      id: "orders", 
      title: "Order Management", 
      icon: ShoppingCart, 
      description: "Process orders & payments",
      count: stats.pendingOrders
    },
    { 
      id: "emails", 
      title: "Email System", 
      icon: Mail, 
      description: "Email queue & templates",
      count: stats.pendingEmails
    },
    { 
      id: "billing", 
      title: "Billing & Invoices", 
      icon: CreditCard, 
      description: "Financial management",
      count: 0
    },
    { 
      id: "support", 
      title: "Support Center", 
      icon: Shield, 
      description: "Tickets & customer support",
      count: stats.supportTickets
    },
    { 
      id: "servers", 
      title: "Server Management", 
      icon: Database, 
      description: "DirectAdmin servers",
      count: 1
    },
    { 
      id: "domains", 
      title: "Domain Management", 
      icon: Globe, 
      description: "Domain registrations",
      count: 0
    },
    { 
      id: "reports", 
      title: "Reports & Analytics", 
      icon: BarChart3, 
      description: "Business intelligence",
      count: 0
    },
    { 
      id: "settings", 
      title: "System Settings", 
      icon: Settings, 
      description: "Configuration & preferences",
      count: 0
    },
    { 
      id: "automation", 
      title: "Automation Rules", 
      icon: Activity, 
      description: "Workflow automation",
      count: 0
    },
    { 
      id: "files", 
      title: "File Manager", 
      icon: FileText, 
      description: "System files & backups",
      count: 0
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Windows 7 Style Background */}
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='rgba(255,255,255,0.1)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E\")" }} />

      {/* Main Window */}
      <div className="container mx-auto p-4 h-screen flex flex-col">
        {/* Window Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg border border-blue-800 shadow-lg">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-300 rounded-sm flex items-center justify-center">
                <Shield className="w-2 h-2 text-blue-800" />
              </div>
              <span className="text-white font-semibold text-sm">Abancool Technology - Admin Control Panel</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-white hover:bg-blue-500">
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-white hover:bg-blue-500">
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="w-6 h-6 p-0 text-white hover:bg-red-500">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 border-x border-b border-blue-800 rounded-b-lg shadow-lg overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gradient-to-b from-gray-200 to-gray-300 border-b border-gray-400 px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Home className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                <span className="text-gray-400">|</span>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Folder className="w-4 h-4 mr-1" />
                  System
                </Button>
              </div>
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <Input 
                    placeholder="Search admin functions..." 
                    className="pl-8 h-7 text-xs bg-white border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 bg-gradient-to-b from-gray-100 to-gray-200 border-r border-gray-400 p-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                  Admin Functions
                </div>
                
                {/* Quick Stats */}
                <Card className="mb-4 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">System Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Total Users:</span>
                      <Badge variant="secondary">{stats.totalUsers}</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Active Services:</span>
                      <Badge variant="default">{stats.activeServices}</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Pending Orders:</span>
                      <Badge variant="destructive">{stats.pendingOrders}</Badge>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Revenue:</span>
                      <Badge variant="outline">KSh {stats.totalRevenue.toFixed(0)}</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="space-y-1">
                  {adminModules.slice(0, 8).map((module) => (
                    <Button
                      key={module.id}
                      variant={activeWindow === module.id ? "default" : "ghost"}
                      className="w-full justify-start text-xs h-8"
                      onClick={() => setActiveWindow(module.id)}
                    >
                      <module.icon className="w-4 h-4 mr-2" />
                      {module.title}
                      {module.count > 0 && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {module.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
              {activeWindow === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <div className="text-sm text-gray-600">
                      Welcome back, Administrator
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {adminModules.map((module) => (
                      <Card 
                        key={module.id} 
                        className="cursor-pointer hover:shadow-md transition-shadow border-gray-300"
                        onClick={() => setActiveWindow(module.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <module.icon className="w-5 h-5 text-blue-600" />
                                <span className="font-semibold text-sm">{module.title}</span>
                              </div>
                              <p className="text-xs text-gray-600">{module.description}</p>
                            </div>
                            {module.count > 0 && (
                              <Badge variant="secondary" className="text-lg font-bold">
                                {module.count}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent System Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">New user registration: user@example.com</span>
                          <span className="text-xs text-gray-400 ml-auto">2 minutes ago</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600">Order completed: #ORD001234</span>
                          <span className="text-xs text-gray-400 ml-auto">5 minutes ago</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">DirectAdmin account created: user123</span>
                          <span className="text-xs text-gray-400 ml-auto">8 minutes ago</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-gray-600">Email sent: Welcome hosting credentials</span>
                          <span className="text-xs text-gray-400 ml-auto">12 minutes ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Other module content will be rendered here based on activeWindow */}
              {activeWindow === "users" && <UserManagementModule />}
              {activeWindow === "services" && <ServiceManagementModule />}
              {activeWindow === "orders" && <OrderManagementModule />}
              
              {activeWindow !== "dashboard" && activeWindow !== "users" && activeWindow !== "services" && activeWindow !== "orders" && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    {adminModules.find(m => m.id === activeWindow)?.title}
                  </h2>
                  <p className="text-gray-600">
                    This module is under construction. Full functionality coming soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Windows 7 Style Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-800 to-gray-700 border-t border-gray-600 shadow-lg">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            {/* Start Button */}
            <Button 
              variant="ghost" 
              className="h-8 px-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 rounded-sm"
            >
              <div className="w-4 h-4 bg-white rounded-sm mr-2 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
              </div>
              <span className="text-xs font-semibold">Start</span>
            </Button>

            {/* Taskbar Items */}
            <Button variant="ghost" className="h-8 px-3 text-white text-xs">
              <Shield className="w-4 h-4 mr-1" />
              Admin Panel
            </Button>
          </div>

          {/* System Tray */}
          <div className="flex items-center gap-2 text-white text-xs">
            <Activity className="w-4 h-4" />
            <HardDrive className="w-4 h-4" />
            <div className="text-right">
              <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-xs opacity-75">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;