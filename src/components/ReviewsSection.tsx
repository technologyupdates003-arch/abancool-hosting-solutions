import { Star } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  { name: "James K.", text: "Excellent service! Very helpful and patient team who explained everything clearly. Well done AbanCool!", rating: 5 },
  { name: "Faith M.", text: "A business that truly cares about customer experience. Quick to resolve issues and I can see myself doing more business with them.", rating: 5 },
  { name: "David O.", text: "Awesome service! Should be 10 stars. It's not often I get such amazing service from a hosting company.", rating: 5 },
];

const ReviewsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-4">
          Client Reviews
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Our clients have rated our hosting support and services 5 stars!
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{review.text}"</p>
              <p className="text-sm font-semibold text-muted-foreground">— {review.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
