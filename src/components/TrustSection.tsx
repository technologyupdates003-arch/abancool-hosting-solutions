import { Star, Check } from "lucide-react";
import happyCustomer from "@/assets/happy-customer.jpg";

const trustPoints = [
  "30-day money-back",
  "Fast & expert support",
  "Hassle-free migrations",
  "24/7 monitoring",
  "99.9% uptime guarantee",
  "After-hours support",
  "African hosted servers",
  "No contracts",
];

const TrustSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Rating */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-accent text-accent" />
            ))}
          </div>
          <span className="text-muted-foreground text-sm">
            Rated 4.9 out of 5 — based on 1,500+ reviews
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Get world-class hosting & support from Africa's most trusted provider
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Join our 20,000+ customers who enjoy fast hosting and outstanding support. Whether you're new to websites or a seasoned expert, our team is ready to help every step of the way.
            </p>
            <div className="flex gap-3">
              <a href="#hosting-plans" className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity">
                See hosting plans
              </a>
              <a href="#" className="border border-border px-6 py-3 rounded-full font-semibold text-sm text-foreground hover:bg-muted transition-colors">
                Speak to an expert
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={happyCustomer}
                alt="Happy Abancool Technology customer"
                loading="lazy"
                width={640}
                height={800}
                className="w-full h-80 md:h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
