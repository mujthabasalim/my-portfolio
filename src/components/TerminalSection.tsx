import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const commands: Record<string, string> = {
  help: "Available commands: about, skills, contact, projects, clear",
  about:
    "Full-stack MERN developer passionate about building scalable web apps. Currently open to exciting opportunities.",
  skills:
    "MongoDB · Express.js · React · Node.js · Next.js · TypeScript · REST APIs · Git · Tailwind CSS · React Native",
  contact:
    "Email: mujthabasalim98@gmail.com | GitHub: github.com/mujthabasalim | LinkedIn: linkedin.com/in/mujthabasalim",
  projects:
    "Run 'View Projects' above or scroll to the projects section to see my work ↑",
};

const TerminalSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [history, setHistory] = useState<{ cmd: string; output: string }[]>([]);
  const [input, setInput] = useState("");
  const [booted, setBooted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInView && !booted) {
      const timer = setTimeout(() => {
        setHistory([
          { cmd: "", output: "> Welcome to mujthaba.dev terminal v1.0.0" },
          { cmd: "", output: '> Type "help" to see available commands.' },
        ]);
        setBooted(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isInView, booted]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    const output =
      commands[trimmed] ||
      `Command not found: "${trimmed}". Type "help" for available commands.`;
    setHistory((h) => [...h, { cmd: input, output }]);
    setInput("");
  };

  return (
    <section className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">Interactive</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
            Try my terminal<span className="text-primary">.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass-card neon-border overflow-hidden"
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
            <div className="w-3 h-3 rounded-full bg-destructive/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">
              mujthaba@dev ~ %
            </span>
          </div>

          {/* Terminal body */}
          <div
            ref={termRef}
            className="p-4 font-mono text-sm h-72 overflow-y-auto space-y-2 scrollbar-thin"
          >
            {history.map((entry, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {entry.cmd && (
                  <div className="flex gap-2">
                    <span className="text-primary">❯</span>
                    <span className="text-foreground">{entry.cmd}</span>
                  </div>
                )}
                <div className="text-muted-foreground pl-4">{entry.output}</div>
              </motion.div>
            ))}

            {/* Input line */}
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <span className="text-primary">❯</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                autoComplete="off"
                spellCheck={false}
                placeholder={booted ? "Type a command..." : ""}
              />
            </form>
          </div>
        </motion.div>

        <p className="text-xs text-muted-foreground mt-3 text-center font-mono">
          Try:{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => {
              setInput("about");
              inputRef.current?.focus();
            }}
          >
            about
          </span>{" "}
          ·{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => {
              setInput("skills");
              inputRef.current?.focus();
            }}
          >
            skills
          </span>{" "}
          ·{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => {
              setInput("contact");
              inputRef.current?.focus();
            }}
          >
            contact
          </span>
        </p>
      </div>
    </section>
  );
};

export default TerminalSection;
