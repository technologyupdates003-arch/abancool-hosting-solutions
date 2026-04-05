import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import { userService } from "@/services/userService";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [permissionType, setPermissionType] = useState("all");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [accountExpanded, setAccountExpanded] = useState(true);
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviteLoading(true);
    try {
      await userService.inviteUser(inviteEmail, permissionType);
      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${inviteEmail}`,
      });
      setInviteEmail("");
    } catch (error: any) {
      toast({
        title: "Failed to send invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || "User";

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
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    User Management
                  </div>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                    Contacts
                  </button>
                  <button className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                    Account Security
                  </button>
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
                <span className="text-green-600">User Management</span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>

              {/* Users List */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">1 Users Found</h2>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Email Address / Last Login</span>
                      <span className="font-medium text-gray-700">Actions</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{user?.email}</span>
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Owner</span>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Last Login: 4 minutes ago
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded">
                          Manage Permissions
                        </button>
                        <button className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded">
                          Remove Access
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  * Account owners always have full permissions over a client account.
                </p>
              </div>

              {/* Invite New User */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Invite New User</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Inviting a new user allows you to invite a new user to your account. If the invitee already has an existing user account, 
                  they will be able to access your account using their existing login credentials. If the user does not yet have a user 
                  account, they will be able to create one.
                </p>

                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="permissions"
                        value="all"
                        checked={permissionType === "all"}
                        onChange={(e) => setPermissionType(e.target.value)}
                        className="text-blue-500"
                      />
                      <span className="text-sm text-gray-700">All Permissions</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="permissions"
                        value="choose"
                        checked={permissionType === "choose"}
                        onChange={(e) => setPermissionType(e.target.value)}
                        className="text-blue-500"
                      />
                      <span className="text-sm text-gray-700">Choose Permissions</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={inviteLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {inviteLoading ? "Sending..." : "Send Invite"}
                  </button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserManagement;