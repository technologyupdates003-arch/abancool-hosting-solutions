import { motion } from "framer-motion";
import heroRocket from "@/assets/hero-rocket.png";

const HeroSection = () => {
  return (
    <section className="bg-hero text-hero-foreground relative overflow-hidden">
      <div className="container py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Launch your <span className="text-primary">website faster</span> than the competition
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-lg">
            Get world-class hosting and support from Africa's most trusted technology provider. Fast, reliable, and always here for you.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/store"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity inline-block"
            >
              View Hosting Plans
            </a>
            <a
              href="/store"
              className="border border-hero-foreground/30 text-hero-foreground px-8 py-3 rounded-full font-semibold text-sm hover:border-primary hover:text-primary transition-colors inline-block"
            >
              Get Started
            </a>
          </div>

          <div className="flex flex-wrap gap-6 pt-4">
            {[
              { label: "99.9% Uptime", icon: "⚡" },
              { label: "24/7 Support", icon: "🛡️" },
              { label: "Free SSL", icon: "🔒" },
              { label: "KSh Pricing", icon: "💰" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-hero-foreground/70">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-shrink-0"
        >
          <img
            src={heroRocket}
            alt="Woman on rocket - launch your website"
            width={400}
            height={400}
            className="w-64 md:w-96 drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
