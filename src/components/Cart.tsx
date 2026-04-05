import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Tag, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <CartContent />
      </SheetContent>
    </Sheet>
  );
}

function CartContent() {
  const { state, removeItem, applyPromoCode, removePromoCode } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");

  const handleApplyPromo = () => {
    // Simple promo code validation - in real app, this would be an API call
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

  const getBillingCycleMultiplier = (cycle: string) => {
    switch (cycle) {
      case 'quarterly': return 3;
      case 'annually': return 12;
      case 'biennial': return 24;
      default: return 1;
    }
  };

  const formatBillingCycle = (cycle: string) => {
    switch (cycle) {
      case 'monthly': return '1 Month';
      case 'quarterly': return '3 Months';
      case 'annually': return '12 Months';
      case 'biennial': return '24 Months';
      default: return cycle;
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground mb-6">Add some hosting plans to get started</p>
        <Button asChild>
          <Link to="/store">Browse Plans</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader>
        <SheetTitle>Shopping Cart ({state.items.length})</SheetTitle>
        <SheetDescription>
          Review your items before checkout
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="space-y-4">
          {state.items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                    {item.domain && (
                      <p className="text-xs text-primary">Domain: {item.domain}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs">
                    <Badge variant="outline">{formatBillingCycle(item.billingCycle)}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.currency} {item.price.toFixed(2)}</p>
                    {item.setupFee && item.setupFee > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Setup: {item.currency} {item.setupFee.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 space-y-4">
        {/* Promo Code */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyPromo} size="sm">
              Apply
            </Button>
          </div>
          {promoError && (
            <p className="text-xs text-destructive">{promoError}</p>
          )}
          {state.promoCode && (
            <div className="flex items-center justify-between bg-green-50 p-2 rounded">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {state.promoCode} (-{state.discount}%)
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
        </div>

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{state.currency} {(state.total / (1 - (state.discount || 0) / 100)).toFixed(2)}</span>
          </div>
          {state.discount && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({state.discount}%):</span>
              <span>-{state.currency} {((state.total / (1 - state.discount / 100)) * (state.discount / 100)).toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total:</span>
            <span>{state.currency} {state.total.toFixed(2)}</span>
          </div>
        </div>

        <Button asChild className="w-full" size="lg">
          <Link to="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}