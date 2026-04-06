import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { orderService } from "@/services/orderService";
import { directAdminService } from "@/services/directAdminService";
import { DomainWarrantyModal } from "@/components/DomainWarrantyModal";
import { GuestCheckoutForm, GuestFormData } from "@/components/GuestCheckoutForm";
import { OrderCompleteModal } from "@/components/OrderCompleteModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Globe, Search, CreditCard, Smartphone, Bitcoin, DollarSign, Tag, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DomainOption {
  type: 'new' | 'existing' | 'subdomain';
  domain?: string;
  price?: number;
  tld?: string;
}

const Checkout = () => {
  const { state, clearCart, applyPromoCode, removePromoCode } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [domainOption, setDomainOption] = useState<DomainOption>({ type: 'existing' });
  const [domainSearch, setDomainSearch] = useState("");
  const [availableDomains, setAvailableDomains] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaPhone, setMpesaPhone] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentPolling, setPaymentPolling] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  // New modal states
  const [showDomainWarranty, setShowDomainWarranty] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [showOrderComplete, setShowOrderComplete] = useState(false);
  const [guestData, setGuestData] = useState<GuestFormData | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (state.items.length === 0) {
      navigate('/store');
    }
  }, [state.items, navigate]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user); // Don't redirect if no user - allow guest checkout
  };

  const handlePayNowClick = () => {
    // Check if there are domains that could benefit from warranty
    const hasDomains = domainOption.type === 'new' || state.items.some(item => item.type === 'domain');
    
    if (hasDomains) {
      setShowDomainWarranty(true);
    } else {
      proceedToPayment();
    }
  };

  const handleDomainWarrantyAccept = () => {
    setShowDomainWarranty(false);
    // Add domain warranty to cart or go back to modify cart
    toast({
      title: "Domain Warranty",
      description: "Please add Domain Warranty & Privacy from your cart.",
    });
  };

  const handleDomainWarrantyDecline = () => {
    setShowDomainWarranty(false);
    proceedToPayment();
  };

  const proceedToPayment = () => {
    if (user) {
      // User is logged in, proceed directly
      handleCompleteOrder();
    } else {
      // Show guest checkout form
      setShowGuestForm(true);
    }
  };

  const handleGuestFormSubmit = async (formData: GuestFormData) => {
    setGuestData(formData);
    setShowGuestForm(false);
    
    // Create guest account and proceed with order
    try {
      setLoading(true);
      
      // Register the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          }
        }
      });

      if (authError) {
        throw authError;
      }

      // Update user state
      setUser(authData.user);
      
      // Complete the order
      await handleCompleteOrder(formData);
      
    } catch (error) {
      console.error('Error creating guest account:', error);
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const searchDomains = async () => {
    if (!domainSearch) return;
    
    setLoading(true);
    try {
      // Simulate domain search - in real app, this would be an API call
      const tlds = ['.com', '.co.ke', '.africa', '.online', '.ke'];
      const results = tlds.map(tld => ({
        domain: domainSearch + tld,
        available: Math.random() > 0.5,
        price: tld === '.com' ? 1950 : tld === '.co.ke' ? 750 : 1800,
        tld
      }));
      setAvailableDomains(results);
    } catch (error) {
      console.error('Error searching domains:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromo = () => {
    const validPromoCodes: { [key: string]: number } = {
      'KENYA_50%OFF_2025': 50,
      'WELCOME10': 10,
      'SAVE20': 20,
    };

    if (validPromoCodes[promoCode]) {
      applyPromoCode(promoCode, validPromoCodes[promoCode]);
      setPromoError("");
    } else {
      setPromoError("Invalid promo code");
    }
  };

  const handleDomainSelect = (domain: any) => {
    setDomainOption({
      type: 'new',
      domain: domain.domain,
      price: domain.price,
      tld: domain.tld
    });
  };

  const calculateTotal = () => {
    let total = state.total;
    if (domainOption.type === 'new' && domainOption.price) {
      total += domainOption.price;
    }
    return total;
  };

  const handleCompleteOrder = async (guestFormData?: GuestFormData) => {
    setLoading(true);
    try {
      // Ensure user is authenticated
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast({ title: "Please login first", variant: "destructive" });
        navigate('/login');
        return;
      }

      // Get profile for phone number
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', currentUser.id)
        .single();

      // Create order in database
      const orderData = {
        user_id: currentUser.id,
        items: state.items.map(item => ({
          type: item.type,
          planId: item.planId,
          name: item.name,
          price: item.price,
          billingCycle: item.billingCycle,
          domain: domainOption.domain || item.domain,
          category: item.category,
        })),
        domain_option: domainOption,
        payment_method: paymentMethod,
        promo_code: state.promoCode || null,
        discount_percentage: state.discount || null,
        discount_amount: state.discount ? (calculateTotal() / (1 - (state.discount || 0) / 100)) * ((state.discount || 0) / 100) : 0,
        subtotal: state.items.reduce((sum, item) => sum + item.price + (item.setupFee || 0), 0),
        total: calculateTotal(),
        currency: state.currency || 'KSh',
        status: 'pending' as const,
        payment_status: 'pending' as const,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([orderData as any])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      for (const item of state.items) {
        await supabase.from('order_items').insert({
          order_id: order.id,
          plan_id: item.planId || null,
          name: item.name,
          type: item.type,
          unit_price: item.price,
          total_price: item.price,
          billing_cycle: item.billingCycle,
          domain: domainOption.domain || item.domain || null,
          features: item.features || [],
        });
      }

      // Process payment via IntaSend
      if (paymentMethod === 'mpesa') {
        const phoneNumber = mpesaPhone || profile?.phone || guestFormData?.phone || '';
        if (!phoneNumber) {
          toast({ title: "Phone number required for M-Pesa", variant: "destructive" });
          setLoading(false);
          return;
        }

        const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('process-payment', {
          body: {
            action: 'initiate_mpesa',
            order_id: order.id,
            amount: calculateTotal(),
            phone_number: phoneNumber,
            currency: 'KES',
          }
        });

        if (paymentError) throw paymentError;

        if (paymentResult?.success) {
          toast({
            title: "M-Pesa STK Push Sent",
            description: "Check your phone and enter your M-Pesa PIN to complete payment.",
          });

          // Poll for payment status
          setPaymentPolling(true);
          const invoiceId = paymentResult.invoice_id;
          let attempts = 0;
          const maxAttempts = 30;

          const pollInterval = setInterval(async () => {
            attempts++;
            try {
              const { data: statusResult } = await supabase.functions.invoke('process-payment', {
                body: {
                  action: 'check_status',
                  invoice_id: invoiceId,
                  order_id: order.id,
                }
              });

              if (statusResult?.status === 'COMPLETE') {
                clearInterval(pollInterval);
                setPaymentPolling(false);
                setShowOrderComplete(true);
                clearCart();
              } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                setPaymentPolling(false);
                toast({
                  title: "Payment Timeout",
                  description: "Payment verification timed out. Check your M-Pesa and contact support if charged.",
                  variant: "destructive",
                });
              }
            } catch (err) {
              console.error('Status check error:', err);
            }
          }, 5000);
        }
      } else if (paymentMethod === 'card') {
        const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('process-payment', {
          body: {
            action: 'initiate_card',
            order_id: order.id,
            amount: calculateTotal(),
            currency: 'KES',
            redirect_url: `${window.location.origin}/order-confirmation?order_id=${order.id}`,
          }
        });

        if (paymentError) throw paymentError;

        if (paymentResult?.checkout_url) {
          window.location.href = paymentResult.checkout_url;
          return;
        }
      } else {
        toast({
          title: "Payment Method",
          description: "This payment method is not yet available. Please use M-Pesa or Card.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCompleteRedirect = () => {
    setShowOrderComplete(false);
    navigate('/client-area');
  };

  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return '1 month';
      case 'quarterly': return '3 months';
      case 'annually': return '12 months';
      case 'biennial': return '24 months';
      default: return cycle;
    }
  };

  if (state.items.length === 0) {
    return null;
  }

  const hostingItem = state.items.find(item => item.type === 'hosting');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              You're almost there!
            </h1>
            <p className="text-muted-foreground">
              Complete your {hostingItem?.name} order
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Domain Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Choose your domain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={domainOption.type}
                    onValueChange={(value) => setDomainOption({ type: value as any })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing">I have an existing domain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">Register a new domain</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="subdomain" id="subdomain" />
                      <Label htmlFor="subdomain">Use a free subdomain</Label>
                    </div>
                  </RadioGroup>

                  {domainOption.type === 'existing' && (
                    <div>
                      <Label htmlFor="existing-domain">Enter your existing domain</Label>
                      <Input
                        id="existing-domain"
                        placeholder="yourdomain.com"
                        value={domainOption.domain || ""}
                        onChange={(e) => setDomainOption({ ...domainOption, domain: e.target.value })}
                      />
                    </div>
                  )}

                  {domainOption.type === 'new' && (
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="search for a domain name (e.g. yourdomains.co.ke)"
                          value={domainSearch}
                          onChange={(e) => setDomainSearch(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && searchDomains()}
                        />
                        <Button onClick={searchDomains} disabled={loading}>
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>

                      {availableDomains.length > 0 && (
                        <div className="space-y-2">
                          {availableDomains.map((domain, index) => (
                            <div
                              key={index}
                              className={`flex items-center justify-between p-3 border rounded-lg ${
                                domain.available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${
                                  domain.available ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <span className="font-medium">{domain.domain}</span>
                                {domain.available && (
                                  <Badge className="bg-green-100 text-green-800">Available</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-semibold">KSh {domain.price.toFixed(2)}</span>
                                {domain.available && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleDomainSelect(domain)}
                                    variant={domainOption.domain === domain.domain ? "default" : "outline"}
                                  >
                                    {domainOption.domain === domain.domain ? "Selected" : "Select"}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {domainOption.type === 'subdomain' && (
                    <div>
                      <Label htmlFor="subdomain">Choose your subdomain</Label>
                      <div className="flex">
                        <Input
                          id="subdomain"
                          placeholder="yoursite"
                          value={domainOption.domain?.split('.')[0] || ""}
                          onChange={(e) => setDomainOption({ ...domainOption, domain: `${e.target.value}.abancool.com` })}
                        />
                        <span className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md">
                          .abancool.com
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Domain Add-ons */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-renewal" defaultChecked />
                      <Label htmlFor="auto-renewal" className="text-sm">
                        Auto renewal - Keep your domain active
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      Renews on 05/04/2027 for KSh 2350.00
                    </p>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="domain-privacy" />
                      <Label htmlFor="domain-privacy" className="text-sm">
                        Domain Warranty & Privacy - KSh 999.00 for 1 year
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">
                      Avoid losing your domain by accident & protect your IP!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mpesa" id="mpesa" />
                      <Smartphone className="w-4 h-4" />
                      <Label htmlFor="mpesa">Mpesa</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <DollarSign className="w-4 h-4" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-4 h-4" />
                      <Label htmlFor="card">Credit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Bitcoin className="w-4 h-4" />
                      <Label htmlFor="crypto">Bitcoin/Crypto</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <span className="font-semibold">KSh</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  {state.items.map((item) => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-sm">{item.name} - {formatBillingCycle(item.billingCycle)}</p>
                          <p className="text-xs text-muted-foreground">
                            Pro Rata until 01/05/2026
                          </p>
                        </div>
                        <p className="font-semibold">KSh {item.price.toFixed(2)}</p>
                      </div>
                      
                      {item.setupFee && item.setupFee > 0 && (
                        <div className="flex justify-between">
                          <p className="text-sm text-muted-foreground">Setup Fee</p>
                          <p className="text-sm">Free</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Domain */}
                  {domainOption.type === 'new' && domainOption.domain && (
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">Domain Registration - 1 year</p>
                        <p className="text-xs text-muted-foreground">{domainOption.domain}</p>
                      </div>
                      <p className="font-semibold">KSh {domainOption.price?.toFixed(2)}</p>
                    </div>
                  )}

                  {domainOption.type === 'subdomain' && (
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium text-sm">Subdomain</p>
                        <p className="text-xs text-muted-foreground">{domainOption.domain}</p>
                      </div>
                      <p className="font-semibold">Free</p>
                    </div>
                  )}

                  <Separator />

                  {/* Promo Code */}
                  <div className="space-y-2">
                    {!state.promoCode ? (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Promo Code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <Button onClick={handleApplyPromo} size="sm">
                          Apply
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {state.promoCode}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removePromoCode}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {promoError && (
                      <p className="text-xs text-destructive">{promoError}</p>
                    )}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="space-y-2">
                    {state.discount && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({state.discount}%):</span>
                        <span>-KSh {((calculateTotal() / (1 - state.discount / 100)) * (state.discount / 100)).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total (incl. VAT):</span>
                      <span>KSh {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handlePayNowClick}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Pay Now"}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    By checking out you agree with our Terms of Service. We will process your personal data for the fulfillment of your order and for other purposes as per our Privacy Policy. You can cancel your subscription at any time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DomainWarrantyModal
        isOpen={showDomainWarranty}
        onClose={() => setShowDomainWarranty(false)}
        onAccept={handleDomainWarrantyAccept}
        onDecline={handleDomainWarrantyDecline}
        domainCount={1}
      />

      <GuestCheckoutForm
        isOpen={showGuestForm}
        onClose={() => setShowGuestForm(false)}
        onSubmit={handleGuestFormSubmit}
        loading={loading}
      />

      <OrderCompleteModal
        isOpen={showOrderComplete}
        onRedirect={handleOrderCompleteRedirect}
      />

      <Footer />
    </div>
  );
};

export default Checkout;