import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useGitHubProjects } from "@/hooks/useGitHubProjects";

const GitHubSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { allProjects, totalContributions, contributionWeeks } =
    useGitHubProjects();

  const repoCount = useMemo(() => {
    return allProjects.filter((p) => !p.isManual).length;
  }, [allProjects]);

  const langCount = useMemo(() => {
    const langs = new Set(
      allProjects
        .filter((p) => !p.isManual)
        .map((p) => p.language)
        .filter(Boolean),
    );
    return langs.size;
  }, [allProjects]);

  const stats = [
    { label: "Repositories", value: `${repoCount}+`, icon: "📁" },
    {
      label: "Contributions",
      value: totalContributions > 0 ? `${totalContributions}` : "500+",
      icon: "🔥",
    },
    { label: "Languages", value: `${langCount}+`, icon: "💻" },
    { label: "Open Source", value: "Active", icon: "🌐" },
  ];

  const weeks = 20;
  const days = 7;

  // Real contribution grid derived from actual data
  const grid = useMemo(() => {
    if (!contributionWeeks || contributionWeeks.length === 0) {
      // Fallback to random if data isn't loaded yet
      return Array.from({ length: weeks }, () =>
        Array.from({ length: days }, () => Math.random()),
      );
    }

    // Take the last 'weeks' number of weeks from the data
    const relevantWeeks = contributionWeeks.slice(-weeks);

    return relevantWeeks.map((week) => {
      return week.map((day) => {
        // Map contributionCount to an intensity value between 0 and 1
        const count = day.contributionCount || 0;
        if (count === 0) return 0;
        if (count < 3) return 0.3; // 1-2 commits
        if (count < 6) return 0.6; // 3-5 commits
        return 1; // 6+ commits
      });
    });
  }, [contributionWeeks]);

  return (
    <section className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">
            05. GitHub Activity
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-12">
            Always shipping<span className="text-primary">.</span>
          </h2>
        </motion.div>

        {/* Animated counter stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, type: "spring" }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="glass-card p-5 text-center cursor-default"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="font-heading text-2xl font-bold neon-text">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Contribution grid with cell-by-cell animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="glass-card p-6 overflow-x-auto"
        >
          <div className="flex gap-1 min-w-max justify-center">
            {grid.map((week, w) => (
              <div key={w} className="flex flex-col gap-1">
                {week.map((intensity, d) => {
                  let bg = "bg-secondary";
                  if (intensity >= 0.8) bg = "bg-primary";
                  else if (intensity >= 0.6) bg = "bg-primary/60";
                  else if (intensity >= 0.3) bg = "bg-primary/30";
                  else if (intensity > 0) bg = "bg-primary/10";

                  return (
                    <motion.div
                      key={d}
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.5 + w * 0.03 + d * 0.01,
                      }}
                      whileHover={{ scale: 1.5 }}
                      className={`w-3 h-3 rounded-sm ${bg} transition-colors cursor-default`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Contribution activity visualization
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GitHubSection;
