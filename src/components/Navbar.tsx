import { useState } from "react";
import { ChevronDown, User, ShoppingCart, HelpCircle, Menu, X } from "lucide-react";

const navItems = [
  { label: "Websites", href: "#" },
  { label: "Domains", href: "#" },
  { label: "Email", href: "#" },
  { label: "Hosting", href: "#" },
  { label: "Servers", href: "#" },
  { label: "Resellers", href: "#" },
  { label: "Resources", href: "#" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-nav text-nav-foreground">
        <div className="container flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              AC
            </div>
            <span className="text-lg font-bold tracking-tight text-nav-foreground">
              Aban<span className="text-primary">Cool</span>
            </span>
          </a>

          <div className="hidden md:flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 text-sm text-nav-foreground/70 hover:text-nav-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </a>
            <a href="#" className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <User className="w-4 h-4" />
              Login
            </a>
            <a href="#" className="text-nav-foreground/70 hover:text-nav-foreground transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </a>
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
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-nav-foreground/80 hover:text-primary transition-colors rounded-md hover:bg-nav-foreground/5"
            >
              {item.label}
              <ChevronDown className="w-3.5 h-3.5 opacity-50" />
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-nav border-t border-nav-foreground/10 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-4 py-3 text-sm font-medium text-nav-foreground/80 hover:text-primary rounded-md hover:bg-nav-foreground/5"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 border-t border-nav-foreground/10 flex flex-col gap-2">
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm text-nav-foreground/70">
              <HelpCircle className="w-4 h-4" /> Help Center
            </a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground">
              <User className="w-4 h-4" /> Login
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
