import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";
import { X, ShoppingCart } from "lucide-react";

interface BillingCycleSelectorProps {
  plan: Tables<'hosting_plans'>;
  onClose: () => void;
}

export function BillingCycleSelector({ plan, onClose }: BillingCycleSelectorProps) {
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'quarterly' | 'annually' | 'biennial'>('monthly');
  const { addItem } = useCart();
  const { toast } = useToast();

  const billingOptions = [
    {
      cycle: 'monthly' as const,
      label: '1 MONTH',
      multiplier: 1,
      discount: 0,
      popular: false,
      renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    },
    {
      cycle: 'quarterly' as const,
      label: '3 MONTHS',
      multiplier: 3,
      discount: 5,
      popular: false,
      renewsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    },
    {
      cycle: 'annually' as const,
      label: '12 MONTHS',
      multiplier: 12,
      discount: 15,
      popular: true,
      renewsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    },
    {
      cycle: 'biennial' as const,
      label: '24 MONTHS',
      multiplier: 24,
      discount: 25,
      popular: false,
      renewsAt: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB')
    }
  ];

  const calculatePrice = (multiplier: number, discount: number) => {
    const basePrice = plan.price * multiplier;
    return basePrice * (1 - discount / 100);
  };

  const handleAddToCart = () => {
    const selectedOption = billingOptions.find(opt => opt.cycle === selectedCycle)!;
    const price = calculatePrice(selectedOption.multiplier, selectedOption.discount);

    addItem({
      type: 'hosting',
      planId: plan.id,
      name: plan.name,
      price: price,
      currency: plan.currency,
      billingCycle: selectedCycle,
      features: Array.isArray(plan.features) ? plan.features : [],
      category: plan.category,
      setupFee: 0,
      renewalPrice: plan.price * selectedOption.multiplier
    });

    toast({
      title: "Added to Cart",
      description: `${plan.name} (${selectedOption.label}) has been added to your cart.`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                📅
              </span>
              Choose your billing cycle
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select the billing period for {plan.name}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <RadioGroup value={selectedCycle} onValueChange={(value) => setSelectedCycle(value as any)}>
            <div className="grid gap-4">
              {billingOptions.map((option) => {
                const price = calculatePrice(option.multiplier, option.discount);
                const monthlyPrice = price / option.multiplier;
                
                return (
                  <div key={option.cycle} className="relative">
                    {option.popular && (
                      <Badge className="absolute -top-2 left-4 z-10 bg-green-500 text-white">
                        SAVE {option.discount}%
                      </Badge>
                    )}
                    <Label
                      htmlFor={option.cycle}
                      className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedCycle === option.cycle
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={option.cycle} id={option.cycle} />
                        <div>
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-sm text-muted-foreground">
                            Renews at {price.toFixed(2)} on {option.renewsAt}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">
                          {plan.currency} {price.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {plan.currency} {monthlyPrice.toFixed(2)} / per month
                        </div>
                        {option.discount > 0 && (
                          <div className="text-xs text-green-600 font-medium">
                            Save {option.discount}%
                          </div>
                        )}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {/* Domain Options */}
          <div className="border-t pt-6">
            <h4 className="font-semibold mb-4">Domain Options</h4>
            <div className="space-y-3">
              <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input type="radio" name="domain" value="existing" defaultChecked />
                <div>
                  <div className="font-medium">I have an existing domain</div>
                  <div className="text-sm text-muted-foreground">Use your current domain with this hosting plan</div>
                </div>
              </Label>
              
              <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input type="radio" name="domain" value="new" />
                <div>
                  <div className="font-medium">Register a new domain</div>
                  <div className="text-sm text-muted-foreground">Search and register a new domain (additional cost)</div>
                </div>
              </Label>
              
              <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input type="radio" name="domain" value="subdomain" />
                <div>
                  <div className="font-medium">Use a free subdomain</div>
                  <div className="text-sm text-muted-foreground">Get a free yoursite.abancool.com subdomain</div>
                </div>
              </Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}