import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, RefreshCw, Package } from "lucide-react";
import { toast } from "sonner";

interface HostingPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  monthly_price: number | null;
  quarterly_price: number | null;
  annual_price: number | null;
  biennial_price: number | null;
  currency: string;
  features: any;
  is_active: boolean;
  created_at: string;
}

const emptyPlan = {
  name: "", description: "", category: "shared", price: 0,
  monthly_price: 0, quarterly_price: 0, annual_price: 0, biennial_price: 0,
  currency: "KSh", features: [] as string[], is_active: true
};

export function PlanManagementModule() {
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<HostingPlan | null>(null);
  const [form, setForm] = useState({ ...emptyPlan });
  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => { loadPlans(); }, []);

  const loadPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from('hosting_plans').select('*').order('category').order('price');
    setPlans((data || []) as HostingPlan[]);
    setLoading(false);
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm({ ...emptyPlan });
    setDialogOpen(true);
  };

  const openEdit = (plan: HostingPlan) => {
    setEditingPlan(plan);
    const features = Array.isArray(plan.features) ? plan.features : [];
    setForm({
      name: plan.name, description: plan.description, category: plan.category,
      price: plan.price, monthly_price: plan.monthly_price || 0,
      quarterly_price: plan.quarterly_price || 0, annual_price: plan.annual_price || 0,
      biennial_price: plan.biennial_price || 0, currency: plan.currency || "KSh",
      features, is_active: plan.is_active
    });
    setDialogOpen(true);
  };

  const savePlan = async () => {
    if (!form.name || !form.description || !form.category) {
      toast.error("Please fill in name, description and category");
      return;
    }
    const payload = {
      name: form.name, description: form.description, category: form.category,
      price: form.price, monthly_price: form.monthly_price || null,
      quarterly_price: form.quarterly_price || null, annual_price: form.annual_price || null,
      biennial_price: form.biennial_price || null, currency: form.currency,
      features: form.features, is_active: form.is_active
    };

    let error;
    if (editingPlan) {
      ({ error } = await supabase.from('hosting_plans').update(payload as any).eq('id', editingPlan.id));
    } else {
      ({ error } = await supabase.from('hosting_plans').insert(payload as any));
    }

    if (error) {
      toast.error("Failed to save plan: " + error.message);
    } else {
      toast.success(editingPlan ? "Plan updated" : "Plan created");
      setDialogOpen(false);
      loadPlans();
    }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan? This cannot be undone.")) return;
    const { error } = await supabase.from('hosting_plans').delete().eq('id', id);
    if (error) toast.error("Failed to delete: " + error.message);
    else { toast.success("Plan deleted"); loadPlans(); }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  };

  const categoryLabel: Record<string, string> = {
    shared: "Shared Hosting", vps: "VPS Hosting", reseller: "Reseller Hosting",
    security: "Security", email: "Email Hosting", dedicated: "Dedicated"
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Plans & Products</h2>
          <p className="text-gray-600">Manage hosting plans displayed in the store</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Plan</Button>
          <Button variant="outline" onClick={loadPlans}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(categoryLabel).map(([key, label]) => {
          const count = plans.filter(p => p.category === key).length;
          return (
            <Card key={key}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>All Plans ({plans.length})</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Monthly</TableHead>
                <TableHead>Quarterly</TableHead>
                <TableHead>Annual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map(plan => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div><div className="font-medium">{plan.name}</div><div className="text-xs text-gray-500 truncate max-w-[200px]">{plan.description}</div></div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{categoryLabel[plan.category] || plan.category}</Badge></TableCell>
                  <TableCell>{plan.currency} {plan.monthly_price || plan.price}</TableCell>
                  <TableCell>{plan.quarterly_price ? `${plan.currency} ${plan.quarterly_price}` : '-'}</TableCell>
                  <TableCell>{plan.annual_price ? `${plan.currency} ${plan.annual_price}` : '-'}</TableCell>
                  <TableCell><Badge variant={plan.is_active ? "default" : "secondary"}>{plan.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(plan)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => deletePlan(plan.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {plans.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No plans yet. Click "Add Plan" to create your first hosting plan.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingPlan ? "Edit Plan" : "Create New Plan"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Plan Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Starter Hosting" /></div>
              <div>
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({...form, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shared">Shared Hosting</SelectItem>
                    <SelectItem value="vps">VPS Hosting</SelectItem>
                    <SelectItem value="reseller">Reseller Hosting</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="email">Email Hosting</SelectItem>
                    <SelectItem value="dedicated">Dedicated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><Label>Description *</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the plan..." /></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><Label>Base Price</Label><Input type="number" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})} /></div>
              <div><Label>Monthly</Label><Input type="number" value={form.monthly_price} onChange={e => setForm({...form, monthly_price: parseFloat(e.target.value) || 0})} /></div>
              <div><Label>Quarterly</Label><Input type="number" value={form.quarterly_price} onChange={e => setForm({...form, quarterly_price: parseFloat(e.target.value) || 0})} /></div>
              <div><Label>Annual</Label><Input type="number" value={form.annual_price} onChange={e => setForm({...form, annual_price: parseFloat(e.target.value) || 0})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Biennial</Label><Input type="number" value={form.biennial_price} onChange={e => setForm({...form, biennial_price: parseFloat(e.target.value) || 0})} /></div>
              <div><Label>Currency</Label><Input value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} /></div>
            </div>
            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mt-1">
                <Input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Add a feature..." />
                <Button type="button" onClick={addFeature} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.features.map((f, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(i)}>
                    {f} ×
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={v => setForm({...form, is_active: v})} />
              <Label>Active (visible in store)</Label>
            </div>
            <Button className="w-full" onClick={savePlan}>{editingPlan ? "Update Plan" : "Create Plan"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
