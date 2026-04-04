import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    company: "", address: "", city: "", state: "", postcode: "", country: "Kenya",
    password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { first_name: form.firstName, last_name: form.lastName, phone: form.phone },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/login");
    }
  };

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/client-area` },
    });
  };

  const inputClass = "w-full border border-border rounded-md px-4 py-3 text-sm bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-1">Register</h1>
          <p className="text-muted-foreground mb-2">Create an account with us...</p>
          <p className="text-sm text-muted-foreground mb-6">
            Already registered? <Link to="/login" className="text-primary hover:underline">Login here</Link>
          </p>

          {/* Google Sign Up */}
          <div className="mb-8 text-center">
            <p className="text-sm text-primary font-medium mb-3">Sign Up</p>
            <button
              onClick={handleGoogleSignup}
              className="border border-border rounded-md px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors inline-flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Personal Info */}
            <div>
              <h2 className="text-primary font-semibold text-center mb-4 border-b border-border pb-2">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="First Name" value={form.firstName} onChange={update("firstName")} required className={inputClass} />
                <input placeholder="Last Name" value={form.lastName} onChange={update("lastName")} required className={inputClass} />
                <input type="email" placeholder="Email Address" value={form.email} onChange={update("email")} required className={inputClass} />
                <input placeholder="Phone Number" value={form.phone} onChange={update("phone")} className={inputClass} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">We suggest using an email not associated with your domain name for notifications.</p>
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="text-primary font-semibold text-center mb-4 border-b border-border pb-2">Billing Address</h2>
              <div className="space-y-4">
                <input placeholder="Company Name (Optional)" value={form.company} onChange={update("company")} className={inputClass} />
                <input placeholder="Street Address" value={form.address} onChange={update("address")} required className={inputClass} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <input placeholder="City" value={form.city} onChange={update("city")} required className={inputClass} />
                  <input placeholder="State" value={form.state} onChange={update("state")} className={inputClass} />
                  <input placeholder="Postcode" value={form.postcode} onChange={update("postcode")} className={inputClass} />
                </div>
                <select value={form.country} onChange={update("country")} className={inputClass}>
                  <option>Kenya</option>
                  <option>South Africa</option>
                  <option>Nigeria</option>
                  <option>Tanzania</option>
                  <option>Uganda</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <h2 className="text-primary font-semibold text-center mb-4 border-b border-border pb-2">Account Security</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="password" placeholder="Password" value={form.password} onChange={update("password")} required minLength={8} className={inputClass} />
                <input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={update("confirmPassword")} required className={inputClass} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Register;
