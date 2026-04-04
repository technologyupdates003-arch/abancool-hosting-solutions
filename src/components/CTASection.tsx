import { Check } from "lucide-react";

const ctaPoints = [
  "30-day money-back",
  "Fast & expert support",
  "Hassle-free migrations",
  "24/7 monitoring",
  "99.9% uptime guarantee",
  "Cancel anytime",
];

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 bg-hero text-hero-foreground">
      <div className="container text-center space-y-8">
        <h2 className="text-2xl md:text-4xl font-bold">
          Get your business online today!
        </h2>
        <p className="text-hero-foreground/70 max-w-xl mx-auto">
          Join thousands of happy clients hosting with AbanCool Technology.
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {ctaPoints.map((point) => (
            <div key={point} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm text-hero-foreground/80">{point}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <a href="#hosting-plans" className="bg-accent text-accent-foreground px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
            View hosting services
          </a>
          <a href="#" className="border border-hero-foreground/30 text-hero-foreground px-8 py-3 rounded-full font-semibold text-sm hover:bg-hero-foreground/10 transition-colors">
            Speak to an expert
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
