import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Lightbulb, Palette, Code2, TestTube, Rocket } from "lucide-react";

const steps = [
  { num: "01", title: "Idea", desc: "Understand the problem, research solutions, define scope and requirements.", icon: Lightbulb, color: "from-yellow-400 to-amber-500" },
  { num: "02", title: "Design", desc: "Wireframes, UI/UX planning, architecture decisions, and database schema design.", icon: Palette, color: "from-pink-400 to-rose-500" },
  { num: "03", title: "Develop", desc: "Clean code, modular architecture, iterative builds with best practices.", icon: Code2, color: "from-primary to-cyan-400" },
  { num: "04", title: "Test", desc: "Unit tests, integration tests, user acceptance testing, and bug fixes.", icon: TestTube, color: "from-green-400 to-emerald-500" },
  { num: "05", title: "Deploy", desc: "CI/CD pipelines, monitoring, performance optimization, and maintenance.", icon: Rocket, color: "from-accent to-purple-400" },
];

const WorkflowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section id="workflow" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">04. Workflow</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-16">
            How I build products<span className="text-primary">.</span>
          </h2>
        </motion.div>

        {/* Desktop: Horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Animated connector line */}
          <div className="absolute top-12 left-[10%] right-[10%] h-0.5 bg-secondary">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ width: "0%" }}
              animate={isInView ? { width: "100%" } : { width: "0%" }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-5 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.2 }}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                  className="flex flex-col items-center text-center cursor-default"
                >
                  {/* Circle node */}
                  <motion.div
                    animate={activeStep === i ? { scale: 1.2 } : { scale: 1 }}
                    className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} p-[2px] mb-6 relative`}
                  >
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <Icon
                        size={28}
                        className="text-foreground"
                      />
                    </div>
                    {/* Pulse ring on hover */}
                    {activeStep === i && (
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-30`}
                        initial={{ scale: 1 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}
                  </motion.div>

                  <p className="font-mono text-xs text-primary mb-1">{step.num}</p>
                  <h3 className="font-heading font-semibold mb-2">{step.title}</h3>
                  <motion.p
                    animate={{ opacity: activeStep === i ? 1 : 0.6 }}
                    className="text-xs text-muted-foreground leading-relaxed"
                  >
                    {step.desc}
                  </motion.p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-secondary">
            <motion.div
              className="w-full bg-gradient-to-b from-primary to-accent"
              initial={{ height: "0%" }}
              animate={isInView ? { height: "100%" } : { height: "0%" }}
              transition={{ duration: 2, delay: 0.3 }}
            />
          </div>

          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                  className="relative"
                >
                  {/* Node dot */}
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>

                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={18} className="text-primary" />
                      <h3 className="font-heading font-semibold">{step.title}</h3>
                      <span className="font-mono text-xs text-muted-foreground">{step.num}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
