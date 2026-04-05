import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHostingPlans } from "@/hooks/useHostingPlans";
import datacenter from "@/assets/datacenter.jpg";

const categories = ["Web Hosting", "Reseller Hosting", "Shared Hosting", "WordPress Hosting", "LiteSpeed Hosting", "Professional Email"];

const HostingPlans = () => {
  const [active, setActive] = useState("Web Hosting");
  const { plans, loading } = useHostingPlans(active);

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
            {loading ? (
              <div className="col-span-2 flex justify-center items-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : plans.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-muted-foreground">
                <p className="text-lg">Plans coming soon for {active}</p>
                <p className="text-sm mt-2">Contact us for custom pricing.</p>
              </div>
            ) : (
              plans.slice(0, 2).map((plan) => (
                <div
                  key={plan.id}
                  className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all group"
                >
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-extrabold text-primary">{plan.currency} {plan.price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">
                      {active === "Reseller Hosting" ? "/month" : active === "Shared Hosting" ? "/year" : "/month"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{plan.description}</p>
                  <a
                    href="/store"
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    See {active.toLowerCase()} plans →
                  </a>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HostingPlans;
