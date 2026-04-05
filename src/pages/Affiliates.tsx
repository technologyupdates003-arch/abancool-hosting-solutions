import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { affiliateService } from "@/services/affiliateService";

const Affiliates = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const navigate = useNavigate();
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

  const handleActivateAffiliate = async () => {
    setActivating(true);
    
    try {
      await affiliateService.activateAffiliateAccount();
      
      toast({
        title: "Affiliate Account Activated!",
        description: "Your affiliate account has been successfully activated. You can now start earning commissions.",
      });
      
      // Redirect to affiliate dashboard or management page
      // navigate("/affiliate-dashboard");
      
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate affiliate account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
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

      <div className="container py-8 flex-1">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span>Portal Home</span>
          <span className="mx-2">/</span>
          <span className="text-green-600">Affiliates</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Activate Affiliate Account</h1>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-blue-50 border-b border-blue-100 px-8 py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Get Paid for Referring Customers to Us
            </h2>
            <p className="text-gray-600">
              Activate your affiliate account and start earning money today...
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-8">
            <div className="max-w-3xl">
              <ul className="space-y-4 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></div>
                  <span>We pay commissions for every signup that comes via your custom signup link.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></div>
                  <span>
                    We track the visitors you refer to us using cookies, so users you refer don't have to purchase instantly for you to receive your commission. Cookies last for up to 90 days following the initial visit.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></div>
                  <span>If you would like to find out more, please contact us.</span>
                </li>
              </ul>

              <div className="text-center">
                <button
                  onClick={handleActivateAffiliate}
                  disabled={activating}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {activating ? "Activating..." : "Activate Affiliate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Get Your Link</h4>
              <p>Once activated, you'll receive a unique referral link to share with potential customers.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Refer Customers</h4>
              <p>Share your link through social media, websites, or direct communication with prospects.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Earn Commissions</h4>
              <p>Receive commissions for every successful signup that comes through your referral link.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Affiliate Benefits</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Competitive commission rates</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>90-day cookie tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Real-time tracking dashboard</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Monthly commission payouts</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Marketing materials provided</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Dedicated affiliate support</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Affiliates;