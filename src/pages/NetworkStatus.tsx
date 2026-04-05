import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, Clock, Server, Globe, Mail, Shield, Database } from "lucide-react";
import { supportService, SystemStatus } from "@/services/supportService";
import { newsService, NewsArticle } from "@/services/newsService";
import { useToast } from "@/hooks/use-toast";

const NetworkStatus = () => {
  const [services, setServices] = useState<SystemStatus[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [systemStatus, newsArticles] = await Promise.all([
        supportService.getSystemStatus(),
        newsService.getArticles({ limit: 5 })
      ]);
      
      setServices(systemStatus);
      setNews(newsArticles);
    } catch (error) {
      console.error('Error loading network status data:', error);
      toast({
        title: "Error",
        description: "Failed to load network status information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('email')) return Mail;
    if (serviceName.toLowerCase().includes('domain')) return Globe;
    if (serviceName.toLowerCase().includes('dns')) return Database;
    if (serviceName.toLowerCase().includes('ssl')) return Shield;
    if (serviceName.toLowerCase().includes('portal')) return CheckCircle;
    return Server;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLastUpdateText = (lastUpdated: string) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const overallStatus = services.every(s => s.status === 'operational') ? 'operational' : 
                      services.some(s => s.status === 'outage') ? 'outage' : 'degraded';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-50';
      case 'degraded': return 'text-yellow-600 bg-yellow-50';
      case 'outage': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'outage': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">Network Status</h1>
            <p className="text-muted-foreground">News & Information</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Overall Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(overallStatus)}
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {overallStatus === 'operational' ? 'All Systems Operational' : 
                         overallStatus === 'degraded' ? 'Some Systems Experiencing Issues' : 
                         'Service Disruption'}
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {overallStatus === 'operational' ? 'All services are running normally with no reported issues.' :
                         'Some services may be experiencing degraded performance.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service, index) => {
                      const ServiceIcon = getServiceIcon(service.service_name);
                      return (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <ServiceIcon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-foreground">{service.service_name}</p>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className={getStatusColor(service.status)}>
                              {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Updated {getLastUpdateText(service.last_updated)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* News Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    News - All the latest from ABANCOOL
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {news.map((item) => (
                      <article key={item.id} className="border-b border-border pb-6 last:border-0">
                        <h3 className="text-lg font-semibold text-primary mb-2 hover:underline cursor-pointer">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{formatDate(item.published_at)}</span>
                          <Button variant="link" size="sm" className="text-primary p-0 h-auto">
                            Read More →
                          </Button>
                        </div>
                      </article>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border">
                    <Button variant="outline" size="sm">‹</Button>
                    <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">›</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <span className="text-sm font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="text-sm font-medium">< 200ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active Incidents</span>
                    <span className="text-sm font-medium text-green-600">0</span>
                  </div>
                </CardContent>
              </Card>

              {/* Support Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/open-ticket">Open Support Ticket</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/resolution-center">Resolution Center</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/billing-support">Billing Support</a>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Maintenance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Server Upgrades</p>
                      <p className="text-muted-foreground">Completed Jan 10, 2024</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="font-medium">Security Updates</p>
                      <p className="text-muted-foreground">Completed Jan 5, 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default NetworkStatus;