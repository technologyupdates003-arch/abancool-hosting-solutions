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

          <div className="bg-hero-foreground/10 backdrop-blur-sm rounded-xl p-4 max-w-lg">
            <textarea
              placeholder="Tell us about your business and let our site builder do its magic..."
              className="w-full bg-transparent text-hero-foreground/80 placeholder:text-hero-foreground/40 outline-none resize-none text-sm h-16"
            />
            <div className="flex justify-end">
              <button className="bg-accent text-accent-foreground px-8 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                Build
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-hero-foreground/50 text-sm">Need a spark? Try these</p>
            <div className="flex flex-wrap gap-2">
              {["Restaurant", "Consulting", "Design Studio", "Fitness Coach"].map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 rounded-full border border-hero-foreground/20 text-sm text-hero-foreground/70 hover:border-primary hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
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
