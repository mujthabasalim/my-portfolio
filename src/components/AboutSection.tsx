import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">01. About Me</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-12">
            Building the web,<br />
            <span className="text-muted-foreground">one product at a time.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-5"
          >
            <p className="text-muted-foreground leading-relaxed">
              I'm a passionate MERN Stack developer who thrives on solving complex problems 
              and transforming ideas into real-world digital products. With a strong foundation 
              in <span className="text-foreground font-medium">MongoDB, Express.js, React, and Node.js</span>, 
              I build full-stack applications that are both performant and scalable.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My approach combines clean architecture with modern design principles. I believe 
              great software isn't just about writing code—it's about crafting experiences that 
              users love and businesses depend on.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From REST APIs to responsive front-ends, I handle the entire development lifecycle 
              with a focus on quality, performance, and maintainability.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="glass-card p-6 neon-border space-y-4"
          >
            <h3 className="font-heading font-semibold text-lg">Quick Facts</h3>
            {[
              { label: "Focus", value: "Full-Stack Web Development" },
              { label: "Stack", value: "MongoDB · Express · React · Node" },
              { label: "Passion", value: "Building scalable products" },
              { label: "Approach", value: "Clean code, modern patterns" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-border pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-sm font-medium text-foreground">{item.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
