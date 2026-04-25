import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Engineering Manager, TechCorp",
    text: "An exceptional developer who consistently delivers clean, scalable code. Their understanding of the full stack made our project launch seamless and ahead of schedule.",
    avatar: "SC",
  },
  {
    name: "James Rodriguez",
    role: "CTO, StartupFlow",
    text: "Working with them transformed our platform. They brought both technical excellence and creative problem-solving that elevated our entire product experience.",
    avatar: "JR",
  },
  {
    name: "Priya Patel",
    role: "Product Lead, DesignLab",
    text: "Rare combination of deep technical skills and design sensibility. They don't just build features—they craft experiences that users genuinely love.",
    avatar: "PP",
  },
  {
    name: "Alex Kim",
    role: "Founder, DevScale",
    text: "Delivered a complex real-time dashboard that exceeded all expectations. Their attention to performance optimization saved us significant infrastructure costs.",
    avatar: "AK",
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">05. Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-16">
            What people<br />
            <span className="text-muted-foreground">say about me.</span>
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 * i }}
              className={`glass-card p-6 hover-lift cursor-pointer relative overflow-hidden ${
                activeIndex === i ? "neon-border" : ""
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {/* Accent glow for active card */}
              {activeIndex === i && (
                <motion.div
                  layoutId="testimonialGlow"
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl"
                  transition={{ type: "spring", stiffness: 200, damping: 30 }}
                />
              )}

              <Quote className="w-8 h-8 text-primary/30 mb-4" />

              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-heading font-semibold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
