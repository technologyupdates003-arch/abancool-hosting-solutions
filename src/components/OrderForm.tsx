import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { orderService } from '@/services/orderService';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderFormProps {
  plan: Tables<'hosting_plans'>;
  onClose: () => void;
}

export const OrderForm = ({ plan, onClose }: OrderFormProps) => {
  const [domain, setDomain] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please login first", variant: "destructive" });
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const amount = billingCycle === 'yearly' ? plan.price * 10 : plan.price;
      
      await orderService.createOrder({
        plan_id: plan.id,
        domain: domain || null,
        billing_cycle: billingCycle,
        amount,
        currency: plan.currency,
        status: 'pending',
      } as any);

      toast({ title: "Order created successfully!", description: "We'll process your order shortly." });
      onClose();
    } catch (error: any) {
      toast({ title: "Order failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Order {plan.name}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="billing">Billing Cycle</Label>
            <Select value={billingCycle} onValueChange={setBillingCycle}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly - {plan.currency} {plan.price.toFixed(2)}</SelectItem>
                <SelectItem value="yearly">Yearly - {plan.currency} {(plan.price * 10).toFixed(2)} (2 months free)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};