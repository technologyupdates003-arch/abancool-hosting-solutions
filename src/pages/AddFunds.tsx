import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { billingService } from "@/services/billingService";

const AddFunds = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [addFundsExpanded, setAddFundsExpanded] = useState(true);
  const [creditExpanded, setCreditExpanded] = useState(true);
  const [billingExpanded, setBillingExpanded] = useState(true);
  const [amount, setAmount] = useState("76.13");
  const [paymentMethod, setPaymentMethod] = useState("Mpesa");
  const [processing, setProcessing] = useState(false);
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

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    
    // Validation
    if (isNaN(depositAmount) || depositAmount < 76.13) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is KSh 76.13",
        variant: "destructive",
      });
      return;
    }
    
    if (depositAmount > 152255.00) {
      toast({
        title: "Amount Too Large",
        description: "Maximum deposit amount is KSh 152,255.00",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    
    try {
      await billingService.addFunds(depositAmount, paymentMethod);
      
      toast({
        title: "Payment Initiated",
        description: `Payment of KSh ${depositAmount.toFixed(2)} via ${paymentMethod} has been initiated. You will receive a prompt on your phone.`,
      });
      
      // Reset form
      setAmount("76.13");
      
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
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
            {/* Add Funds Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setAddFundsExpanded(!addFundsExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {addFundsExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Add Funds</span>
                </button>
              </div>

              {addFundsExpanded && (
                <div className="border-t border-gray-200 p-4">
                  <p className="text-sm text-gray-600">
                    Add funds to your account with us to avoid lots of small transactions and to automatically take care of any new invoices that are generated.
                  </p>
                </div>
              )}
            </div>

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

            {/* Billing Section */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4">
                <button
                  onClick={() => setBillingExpanded(!billingExpanded)}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full"
                >
                  {billingExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">Billing</span>
                </button>
              </div>

              {billingExpanded && (
                <nav className="border-t border-gray-200">
                  <button
                    onClick={() => navigate("/my-invoices")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    My Invoices
                  </button>
                  <button
                    onClick={() => navigate("/my-quotes")}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 border-b border-gray-100"
                  >
                    My Quotes
                  </button>
                  <div className="bg-green-500 text-white px-4 py-3 text-sm font-medium">
                    Add Funds
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
                <span>Client Area</span>
                <span className="mx-2">/</span>
                <span className="text-green-600">Add Funds</span>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add Funds</h1>
                <p className="text-gray-500 text-sm">Deposit money in advance</p>
              </div>

              {/* Deposit Limits */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-6 max-w-md">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Minimum Deposit</span>
                    <span className="text-sm text-gray-900">KSh 76.13</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700">Maximum Deposit</span>
                    <span className="text-sm text-gray-900">KSh 152,255.00</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-sm font-medium text-gray-700">Maximum Balance</span>
                    <span className="text-sm text-gray-900">KSh 152,255.00</span>
                  </div>
                </div>
              </div>

              {/* Add Funds Form */}
              <form onSubmit={handleAddFunds} className="max-w-md space-y-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to Add:
                  </label>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="76.13"
                    max="152255.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method:
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Mpesa">Mpesa</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? "Processing..." : "Add Funds"}
                </button>

                <p className="text-xs text-gray-500">
                  * All deposits are non-refundable.
                </p>
              </form>

              {/* Payment Information */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Payment Information</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Mpesa payments are processed instantly</p>
                  <p>• Bank transfers may take 1-3 business days to reflect</p>
                  <p>• All transactions are secured with SSL encryption</p>
                  <p>• You will receive a confirmation email once payment is processed</p>
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

export default AddFunds;