import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useHostingPlans } from "@/hooks/useHostingPlans";
import { useDomainSearch } from "@/hooks/useDomainSearch";
import { useCart } from "@/contexts/CartContext";
import { domainService } from "@/services/domainService";
import { BillingCycleSelector } from "@/components/BillingCycleSelector";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  "Web Hosting",
  "WordPress Hosting",
  "LiteSpeed Hosting",
  "Reseller Hosting",
  "Shared Hosting",
  "Domains",
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

// Map display categories to database categories
const categoryMapping: Record<string, string> = {
  "Web Hosting": "Web Hosting",
  "WordPress Hosting": "WordPress Hosting",
  "LiteSpeed Hosting": "LiteSpeed Hosting",
  "Reseller Hosting": "Reseller Hosting",
  "Shared Hosting": "Shared Hosting",
  "Professional Email": "Professional Email",
  "Cloud Servers Linux": "Cloud Servers Linux",
  "Cloud Servers Windows": "Cloud Servers Windows",
  "Virtual Dedicated Servers": "Virtual Dedicated Servers",
  "VPS Reseller Accounts": "VPS Reseller Accounts",
  "Domain Reseller": "Domain Reseller",
  "Online Backup": "Online Backup",
  "SSL Certificates": "SSL Certificates",
};

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
  const [selectedPlan, setSelectedPlan] = useState<Tables<'hosting_plans'> | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'KES' | 'ZAR'>('USD');
  const [tlds, setTlds] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const { plans, loading } = useHostingPlans(categoryMapping[activeCategory] || activeCategory);
  const { results: domainResults, loading: domainLoading, searchDomain } = useDomainSearch();
  const { addItem } = useCart();
  const { toast } = useToast();

  const addDomainToCart = (domain: any) => {
    const price = domainService.getPriceForCurrency(domain, selectedCurrency);
    
    addItem({
      type: 'domain',
      name: `Domain Registration - ${domain.domain}`,
      price: price,
      currency: selectedCurrency === 'USD' ? '$' : selectedCurrency === 'KES' ? 'KSh' : 'R',
      billingCycle: 'annually',
      domain: domain.domain,
      features: ['1 Year Registration', 'Free DNS Management', 'Domain Privacy Available'],
      category: 'Domains'
    });

    toast({
      title: "Domain Added to Cart",
      description: `${domain.domain} has been added to your cart.`,
    });
  };

  // Load TLDs on component mount
  useEffect(() => {
    const loadTLDs = async () => {
      try {
        const tldData = await domainService.getTLDs();
        setTlds(tldData);
      } catch (error) {
        console.error('Failed to load TLDs:', error);
      }
    };
    loadTLDs();
  }, []);

  // Handle category and domain search from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const domainParam = searchParams.get('domain');
    
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
    
    if (domainParam) {
      setActiveCategory("Domains");
      searchDomain(domainParam);
    }
  }, [searchParams, searchDomain]);

  const isDomainCategory = activeCategory === "Domains" || searchParams.get('domain');

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
                <Link to="/store?category=Domains" className="px-4 py-3 text-sm text-primary hover:bg-muted">Register a New Domain</Link>
                <Link to="/store?category=Domains" className="px-4 py-3 text-sm text-primary hover:bg-muted">Transfer in a Domain</Link>
                <Link to="#" className="px-4 py-3 text-sm text-primary hover:bg-muted">View Cart</Link>
              </nav>
            </div>

            {/* Currency */}
            <div className="border border-border rounded-lg overflow-hidden mt-4">
              <div className="bg-muted px-4 py-3 font-semibold text-foreground">+ Choose Currency</div>
              <div className="p-4">
                <select 
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value as 'USD' | 'KES' | 'ZAR')}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-background"
                >
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="ZAR">ZAR (R)</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <h1 className="text-3xl font-bold text-foreground mb-6">{activeCategory}</h1>

            {isDomainCategory ? (
              // Domain search results
              <div className="space-y-6">
                {/* Domain Search Bar */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-lg font-semibold mb-4">Search for Available Domains</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const searchTerm = formData.get('domain') as string;
                    if (searchTerm?.trim()) {
                      searchDomain(searchTerm.trim());
                      // Update URL without navigation
                      const newUrl = new URL(window.location.href);
                      newUrl.searchParams.set('domain', searchTerm.trim());
                      window.history.pushState({}, '', newUrl.toString());
                    }
                  }} className="flex items-center gap-2 bg-background rounded-full border border-border shadow-sm overflow-hidden">
                    <span className="pl-5 text-sm font-semibold text-muted-foreground whitespace-nowrap">
                      find your domain
                    </span>
                    <span className="text-muted-foreground/50 font-medium text-sm">www.</span>
                    <input
                      type="text"
                      name="domain"
                      defaultValue={searchParams.get('domain') || ''}
                      placeholder="mydomain"
                      className="flex-1 bg-transparent outline-none text-sm py-3 text-foreground placeholder:text-muted-foreground/50"
                      disabled={domainLoading}
                    />
                    <button 
                      type="submit"
                      disabled={domainLoading}
                      className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity rounded-full m-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {domainLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="hidden sm:inline">searching...</span>
                        </div>
                      ) : (
                        <>
                          <span className="hidden sm:inline">check availability</span>
                          <Search className="w-4 h-4 sm:hidden" />
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* TLD Pricing */}
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4 overflow-x-auto">
                    {tlds.slice(0, 5).map((tld) => {
                      const price = domainService.getPriceForCurrency(tld, selectedCurrency);
                      const formattedPrice = domainService.formatPrice(price, selectedCurrency);
                      return (
                        <button 
                          key={tld.tld}
                          onClick={() => {
                            const input = document.querySelector('input[name="domain"]') as HTMLInputElement;
                            if (input && input.value) {
                              const domainWithoutTLD = input.value.replace(/\.[^.]*$/, '');
                              input.value = domainWithoutTLD + tld.tld;
                            }
                          }}
                          className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors group cursor-pointer"
                        >
                          <span className="font-bold text-foreground group-hover:text-primary">{tld.tld}</span>
                          <span className="text-muted-foreground">{formattedPrice}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!searchParams.get('domain') && !domainResults.length && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          🔍
                        </span>
                        Register New Domain
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Find and register your perfect domain name. Search from hundreds of available extensions.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Instant domain search</li>
                        <li>• 100+ domain extensions</li>
                        <li>• Competitive pricing</li>
                        <li>• Free DNS management</li>
                      </ul>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <span className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                          🔄
                        </span>
                        Transfer Domain
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Transfer your existing domain to us for better management and competitive pricing.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                        <li>• Easy transfer process</li>
                        <li>• No downtime</li>
                        <li>• Free with hosting</li>
                        <li>• Expert support</li>
                      </ul>
                      <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90">
                        Start Transfer
                      </button>
                    </div>
                  </div>
                )}
                
                {searchParams.get('domain') && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-2">Domain Search Results for "{searchParams.get('domain')}"</h2>
                    <p className="text-sm text-muted-foreground">
                      {domainResults.length > 0 ? `Found ${domainResults.length} results` : 'Searching for available domains...'}
                    </p>
                  </div>
                )}
                
                {domainLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                      <p className="text-sm text-muted-foreground">Searching available domains...</p>
                    </div>
                  </div>
                ) : domainResults.length > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                      <div className="bg-muted px-4 py-3 border-b border-border">
                        <h3 className="font-semibold text-foreground">Available Domains</h3>
                      </div>
                      <div className="divide-y divide-border">
                        {domainResults.filter(result => result.available).map((result) => {
                          const getPrice = () => {
                            switch (selectedCurrency) {
                              case 'USD': return result.price_usd;
                              case 'KES': return result.price_kes;
                              case 'ZAR': return result.price_zar;
                              default: return result.price_usd;
                            }
                          };
                          const price = getPrice();
                          const formattedPrice = price ? domainService.formatPrice(price, selectedCurrency) : 'N/A';
                          
                          return (
                            <div key={result.domain} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{result.domain}</h4>
                                  <p className="text-sm text-green-600">Available for registration</p>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-4">
                                {price && (
                                  <div>
                                    <div className="text-lg font-bold text-foreground">
                                      {formattedPrice}
                                    </div>
                                    <div className="text-xs text-muted-foreground">per year</div>
                                  </div>
                                )}
                                <button 
                                  onClick={() => addDomainToCart(result)}
                                  className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {domainResults.some(result => !result.available) && (
                      <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <div className="bg-muted px-4 py-3 border-b border-border">
                          <h3 className="font-semibold text-foreground">Unavailable Domains</h3>
                        </div>
                        <div className="divide-y divide-border">
                          {domainResults.filter(result => !result.available).map((result) => (
                            <div key={result.domain} className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <div>
                                  <h4 className="font-semibold text-foreground">{result.domain}</h4>
                                  <p className="text-sm text-red-600">Not available</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-sm text-muted-foreground">Unavailable</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : searchParams.get('domain') ? (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <div className="text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8" />
                      </div>
                      <p className="text-lg font-medium mb-2">No results found</p>
                      <p className="text-sm">Try searching for a different domain name or check the spelling.</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : plans.length === 0 ? (
              <div className="border border-border rounded-lg p-12 text-center text-muted-foreground">
                <p className="text-lg">Plans coming soon for {activeCategory}</p>
                <p className="text-sm mt-2">Contact us for custom pricing.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground">{plan.currency} {plan.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {plan.category === "Reseller Hosting" ? "Monthly" : 
                           plan.category === "Shared Hosting" ? "Yearly" : "Monthly"}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(82,60%,40%)] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity mb-4"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Order Now
                    </button>

                    <div>
                      <p className="font-semibold text-sm text-foreground mb-2">Features Included</p>
                      <ul className="space-y-1">
                        {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                          <li key={index} className="text-sm text-muted-foreground">{feature}</li>
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

      {selectedPlan && (
        <BillingCycleSelector 
          plan={selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
        />
      )}

      <Footer />
    </div>
  );
};

export default Store;
