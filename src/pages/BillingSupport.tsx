import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, 
  FileText, 
  Shield, 
  BookOpen, 
  Wrench, 
  Receipt, 
  Plus, 
  Ticket, 
  Download, 
  Megaphone, 
  Activity,
  Edit
} from "lucide-react";

const BillingSupport = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const billingItems = [
    {
      icon: Receipt,
      title: "My Invoices",
      description: "Your invoice history with us",
      link: "/my-invoices"
    },
    {
      icon: Plus,
      title: "Add Funds",
      description: "Deposit money in advance",
      link: "/add-funds"
    },
    {
      icon: FileText,
      title: "Account Statement",
      description: "Generate your account invoices statement",
      link: "/account-statement"
    },
    {
      icon: Edit,
      title: "Open Ticket",
      description: "Need help? Open a new ticket with our support",
      link: "/open-ticket"
    }
  ];

  const supportItems = [
    {
      icon: Users,
      title: "Affiliates",
      description: "Affiliate management",
      link: "/affiliates"
    },
    {
      icon: FileText,
      title: "My Quotes",
      description: "Quotes we have created for you",
      link: "/my-quotes"
    },
    {
      icon: Shield,
      title: "View and Unblock IP Address",
      description: "Remove blocked IPs",
      link: "/unblock-ip"
    },
    {
      icon: BookOpen,
      title: "Knowledgebase",
      description: "Tutorials, instructions & guides",
      link: "/knowledgebase"
    },
    {
      icon: Wrench,
      title: "Resolution Center",
      description: "Resolve Abuse Complaints",
      link: "/resolution-center"
    },
    {
      icon: Ticket,
      title: "Tickets",
      description: "Contact support and view ticket history",
      link: "/tickets"
    },
    {
      icon: Download,
      title: "Downloads",
      description: "Manuals, programs, and other files",
      link: "/downloads"
    },
    {
      icon: Megaphone,
      title: "Announcements",
      description: "All the latest from HOSTAFRICA",
      link: "/announcements"
    },
    {
      icon: Activity,
      title: "Network Status",
      description: "Network issues & scheduled maintenances",
      link: "/network-status"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Billing Items */}
          {billingItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.link)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <item.icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </button>
          ))}

          {/* Support Items */}
          {supportItems.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.link)}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <item.icon className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BillingSupport;