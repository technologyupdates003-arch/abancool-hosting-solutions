import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ipService } from "@/services/ipService";

const UnblockIP = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultType, setResultType] = useState<"success" | "error" | null>(null);
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

  const handleCheckIP = async () => {
    if (!ipAddress.trim()) {
      toast({
        title: "IP Address Required",
        description: "Please enter an IP address to check.",
        variant: "destructive",
      });
      return;
    }

    // Basic IP address validation
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ipAddress.trim())) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IP address format (e.g., 192.168.1.1).",
        variant: "destructive",
      });
      return;
    }

    setChecking(true);
    setResult(null);
    setResultType(null);

    try {
      const checkResult = await ipService.mockCheckIP(ipAddress.trim());
      
      if (checkResult.isBlocked) {
        setResult(`IP ${ipAddress} is currently blocked. Click "Unblock" to remove the block.`);
        setResultType("error");
      } else {
        setResult(checkResult.message);
        setResultType("success");
      }
      
    } catch (error: any) {
      toast({
        title: "Check Failed",
        description: error.message || "Failed to check IP address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  const handleUnblockIP = async () => {
    setChecking(true);
    
    try {
      await ipService.unblockIP(ipAddress.trim());
      
      setResult(`IP ${ipAddress} has been successfully unblocked.`);
      setResultType("success");
      
      toast({
        title: "IP Unblocked",
        description: `IP address ${ipAddress} has been successfully unblocked.`,
      });
      
    } catch (error: any) {
      toast({
        title: "Unblock Failed",
        description: error.message || "Failed to unblock IP address. Please try again.",
        variant: "destructive",
      });
    } finally {
      setChecking(false);
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

      <div className="container py-8 flex-1">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <span>Portal Home</span>
          <span className="mx-2">/</span>
          <span className="text-green-600">IP Address Unblock</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">IP Address Unblock</h1>

        <div className="max-w-2xl">
          {/* Result Message */}
          {result && (
            <div className={`mb-6 p-4 rounded-lg border ${
              resultType === "success" 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}>
              {result}
            </div>
          )}

          {/* IP Input Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700 mb-2">
                IP Address To Check
              </label>
              <input
                id="ipAddress"
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-gray-600"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCheckIP}
                disabled={checking}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {checking ? "Checking..." : "Check for IP Block and Remove"}
              </button>

              {result && resultType === "error" && (
                <button
                  onClick={handleUnblockIP}
                  disabled={checking}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {checking ? "Unblocking..." : "Unblock IP"}
                </button>
              )}
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About IP Address Blocking</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                IP addresses may be automatically blocked by our security systems for various reasons including:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Multiple failed login attempts</li>
                <li>Suspicious activity patterns</li>
                <li>Malware or spam detection</li>
                <li>Brute force attack attempts</li>
              </ul>
              <p>
                Use this tool to check if your IP address is blocked and remove the block if necessary. 
                If you continue to experience issues, please contact our support team.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  If your IP address continues to be blocked or you need assistance, please contact our support team 
                  for further investigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UnblockIP;