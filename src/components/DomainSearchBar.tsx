import { Search } from "lucide-react";
import { useState } from "react";

const domainTLDs = [
  { tld: ".com", price: "$9.99" },
  { tld: ".co.ke", price: "$4.99" },
  { tld: ".africa", price: "$11.99" },
  { tld: ".online", price: "$2.99" },
  { tld: ".ke", price: "$29.99" },
];

const DomainSearchBar = () => {
  const [domain, setDomain] = useState("");

  return (
    <section className="bg-domain-bar border-b border-border">
      <div className="container py-4">
        <div className="flex items-center gap-2 bg-card rounded-full border border-border shadow-sm overflow-hidden max-w-3xl mx-auto">
          <span className="pl-5 text-sm font-semibold text-muted-foreground whitespace-nowrap">
            find your domain
          </span>
          <span className="text-muted-foreground/50 font-medium text-sm">www.</span>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="mydomain.com"
            className="flex-1 bg-transparent outline-none text-sm py-3 text-foreground placeholder:text-muted-foreground/50"
          />
          <button className="bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity rounded-full m-1">
            <span className="hidden sm:inline">check availability</span>
            <Search className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4 overflow-x-auto">
          {domainTLDs.map((d) => (
            <a key={d.tld} href="#" className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-primary transition-colors group">
              <span className="font-bold text-foreground group-hover:text-primary">{d.tld}</span>
              <span className="text-muted-foreground">{d.price}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainSearchBar;
