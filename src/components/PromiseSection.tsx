import { Phone, Award, Clock, Globe, Box, Banknote } from "lucide-react";
import { motion } from "framer-motion";

const promises = [
  { icon: Phone, title: "World-class support", desc: "Our support team is always ready to help you with any hosting queries." },
  { icon: Award, title: "Your trusted partner", desc: "Over 15 years of experience in international hosting and development." },
  { icon: Clock, title: "99.9% uptime guarantee", desc: "Cloud servers that are fast and highly secure with 24/7 monitoring." },
  { icon: Globe, title: "Quality hosting", desc: "Tier 3 data centers providing first-class hosting wherever you are." },
  { icon: Box, title: "Hassle-free migrations", desc: "Migrating to us is quick and easy. We offer free migrations." },
  { icon: Banknote, title: "Money-back guarantee", desc: "30-day money-back guarantee if our services aren't the perfect fit." },
];

const PromiseSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-4">
          The AbanCool <span className="text-primary">Promise</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          With us, you can expect real service from real people all the time. Think of us as your partner in hosting.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promises.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromiseSection;
