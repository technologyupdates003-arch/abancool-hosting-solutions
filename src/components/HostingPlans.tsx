import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import datacenter from "@/assets/datacenter.jpg";

const categories = ["Servers", "Hosting", "Domains", "Resellers", "Websites", "Security"];

type Plan = { title: string; price: string; unit: string; desc: string; cta: string };

const plansData: Record<string, Plan[]> = {
  Servers: [
    { title: "Dedicated Servers", price: "$149", unit: "/month", desc: "High-performance servers with root, IPMI and RMM access.", cta: "See server plans" },
    { title: "Linux Cloud Servers", price: "$9.99", unit: "/month", desc: "Robust KVM virtual machines with dedicated RAM, CPU, SSD and IO.", cta: "See cloud plans" },
    { title: "Windows Cloud Servers", price: "$39.99", unit: "/month", desc: "Scalable Windows servers for ASP.NET apps. Includes one RDP license.", cta: "See windows plans" },
  ],
  Hosting: [
    { title: "Web Hosting", price: "$3.99", unit: "/month", desc: "Get your business online with shared web hosting.", cta: "See hosting plans" },
    { title: "LiteSpeed Hosting", price: "$5.49", unit: "/month", desc: "Accelerated hosting with LS Cache and QUIC CDN.", cta: "See litespeed plans" },
    { title: "WordPress Hosting", price: "$5.49", unit: "/month", desc: "Speedy WP hosting with AI Site Builder and WordPress Manager.", cta: "See wordpress plans" },
  ],
  Domains: [
    { title: "Domain Registration", price: "$4.99", unit: "/year", desc: "Secure your domain today. Over 400 TLDs to choose from.", cta: "Register domains" },
    { title: "Domain Transfer", price: "$7.99", unit: "/year", desc: "Transfer your existing domain to us seamlessly.", cta: "Transfer now" },
    { title: "WHOIS Lookup", price: "Free", unit: "", desc: "Lookup any domain currently registered in the world.", cta: "Lookup domains" },
  ],
  Resellers: [
    { title: "VPS Reseller", price: "$19.99", unit: "setup", desc: "Start your own VPS and cloud hosting business today.", cta: "Find out more" },
    { title: "Hosting Reseller", price: "$11.49", unit: "/month", desc: "Become a hosting reseller and start earning a profit.", cta: "See reseller plans" },
    { title: "Domain Reseller", price: "$19.99", unit: "setup", desc: "Discounted domain prices and WHMCS integration.", cta: "See domain prices" },
  ],
  Websites: [
    { title: "AI Site Builder", price: "Free", unit: "", desc: "AI-powered website builder. Ideal for starting out.", cta: "Start building" },
    { title: "Online Store", price: "$9.99", unit: "/month", desc: "Launch your online store quickly with our e-commerce solutions.", cta: "See store plans" },
    { title: "Blog Builder", price: "Free", unit: "", desc: "Create a stunning blog effortlessly with our intuitive tools.", cta: "Start blogging" },
  ],
  Security: [
    { title: "SSL Certificates", price: "Free", unit: "", desc: "Secure your site with EV, DV and OV certificates.", cta: "See SSL prices" },
    { title: "DDoS Protection", price: "$4.99", unit: "/month", desc: "Enterprise-grade protection against DDoS attacks.", cta: "Learn more" },
    { title: "Backup Solutions", price: "$2.99", unit: "/month", desc: "Automated daily backups with one-click restore.", cta: "See backup plans" },
  ],
};

const HostingPlans = () => {
  const [active, setActive] = useState("Servers");

  return (
    <section id="hosting-plans" className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-4">
          Hosting solutions for any project
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
          We offer a wide range of hosting solutions to suit your needs and budget. Traffic is included in every package, so you'll never have any costly surprises.
        </p>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground border border-border hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Plans grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Feature image */}
            <div className="rounded-2xl overflow-hidden shadow-lg md:row-span-1">
              <img
                src={datacenter}
                alt="Abancool Technology data center"
                loading="lazy"
                width={1280}
                height={720}
                className="w-full h-full min-h-[200px] object-cover"
              />
            </div>

            {/* Plan cards */}
            {plansData[active]?.map((plan) => (
              <div
                key={plan.title}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <h3 className="text-lg font-bold text-foreground mb-1">{plan.title}</h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-extrabold text-primary">{plan.price}</span>
                  {plan.unit && <span className="text-sm text-muted-foreground">{plan.unit}</span>}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{plan.desc}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                >
                  {plan.cta} →
                </a>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HostingPlans;
