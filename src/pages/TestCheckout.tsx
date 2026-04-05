import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, TestTube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TestCheckout = () => {
  const { addItem, state } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const testPlans = [
    {
      id: "test-starter",
      name: "Test Starter Hosting",
      price: 500,
      currency: "KSh",
      billingCycle: "monthly" as const,
      features: ["1 GB Storage", "10 GB Bandwidth", "1 Domain", "Email Support"],
      setupFee: 0,
      renewalPrice: 500
    },
    {
      id: "test-business",
      name: "Test Business Hosting", 
      price: 1200,
      currency: "KSh",
      billingCycle: "monthly" as const,
      features: ["5 GB Storage", "50 GB Bandwidth", "5 Domains", "Priority Support"],
      setupFee: 0,
      renewalPrice: 1200
    }
  ];

  const addTestPlan = (plan: any) => {
    setLoading(true);
    
    addItem({
      type: "hosting",
      planId: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      billingCycle: plan.billingCycle,
      features: plan.features,
      setupFee: plan.setupFee,
      renewalPrice: plan.renewalPrice,
      category: "hosting"
    });

    toast({
      title: "Added to Cart",
      description: `${plan.name} has been added to your cart.`,
    });

    setLoading(false);
  };

  const goToCheckout = () => {
    if (state.items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add a hosting plan to your cart first.",
        variant: "destructive"
      });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TestTube className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-foreground">
                Test Checkout Flow
              </h1>
            </div>
            <p className="text-muted-foreground">
              Test the complete checkout process: Add to Cart → Domain Warranty → Guest Form → Order Complete
            </p>
          </div>

          {/* Cart Status */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Current Cart ({state.items.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {state.items.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty. Add a test plan below.</p>
              ) : (
                <div className="space-y-2">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.billingCycle} billing
                        </p>
                      </div>
                      <Badge variant="outline">
                        {item.currency} {item.price.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-lg">
                        KSh {state.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {testPlans.map((plan) => (
              <Card key={plan.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    {plan.name}
                    <Badge variant="secondary">Test Plan</Badge>
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.currency} {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.billingCycle}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => addTestPlan(plan)}
                    disabled={loading}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Checkout Button */}
          <div className="text-center">
            <Button 
              onClick={goToCheckout}
              size="lg"
              className="bg-green-500 hover:bg-green-600"
              disabled={state.items.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>

          {/* Test Flow Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Flow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Add a test hosting plan to your cart</li>
                <li>Click "Proceed to Checkout"</li>
                <li>Choose domain option (existing, new, or subdomain)</li>
                <li>Select payment method</li>
                <li>Click "Pay Now" - Domain Warranty modal will appear</li>
                <li>Click "no, thank you" to proceed without warranty</li>
                <li>Fill out the guest checkout form with your details</li>
                <li>Order will be processed and DirectAdmin account created</li>
                <li>Check browser console for email queue and DirectAdmin logs</li>
                <li>You'll be redirected to client area after completion</li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> This is a test environment. No real payments are processed, 
                  but the complete automation flow (DirectAdmin account creation, email queueing) 
                  is simulated and logged to the console.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TestCheckout;