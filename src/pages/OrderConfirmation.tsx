import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderService, Order } from "@/services/orderService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Download, Mail, ArrowRight } from "lucide-react";

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const orderData = await orderService.getOrderById(orderId!);
      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="container py-16 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The order you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link to="/client-area">Go to Client Area</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your order. We've received your payment and are setting up your services.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Number:</span>
                    <span className="font-semibold">#{order.order_number}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Order Date:</span>
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-start p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          {item.billingCycle && (
                            <Badge variant="outline" className="mt-2">
                              {formatBillingCycle(item.billingCycle)}
                            </Badge>
                          )}
                          {item.domain && (
                            <p className="text-sm text-primary mt-1">Domain: {item.domain}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.currency} {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Service Provisioning</h4>
                      <p className="text-sm text-muted-foreground">
                        We're setting up your hosting services. This usually takes 5-15 minutes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Welcome Email</h4>
                      <p className="text-sm text-muted-foreground">
                        You'll receive login credentials and setup instructions via email.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Start Building</h4>
                      <p className="text-sm text-muted-foreground">
                        Access your control panel and start building your website.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{order.currency} {order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{order.currency} {order.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{order.currency} {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild className="w-full">
                    <Link to="/client-area">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Go to Client Area
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>

              {/* Support Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>If you have any questions about your order or need assistance:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Email: support@abancool.com</li>
                    <li>• Phone: +254 700 000 000</li>
                    <li>• Live Chat: Available 24/7</li>
                  </ul>
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

export default OrderConfirmation;