import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, HelpCircle, Menu, X, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CartIcon } from "@/components/Cart";
import { useAdminRole } from "@/hooks/useAdminRole";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Hosting", href: "/store?category=Web Hosting", dropdown: true },
  { label: "Servers", href: "/store?category=Cloud Servers Linux", dropdown: true },
  { label: "Email", href: "/store?category=Professional Email", dropdown: true },
  { label: "Domains", href: "/store?category=Domains", dropdown: true },
  { label: "Resellers", href: "/reseller", dropdown: true },
  { label: "Add-Ons", href: "/store?category=SSL Certificates" },
  { label: "Resources", href: "/news", dropdown: true },
  { label: "Billing & Support", href: "/support", dropdown: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-nav text-nav-foreground">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              AC
            </div>
            <span className="text-lg font-bold tracking-tight text-nav-foreground">
              Aban<span className="text-primary">Cool</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/support" className="flex items-center gap-1 text-sm text-nav-foreground/70 hover:text-nav-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </Link>
            {user ? (
              <Link to="/client-area" className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
                Hi, {user.user_metadata?.first_name || user.email?.split("@")[0]}!
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <User className="w-4 h-4" />
                Login
              </Link>
            )}
            <CartIcon />
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-nav-foreground">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation bar */}
      <nav className="bg-nav/95 border-t border-nav-foreground/10">
        <div className="container hidden md:flex items-center gap-1 h-12">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nav-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-nav-foreground/5"
            >
              {item.label}
              {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-50" />}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-nav border-t border-nav-foreground/10 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-sm font-medium text-nav-foreground/80 hover:text-primary rounded-md hover:bg-nav-foreground/5"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-nav-foreground/10 flex flex-col gap-2">
            <Link to="/support" className="flex items-center gap-2 px-4 py-2 text-sm text-nav-foreground/70">
              <HelpCircle className="w-4 h-4" /> Help Center
            </Link>
            {user ? (
              <Link to="/client-area" className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground">
                <User className="w-4 h-4" /> Client Area
              </Link>
            ) : (
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground">
                <User className="w-4 h-4" /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
