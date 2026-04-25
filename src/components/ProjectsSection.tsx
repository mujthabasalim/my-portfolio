import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import {
  ExternalLink,
  Github,
  ChevronDown,
  Star,
  GitFork,
  Loader2,
} from "lucide-react";
import {
  useGitHubProjects,
  type EnrichedProject,
} from "@/hooks/useGitHubProjects";
import { formatRepoName } from "@/lib/utils";

const categories = ["Featured", "All"];

const ProjectCard = ({
  project,
  index,
  isInView,
  expandedIndex,
  setExpandedIndex,
}: {
  project: EnrichedProject;
  index: number;
  isInView: boolean;
  expandedIndex: number | null;
  setExpandedIndex: (i: number | null) => void;
}) => {
  const { isFeatured, description, name, html_url, homepage } = project;

  return (
    <motion.div
      key={name}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card group overflow-hidden"
    >
      {/* Gradient top bar */}
      <div className="h-1 w-full relative overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary absolute inset-0"
          initial={{ x: "-100%" }}
          animate={isInView ? { x: "0%" } : {}}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.15 }}
        />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors">
              {formatRepoName(name)}
            </h3>
            {isFeatured && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/15 text-primary font-mono font-medium">
                Featured
              </span>
            )}
            {project.isManual && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-accent/15 text-accent font-mono font-medium">
                Private
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!project.isManual && html_url && (
              <a
                href={html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {homepage && (
              <a
                href={homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                aria-label="Live demo"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Expandable details */}
        <button
          onClick={() =>
            setExpandedIndex(expandedIndex === index ? null : index)
          }
          className="flex items-center gap-1 text-xs text-primary font-mono hover:underline"
        >
          {expandedIndex === index ? "Hide" : "Show"} details
          <motion.span
            animate={{ rotate: expandedIndex === index ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={14} />
          </motion.span>
        </button>

        <AnimatePresence>
          {expandedIndex === index && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 text-xs pt-2 border-t border-border">
                <div className="flex gap-2">
                  <span className="text-primary font-mono font-medium shrink-0">
                    Stars →
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Star size={12} /> {project.stargazers_count}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-accent font-mono font-medium shrink-0">
                    Forks →
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <GitFork size={12} /> {project.forks_count}
                  </span>
                </div>
                {project.language && (
                  <div className="flex gap-2">
                    <span className="text-primary font-mono font-medium shrink-0">
                      Language →
                    </span>
                    <span className="text-muted-foreground">
                      {project.language}
                    </span>
                  </div>
                )}
                {project.repo?.pushed_at && (
                  <div className="flex gap-2">
                    <span className="text-accent font-mono font-medium shrink-0">
                      Updated →
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(project.repo.pushed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2 pt-2">
          {project.topics?.slice(0, 6).map((topic) => (
            <span
              key={topic}
              className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-mono"
            >
              {formatRepoName(topic)}
            </span>
          ))}
          {project.language && !project.topics?.length && (
            <span className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-mono">
              {project.language}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("Featured");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { projects, isLoading, error } = useGitHubProjects();

  const filtered =
    filter === "Featured" ? projects.filter((p) => p.isFeatured) : projects;

  // Show max 12 projects (increased for manual projects)
  const displayedProjects = filtered.slice(0, 12);

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">
            03. Featured Projects
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-8">
            Things I've built<span className="text-primary">.</span>
          </h2>

          {/* Filter */}
          <div className="flex gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setExpandedIndex(null);
                }}
                className={`relative px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 ${
                  filter === cat
                    ? "text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {filter === cat && (
                  <motion.div
                    layoutId="projectFilter"
                    className="absolute inset-0 rounded-lg bg-primary shadow-[0_0_20px_hsl(175_80%_50%/0.2)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-mono text-sm">
              Failed to load projects. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {displayedProjects.map((project, i) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  index={i}
                  isInView={isInView}
                  expandedIndex={expandedIndex}
                  setExpandedIndex={setExpandedIndex}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!isLoading && !error && displayedProjects.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="font-mono text-sm">No projects found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
