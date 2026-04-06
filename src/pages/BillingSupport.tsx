import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import { useServices } from "@/hooks/useServices";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Receipt, CreditCard, DollarSign, Calendar, Server, Globe, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  service_id?: string;
  invoice_type: string;
  items: any[];
}

interface BillingDashboard {
  active_services: number;
  unpaid_invoices: number;
  outstanding_balance: number;
  next_due_date: string;
  overdue_invoices: number;
}

const BillingSupport = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingData, setBillingData] = useState<BillingDashboard | null>(null);
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const { services } = useServices(user);
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
    if (user) {
      fetchBillingData();
      fetchRecentInvoices();
    }
  }, [user]);

  const fetchBillingData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('billing_dashboard')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching billing data:', error);
        return;
      }

      setBillingData(data);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    }
  };

  const fetchRecentInvoices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching invoices:', error);
        return;
      }

      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handlePayInvoice = async (invoiceId: string, amount: number) => {
    if (!user || !profile) return;

    if (profile.credit_balance < amount) {
      toast({
        title: "Insufficient Funds",
        description: "Please add funds to your account to pay this invoice.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Deduct from credit balance
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          credit_balance: profile.credit_balance - amount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Mark invoice as paid
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (invoiceError) throw invoiceError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          invoice_id: invoiceId,
          amount: amount,
          currency: 'KSh',
          payment_method: 'credit_balance',
          status: 'completed'
        });

      if (paymentError) throw paymentError;

      toast({
        title: "Payment Successful",
        description: "Invoice has been paid successfully.",
      });

      // Refresh data
      fetchBillingData();
      fetchRecentInvoices();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Failed to process payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-muted border-b border-border">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/client-area">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Receipt className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Billing & Services</h1>
              <p className="text-muted-foreground">Manage your billing and view your services</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 flex-1">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Account Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {profile?.credit_balance?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Available funds</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{billingData?.active_services || services.length}</div>
                <p className="text-xs text-muted-foreground">Running services</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {billingData?.outstanding_balance?.toFixed(2) || '0.00'}</div>
                <p className="text-xs text-muted-foreground">Amount due</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {billingData?.next_due_date ? new Date(billingData.next_due_date).toLocaleDateString() : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Due date</p>
              </CardContent>
            </Card>
          </div>

          {/* Overdue Alert */}
          {billingData && billingData.overdue_invoices > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Overdue Invoices</h3>
                    <p className="text-sm text-red-800">
                      You have {billingData.overdue_invoices} overdue invoice(s). Please pay to avoid service suspension.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Recent Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Invoices Yet</h3>
                  <p className="text-muted-foreground mb-4">Your invoices will appear here once you have active services.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Receipt className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">#{invoice.invoice_number}</h3>
                          <p className="text-sm text-muted-foreground">
                            {invoice.invoice_type === 'recurring' ? 'Recurring Service' : 'One-time Payment'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">{invoice.currency} {invoice.amount.toFixed(2)}</div>
                          <Badge variant={invoice.status === 'paid' ? 'default' : 'destructive'}>
                            {invoice.status}
                          </Badge>
                        </div>
                        {invoice.status === 'unpaid' && (
                          <Button 
                            size="sm" 
                            onClick={() => handlePayInvoice(invoice.id, invoice.amount)}
                            disabled={!profile || profile.credit_balance < invoice.amount}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                Your Active Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <div className="text-center py-8">
                  <Server className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Active Services</h3>
                  <p className="text-muted-foreground mb-4">You don't have any active services yet.</p>
                  <Button asChild>
                    <Link to="/store">Browse Hosting Plans</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Globe className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{service.domain || 'Service'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.hosting_plans?.name} - {service.billing_cycle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Next due: {new Date(service.next_due_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                          {service.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/service/${service.id}/manage`}>Manage</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/my-invoices')}>
              <CardContent className="p-6 text-center">
                <Receipt className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">All Invoices</h3>
                <p className="text-sm text-muted-foreground">View complete billing history</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/add-funds')}>
              <CardContent className="p-6 text-center">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Add Funds</h3>
                <p className="text-sm text-muted-foreground">Top up your account</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/my-quotes')}>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">My Quotes</h3>
                <p className="text-sm text-muted-foreground">View price quotes</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/store')}>
              <CardContent className="p-6 text-center">
                <Server className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Order Services</h3>
                <p className="text-sm text-muted-foreground">Browse hosting plans</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BillingSupport;