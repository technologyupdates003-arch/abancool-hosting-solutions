import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Zap, Play } from "lucide-react";
import { toast } from "sonner";

export function AutomationModule() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRules(); }, []);

  const loadRules = async () => {
    setLoading(true);
    const { data } = await supabase.from('automation_rules').select('*').order('created_at', { ascending: false });
    setRules(data || []);
    setLoading(false);
  };

  const toggleRule = async (id: string, currentActive: boolean) => {
    const { error } = await supabase.from('automation_rules').update({ is_active: !currentActive, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error("Failed to update rule");
    else { toast.success(`Rule ${!currentActive ? 'activated' : 'deactivated'}`); loadRules(); }
  };

  const triggerRule = async (rule: any) => {
    try {
      const { error } = await supabase.rpc('trigger_automation_rules', { event_name: rule.trigger_event, event_data: {} });
      if (error) throw error;
      toast.success(`Triggered: ${rule.name}`);
      loadRules();
    } catch { toast.error("Failed to trigger rule"); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold text-gray-800">Automation Rules</h2><p className="text-gray-600">Workflow automation management</p></div>
        <Button variant="outline" onClick={loadRules}><RefreshCw className="w-4 h-4 mr-2" />Refresh</Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{rules.length}</div><div className="text-xs text-gray-500">Total Rules</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold text-green-600">{rules.filter(r => r.is_active).length}</div><div className="text-xs text-gray-500">Active</div></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><div className="text-2xl font-bold">{rules.reduce((s, r) => s + (r.execution_count || 0), 0)}</div><div className="text-xs text-gray-500">Total Executions</div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Trigger</TableHead><TableHead>Actions</TableHead><TableHead>Executions</TableHead><TableHead>Status</TableHead><TableHead>Last Run</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rules.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><Badge variant="outline">{r.trigger_event}</Badge></TableCell>
                  <TableCell>{Array.isArray(r.actions) ? r.actions.length : 0}</TableCell>
                  <TableCell>{r.execution_count}</TableCell>
                  <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell className="text-xs">{r.last_executed ? new Date(r.last_executed).toLocaleString() : 'Never'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => toggleRule(r.id, r.is_active)}>{r.is_active ? 'Disable' : 'Enable'}</Button>
                      <Button size="sm" variant="ghost" onClick={() => triggerRule(r)}><Play className="w-3 h-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">No automation rules configured</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
