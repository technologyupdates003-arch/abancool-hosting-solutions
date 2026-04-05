import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/services/userService";

const ManageClientPIN = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountExpanded, setAccountExpanded] = useState(true);
  const [supportPIN, setSupportPIN] = useState("");

  useEffect(() => {
    if (profile?.support_pin) {
      setSupportPIN(profile.support_pin);
    }
  }, [profile]);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefreshPIN = async () => {
    setRefreshing(true);
    
    try {
      const newPIN = await userService.refreshSupportPIN();
      setSupportPIN(newPIN);
      
      toast({
        title: "PIN Refreshed",
        description: `Your new support PIN is ${newPIN}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to refresh PIN",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
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

      {/* Service Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
            </div>
            We are aware of a potentially service impacting issue.
          </div>
          <button className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-1">
            Learn more
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="container py-6 flex-1">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 shrink-0">
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
                  <button
                    onClick={() => navigate("/account-security")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Account Security
                  </button>
                  <button
                    onClick={() => navigate("/email-history")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    Email History
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    Manage Your Client PIN
                  </div>
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
                <span>clientarea</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">Manage Your Client PIN</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-8">Manage Your Client PIN</h1>

              {/* Support PIN Section */}
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Your Support PIN</h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-4 tracking-wider">
                    {supportPIN}
                  </div>
                  
                  <button
                    onClick={handleRefreshPIN}
                    disabled={refreshing}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh PIN'}
                  </button>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    This PIN can be used to verify your identity when contacting support.
                  </p>
                  <p>
                    Keep this PIN secure and do not share it with unauthorized persons.
                  </p>
                  <p>
                    You can refresh this PIN at any time if you believe it has been compromised.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ManageClientPIN;