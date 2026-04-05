import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { domainService, DomainTLD, Currency } from "@/services/domainService";
import { useDomainSearch } from "@/hooks/useDomainSearch";

const DomainSearchBar = () => {
  const [domain, setDomain] = useState("");
  const [tlds, setTlds] = useState<DomainTLD[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const navigate = useNavigate();
  const { loading, checkSingleDomain } = useDomainSearch();

  useEffect(() => {
    // Load TLD pricing from service
    const loadTLDs = async () => {
      try {
        const tldData = await domainService.getTLDs();
        setTlds(tldData);
      } catch (error) {
        console.error('Failed to load TLDs:', error);
        // Set empty array to prevent errors
        setTlds([]);
      }
    };
    loadTLDs();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    const formattedDomain = domainService.formatDomainName(domain);
    
    // For single domain check, navigate to store with domain parameter
    navigate(`/store?domain=${encodeURIComponent(formattedDomain)}`);
  };

  const handleTLDClick = (tld: string) => {
    if (domain) {
      const domainWithoutTLD = domain.replace(/\.[^.]*$/, '');
      setDomain(domainWithoutTLD + tld);
    }
  };

  return (
    <section className="bg-domain-bar border-b border-border">
      <div className="container py-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-card rounded-full border border-border shadow-sm overflow-hidden max-w-3xl mx-auto">
          <span className="pl-5 text-sm font-semibold text-muted-foreground whitespace-nowrap">
            find your domain
          </span>
          <span className="text-muted-foreground/50 font-medium text-sm">www.</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="mydomain"
            className="flex-1 bg-transparent outline-none text-sm py-3 text-foreground placeholder:text-muted-foreground/50"
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !domain.trim()}
            className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity rounded-full m-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
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

        <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4 overflow-x-auto">
          {tlds.slice(0, 5).map((tld) => {
            const price = domainService.getPriceForCurrency(tld, selectedCurrency);
            const formattedPrice = domainService.formatPrice(price, selectedCurrency);
            return (
              <button 
                key={tld.tld} 
                onClick={() => handleTLDClick(tld.tld)}
                className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors group cursor-pointer"
              >
                <span className="font-bold text-foreground group-hover:text-primary">{tld.tld}</span>
                <span className="text-muted-foreground">{formattedPrice}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DomainSearchBar;