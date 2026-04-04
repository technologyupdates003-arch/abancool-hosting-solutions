import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  "Web Hosting",
  "WordPress Hosting",
  "LiteSpeed Hosting",
  "Reseller Hosting",
  "Site Builder",
  "Professional Email",
  "Cloud Servers Linux",
  "Cloud Servers Windows",
  "Virtual Dedicated Servers",
  "VPS Reseller Accounts",
  "Domain Reseller",
  "Online Backup",
  "SSL Certificates",
  "Support",
];

interface Plan {
  name: string;
  description: string;
  price: string;
  features: string[];
}

const plansByCategory: Record<string, Plan[]> = {
  "Web Hosting": [
    {
      name: "Web_Starter",
      description:
        "With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.",
      price: "420.00",
      features: [
        "Free .co.za ; .co.ke or .com.ng Domain",
        "20 GB SSD Storage",
        "2 Websites",
        "25 Email Accounts",
        "5 Subdomains",
        "5 MySQL Databases",
        "1 FTP Account",
        "Unlimited Bandwidth",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
      ],
    },
    {
      name: "Web_Basic",
      description:
        "With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.",
      price: "630.00",
      features: [
        "Free .co.za ; .co.ke or .com.ng Domain",
        "40 GB SSD Storage",
        "5 Websites",
        "100 Email Accounts",
        "100 Subdomains",
        "50 MySQL Databases",
        "1 FTP Account",
        "Unlimited Bandwidth",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
      ],
    },
    {
      name: "Web_Power",
      description:
        "With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.",
      price: "945.00",
      features: [
        "Free .co.za ; .co.ke or .com.ng Domain",
        "100 GB SSD Storage",
        "10 Websites",
        "Unlimited Email Accounts",
        "500 Subdomains",
        "Unlimited MySQL Databases",
        "5 FTP Accounts",
        "Unlimited Bandwidth",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
      ],
    },
    {
      name: "Web_Business",
      description:
        "With our user-friendly control panel, managing your websites, emails, and databases becomes effortless. Enjoy reliable hosting, seamless scalability, and top-notch support.",
      price: "1,399.00",
      features: [
        "Free .co.za ; .co.ke or .com.ng Domain",
        "200 GB SSD Storage",
        "20 Websites",
        "Unlimited Email Accounts",
        "1000 Subdomains",
        "Unlimited MySQL Databases",
        "10 FTP Accounts",
        "Unlimited Bandwidth",
        "Free Let's Encrypt SSL",
        "Free Daily Backups",
      ],
    },
  ],
  "WordPress Hosting": [
    {
      name: "WP_Starter",
      description: "Optimized WordPress hosting with pre-installed WordPress, automatic updates, and enhanced security.",
      price: "520.00",
      features: ["1 WordPress Site", "20 GB SSD", "Free SSL", "Daily Backups", "Managed Updates"],
    },
    {
      name: "WP_Business",
      description: "High-performance WordPress hosting with staging, CDN, and priority support.",
      price: "1,200.00",
      features: ["5 WordPress Sites", "100 GB SSD", "Free SSL", "Staging Environment", "CDN Included", "Priority Support"],
    },
  ],
};

const Store = () => {
  const [activeCategory, setActiveCategory] = useState("Web Hosting");
  const plans = plansByCategory[activeCategory] || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Auth bar */}
      <div className="bg-muted border-b border-border">
        <div className="container py-4 flex flex-wrap gap-8 items-center justify-center">
          <Link to="/login" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <span className="text-lg font-semibold">Login</span>
            <span className="text-sm text-muted-foreground">Log in to your Abancool account</span>
          </Link>
          <Link to="/register" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <span className="text-lg font-semibold">Register</span>
            <span className="text-sm text-muted-foreground">Don't have an account? Create one</span>
          </Link>
          <Link to="/login" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <span className="text-lg font-semibold">Forgot Password?</span>
            <span className="text-sm text-muted-foreground">Recover your account password</span>
          </Link>
        </div>
      </div>

      <div className="container py-8 flex-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-3 font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Categories
              </div>
              <nav className="flex flex-col">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-3 text-sm border-l-4 transition-colors ${
                      activeCategory === cat
                        ? "border-l-primary bg-primary text-primary-foreground font-semibold"
                        : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>

            {/* Actions */}
            <div className="border border-border rounded-lg overflow-hidden mt-4">
              <div className="bg-muted px-4 py-3 font-semibold text-foreground">+ Actions</div>
              <nav className="flex flex-col">
                <Link to="#" className="px-4 py-3 text-sm text-primary hover:bg-muted">Register a New Domain</Link>
                <Link to="#" className="px-4 py-3 text-sm text-primary hover:bg-muted">Transfer in a Domain</Link>
                <Link to="#" className="px-4 py-3 text-sm text-primary hover:bg-muted">View Cart</Link>
              </nav>
            </div>

            {/* Currency */}
            <div className="border border-border rounded-lg overflow-hidden mt-4">
              <div className="bg-muted px-4 py-3 font-semibold text-foreground">+ Choose Currency</div>
              <div className="p-4">
                <select className="w-full border border-border rounded px-3 py-2 text-sm bg-background">
                  <option>KES</option>
                  <option>USD</option>
                  <option>ZAR</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-6">{activeCategory}</h1>

            {plans.length === 0 ? (
              <div className="border border-border rounded-lg p-12 text-center text-muted-foreground">
                <p className="text-lg">Plans coming soon for {activeCategory}</p>
                <p className="text-sm mt-2">Contact us for custom pricing.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan.name} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">KSh {plan.price}</div>
                        <div className="text-sm text-muted-foreground">Monthly</div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(82,60%,40%)] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity mb-4">
                      <ShoppingCart className="w-4 h-4" />
                      Order Now
                    </button>

                    <div>
                      <p className="font-semibold text-sm text-foreground mb-2">Features Included</p>
                      <ul className="space-y-1">
                        {plan.features.map((f) => (
                          <li key={f} className="text-sm text-muted-foreground">{f}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Store;
