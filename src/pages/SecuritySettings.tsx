import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Smartphone, Globe, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SecuritySettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { profile, loading: profileLoading } = useProfile(user);
  const { toast } = useToast();

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    ipWhitelist: "",
    allowMultipleSessions: true
  });

  const [loginHistory] = useState([
    {
      id: 1,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      ip: "192.168.1.100",
      location: "Nairobi, Kenya",
      device: "Chrome on Windows",
      status: "success"
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      ip: "41.90.64.15",
      location: "Mombasa, Kenya",
      device: "Safari on iPhone",
      status: "success"
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      ip: "197.248.15.45",
      location: "Kampala, Uganda",
      device: "Firefox on Linux",
      status: "failed"
    }
  ]);

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

  const handleSettingChange = (setting: string, value: boolean | number | string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      // In a real app, you would save these settings to your database
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Security settings updated successfully.",
      });
    } catch (error) {
      console.error('Error updating security settings:', error);
      toast({
        title: "Error",
        description: "Failed to update security settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "2FA setup will be available in the next update. Please contact support for assistance.",
    });
  };

  const handleTerminateSession = (sessionId: string) => {
    toast({
      title: "Session Terminated",
      description: "The selected session has been terminated.",
    });
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

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
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
              <p className="text-muted-foreground">Secure your account & manage linked accounts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 flex-1">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Security Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {securitySettings.twoFactorEnabled ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm font-medium">Two-Factor Auth</div>
                  <div className="text-xs text-muted-foreground">
                    {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="text-sm font-medium">Strong Password</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    {securitySettings.loginAlerts ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm font-medium">Login Alerts</div>
                  <div className="text-xs text-muted-foreground">
                    {securitySettings.loginAlerts ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account with 2FA
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
                  />
                  {!securitySettings.twoFactorEnabled && (
                    <Button onClick={handleEnable2FA} size="sm">
                      Setup 2FA
                    </Button>
                  )}
                </div>
              </div>
              
              {securitySettings.twoFactorEnabled && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      Two-factor authentication is enabled
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your account is protected with 2FA. You'll need your authenticator app to sign in.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Security Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for security events
                  </p>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Login Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone signs into your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Allow Multiple Sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Allow signing in from multiple devices simultaneously
                  </p>
                </div>
                <Switch
                  checked={securitySettings.allowMultipleSessions}
                  onCheckedChange={(checked) => handleSettingChange('allowMultipleSessions', checked)}
                />
              </div>

              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically log out after this period of inactivity
                </p>
              </div>

              <div>
                <Label htmlFor="ipWhitelist">IP Whitelist (Optional)</Label>
                <Input
                  id="ipWhitelist"
                  value={securitySettings.ipWhitelist}
                  onChange={(e) => handleSettingChange('ipWhitelist', e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1 (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Only allow logins from these IP addresses. Leave empty to allow all IPs.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loginHistory.map((login) => (
                  <div key={login.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        login.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-medium text-sm">
                          {login.device}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {login.location} • {login.ip}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {login.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={login.status === 'success' ? 'default' : 'destructive'}>
                        {login.status === 'success' ? 'Success' : 'Failed'}
                      </Badge>
                      {login.status === 'success' && login.id !== 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTerminateSession(login.id.toString())}
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Alert */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Security Recommendation</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    For maximum security, we recommend enabling two-factor authentication and regularly reviewing your login activity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={saving} size="lg">
              <Shield className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Security Settings"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SecuritySettings;