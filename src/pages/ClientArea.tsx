import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import { useServices } from "@/hooks/useServices";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, Mail, Server, Settings, Shield, Lock, LogOut, UserIcon, Users, Building } from "lucide-react";

const ClientArea = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useProfile(user);
  const { services } = useServices(user);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  const quickLinks = [
    { icon: Globe, title: "My Services", count: services.length, desc: "View your active services", link: "/my-services" },
    { icon: Mail, title: "Email Accounts", count: 0, desc: "Manage your email accounts" },
    { icon: Server, title: "My Domains", count: 0, desc: "Manage your domains" },
    { icon: Settings, title: "Support Tickets", count: 0, desc: "View and create tickets" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Welcome Banner */}
      <div className="bg-muted border-b border-border">
        <div className="container py-8">
          <h1 className="text-3xl font-bold text-foreground">👋 Welcome back, {firstName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Portal Home / <span className="text-primary">Client Area</span></p>
        </div>
      </div>

      <div className="container py-8 flex-1">
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{firstName}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credit balance: <span className="font-bold text-foreground">KSh {profile?.credit_balance?.toFixed(2) || '0.00'}</span></p>
                <button className="text-sm text-primary hover:underline">Top Up</button>
              </div>
              <Link to="#" className="text-sm text-primary hover:underline">Account Management</Link>
            </div>
            <div className="mt-4 bg-primary text-primary-foreground rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium">Client Support PIN</span>
              <span className="text-lg font-bold">{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          </div>

          {/* CTA Card */}
          <div className="border border-border rounded-lg overflow-hidden bg-card">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Build your own website, in MINUTES</h2>
              <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                <li>• No Design or Coding Skills needed</li>
                <li>• 100+ templates</li>
                <li>• Setup Store and Appointments</li>
              </ul>
            </div>
            <Link to="/store" className="block bg-foreground text-background text-center py-4 font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
              START YOUR FREE TRIAL
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => {
            const Component = link.link ? Link : 'div';
            return (
              <Component 
                key={link.title} 
                to={link.link}
                className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow text-center relative cursor-pointer"
              >
                {link.count > 0 && (
                  <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded flex items-center justify-center font-bold">{link.count}</span>
                )}
                <link.icon className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-semibold text-foreground text-sm">{link.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
              </Component>
            );
          })}
        </div>

        {/* Account Management */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: UserIcon, title: "Account Details", desc: "Edit your account details" },
            { icon: Users, title: "User Management", desc: "Sub accounts and permission management", link: "/user-management" },
            { icon: Building, title: "Contacts", desc: "Account contact information management", link: "/contacts" },
            { icon: Shield, title: "Account Security", desc: "Manage Single Sign-On permission", link: "/account-security" },
            { icon: Mail, title: "Email History", desc: "Your email history with us", link: "/email-history" },
            { icon: Settings, title: "Your Profile", desc: "General account profile management" },
            { icon: Lock, title: "Change Password", desc: "Change your current account password" },
            { icon: Shield, title: "Security Settings", desc: "Secure your account & manage linked accounts" },
            { icon: Settings, title: "Manage Your Client PIN", desc: "Manage your support PIN", link: "/manage-client-pin" },
            { icon: LogOut, title: "Logout", desc: "Safely log out of the system", action: handleLogout },
          ].map((link) => {
            const Component = link.link ? Link : 'button';
            return (
              <Component
                key={link.title}
                to={link.link}
                onClick={link.action}
                className="border border-border rounded-lg p-4 bg-card hover:shadow-md transition-shadow flex items-start gap-3 text-left w-full"
              >
                <link.icon className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{link.title}</h3>
                  <p className="text-xs text-muted-foreground">{link.desc}</p>
                </div>
              </Component>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ClientArea;
