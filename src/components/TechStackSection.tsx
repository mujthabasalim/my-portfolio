import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";

const techStack = [
  { name: "MongoDB", icon: "🍃", category: "Database", desc: "NoSQL database for flexible data modeling" },
  { name: "Express", icon: "⚡", category: "Backend", desc: "Fast, minimalist web framework for Node.js" },
  { name: "React", icon: "⚛️", category: "Frontend", desc: "Component-based UI library for interactive apps" },
  { name: "Node.js", icon: "🟢", category: "Runtime", desc: "Server-side JavaScript runtime" },
  { name: "JavaScript", icon: "📜", category: "Language", desc: "The language of the web" },
  { name: "Next.js", icon: "▲", category: "Framework", desc: "React framework for production" },
  { name: "React Native", icon: "📱", category: "Mobile", desc: "Cross-platform mobile development" },
  { name: "REST APIs", icon: "🔗", category: "Architecture", desc: "Designing scalable API architectures" },
  { name: "Git", icon: "🔀", category: "DevOps", desc: "Version control & collaboration" },
  { name: "Tailwind CSS", icon: "🎨", category: "Styling", desc: "Utility-first CSS framework" },
];

const TechCard = ({ tech, i, isInView, isFlipped, onFlip }: {
  tech: typeof techStack[0];
  i: number;
  isInView: boolean;
  isFlipped: boolean;
  onFlip: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      key={tech.name}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: i * 0.05 }}
      className="relative aspect-square cursor-pointer group"
      style={{ perspective: "600px" }}
      onClick={onFlip}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 glass-card flex flex-col items-center justify-center gap-3 p-4 group-hover:border-primary/40 transition-colors duration-300 overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Cursor-following spotlight */}
          {isHovered && (
            <div
              className="absolute pointer-events-none rounded-full transition-opacity duration-300"
              style={{
                width: 150,
                height: 150,
                left: mousePos.x - 75,
                top: mousePos.y - 75,
                background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
              }}
            />
          )}

          <motion.span
            className="relative z-10 text-4xl inline-block group-hover:scale-125 group-hover:rotate-12 transition-all duration-400 ease-out"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5 + (i % 3) * 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            {tech.icon}
          </motion.span>
          <span className="relative z-10 font-medium text-sm text-foreground text-center leading-tight">
            {tech.name}
          </span>
          <span className="relative z-10 font-mono text-[10px] text-primary/70 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {tech.category}
          </span>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 glass-card flex flex-col items-center justify-center p-4 bg-primary/10 border-primary/30"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-2xl mb-2">{tech.icon}</span>
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            {tech.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const TechStackSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section id="tech" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">02. Tech Stack</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-16">
            Tools I work with<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {techStack.map((tech, i) => (
            <TechCard
              key={tech.name}
              tech={tech}
              i={i}
              isInView={isInView}
              isFlipped={flipped === i}
              onFlip={() => setFlipped(flipped === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
