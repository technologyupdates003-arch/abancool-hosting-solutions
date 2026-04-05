import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Mail, Server, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { automationService } from "@/services/automationService";
import { emailService } from "@/services/emailService";

interface EmailQueueItem {
  id: string;
  to_email: string;
  subject: string;
  template_name?: string;
  status: string;
  attempts: number;
  scheduled_at: string;
  sent_at?: string;
  error_message?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger_event: string;
  is_active: boolean;
  execution_count: number;
  last_executed?: string;
}

export function AdminPanel() {
  const [emailQueue, setEmailQueue] = useState<EmailQueueItem[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [stats, setStats] = useState({
    pendingEmails: 0,
    sentEmails: 0,
    failedEmails: 0,
    activeRules: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        loadEmailQueue(),
        loadAutomationRules(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadEmailQueue = async () => {
    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setEmailQueue(data);
    }
  };

  const loadAutomationRules = async () => {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAutomationRules(data);
    }
  };

  const loadStats = async () => {
    const { data: emailStats } = await supabase
      .from('email_queue')
      .select('status')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const { data: ruleStats } = await supabase
      .from('automation_rules')
      .select('is_active')
      .eq('is_active', true);

    if (emailStats) {
      setStats({
        pendingEmails: emailStats.filter(e => e.status === 'pending').length,
        sentEmails: emailStats.filter(e => e.status === 'sent').length,
        failedEmails: emailStats.filter(e => e.status === 'failed').length,
        activeRules: ruleStats?.length || 0
      });
    }
  };

  const processEmailQueue = async () => {
    setLoading(true);
    try {
      await emailService.processQueue();
      await loadData();
    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAutomations = async () => {
    setLoading(true);
    try {
      await automationService.processAutomations();
      await loadData();
    } catch (error) {
      console.error('Error processing automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      sent: "default",
      pending: "secondary",
      failed: "destructive",
      retry: "outline"
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <Button onClick={processEmailQueue} disabled={loading}>
            <Mail className="w-4 h-4 mr-2" />
            Process Emails
          </Button>
          <Button onClick={processAutomations} disabled={loading}>
            <Activity className="w-4 h-4 mr-2" />
            Process Automations
          </Button>
          <Button onClick={loadData} variant="outline" disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Emails</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEmails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sentEmails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Emails</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedEmails}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRules}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="emails" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emails">Email Queue</TabsTrigger>
          <TabsTrigger value="automations">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailQueue.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(email.status)}
                          {getStatusBadge(email.status)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{email.to_email}</TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>{email.template_name || '-'}</TableCell>
                      <TableCell>{email.attempts}</TableCell>
                      <TableCell>{new Date(email.scheduled_at).toLocaleString()}</TableCell>
                      <TableCell>
                        {email.sent_at ? new Date(email.sent_at).toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Trigger Event</TableHead>
                    <TableHead>Executions</TableHead>
                    <TableHead>Last Executed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Badge variant={rule.is_active ? "default" : "secondary"}>
                          {rule.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.trigger_event}</TableCell>
                      <TableCell>{rule.execution_count}</TableCell>
                      <TableCell>
                        {rule.last_executed 
                          ? new Date(rule.last_executed).toLocaleString() 
                          : 'Never'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}