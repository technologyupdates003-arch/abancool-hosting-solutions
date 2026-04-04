import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent!", description: "Check your inbox for a password reset link." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-1">Forgot Password?</h1>
          <p className="text-muted-foreground mb-8">Enter your email to receive a password reset link.</p>
          <form onSubmit={handleReset} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border rounded-md px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary outline-none"
            />
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
