import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { userService } from "@/services/userService";

const AccountSecurity = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const { toast } = useToast();

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

  useEffect(() => {
    if (profile) {
      setSsoEnabled(profile.sso_enabled || false);
    }
  }, [profile]);

  const handleSsoToggle = async () => {
    try {
      await userService.updateSSOSettings(!ssoEnabled);
      setSsoEnabled(!ssoEnabled);
      toast({
        title: ssoEnabled ? "Single Sign-On Disabled" : "Single Sign-On Enabled",
        description: ssoEnabled 
          ? "Third party applications will no longer have direct access to your billing account."
          : "Third party applications can now access your billing account.",
      });
    } catch (error: any) {
      toast({
        title: "Failed to update SSO settings",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container py-6 flex-1">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0 space-y-4">
            {/* Available Credit Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setCreditExpanded(!creditExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {creditExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Available Credit</span>
                </button>
              </div>

              {creditExpanded && (
                <div className="border-t border-gray-200 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      KSh {profile?.credit_balance?.toFixed(2) || '0.00'}
                    </div>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2">
                      <span>+</span>
                      Add Funds
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setAccountExpanded(!accountExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {accountExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Account</span>
                </button>
              </div>

              {accountExpanded && (
                <nav className="border-t border-gray-200">
                  <button
                    onClick={() => navigate("/client-area")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Account Details
                  </button>
                  <button
                    onClick={() => navigate("/user-management")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    User Management
                  </button>
                  <button
                    onClick={() => navigate("/contacts")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Contacts
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    Account Security
                  </div>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                    Email History
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                    Manage Your Client PIN
                  </button>
                </nav>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Breadcrumb */}
              <div className="text-sm text-gray-500 mb-6">
                <span>Portal Home</span>
                <span className="mx-2">/</span>
                <span>Client Area</span>
                <span className="mx-2">/</span>
                <span>Account Details</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">Account Security</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Security</h1>

              {/* Single Sign-On Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Single Sign-On</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-700">
                    Third party applications leverage the Single Sign-On functionality to provide direct access to your billing account 
                    without you having to re-authenticate.
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <button
                      onClick={handleSsoToggle}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        ssoEnabled ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          ssoEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className="ml-3 text-sm font-medium text-white bg-green-500 px-3 py-1 rounded">
                      {ssoEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">
                    Single Sign-On is currently {ssoEnabled ? 'permitted' : 'disabled'} for your account.
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  You may wish to disable this functionality if you provide access to any of your third party applications to users who you 
                  do not wish to be able to access your billing account.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountSecurity;