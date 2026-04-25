import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar, Clock, ArrowUpRight, Tag } from "lucide-react";

const articles = [
  {
    title: "Building Scalable REST APIs with Node.js & Express",
    excerpt: "A deep dive into designing production-ready APIs with proper error handling, rate limiting, and authentication middleware patterns.",
    date: "2026-02-15",
    readTime: "8 min read",
    tags: ["Node.js", "Express", "API Design"],
    category: "Backend",
    featured: true,
    link: "#",
  },
  {
    title: "React Performance: From Good to Blazing Fast",
    excerpt: "Practical techniques for optimizing React apps—memoization strategies, code splitting, virtualization, and avoiding common re-render pitfalls.",
    date: "2026-01-28",
    readTime: "12 min read",
    tags: ["React", "Performance", "JavaScript"],
    category: "Frontend",
    featured: true,
    link: "#",
  },
  {
    title: "MongoDB Aggregation Pipelines Demystified",
    excerpt: "Master complex data transformations with MongoDB's aggregation framework. Real-world examples from e-commerce to analytics dashboards.",
    date: "2026-01-10",
    readTime: "10 min read",
    tags: ["MongoDB", "Database", "NoSQL"],
    category: "Backend",
    featured: false,
    link: "#",
  },
  {
    title: "Auth Done Right: JWT + Refresh Tokens in MERN",
    excerpt: "Implementing secure authentication with access/refresh token rotation, HTTP-only cookies, and protecting against common auth vulnerabilities.",
    date: "2025-12-20",
    readTime: "15 min read",
    tags: ["Security", "MERN", "Authentication"],
    category: "Full Stack",
    featured: false,
    link: "#",
  },
  {
    title: "Deploying MERN Apps with Docker & CI/CD",
    excerpt: "From local development to production—containerizing your MERN stack and setting up automated pipelines with GitHub Actions.",
    date: "2025-12-05",
    readTime: "11 min read",
    tags: ["DevOps", "Docker", "CI/CD"],
    category: "DevOps",
    featured: false,
    link: "#",
  },
  {
    title: "State Management in 2026: Beyond Redux",
    excerpt: "Exploring modern state management approaches—Zustand, Jotai, React Query, and when to use each in real applications.",
    date: "2025-11-18",
    readTime: "9 min read",
    tags: ["React", "State Management", "Architecture"],
    category: "Frontend",
    featured: false,
    link: "#",
  },
];

const categories = ["All", "Frontend", "Backend", "Full Stack", "DevOps"];

const categoryColors: Record<string, string> = {
  Frontend: "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-cyan-400",
  Backend: "from-green-500/20 to-emerald-500/20 text-green-700 dark:text-emerald-400",
  "Full Stack": "from-primary/20 to-purple-500/20 text-primary",
  DevOps: "from-orange-500/20 to-amber-500/20 text-orange-600 dark:text-amber-400",
};

const BlogSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [filter, setFilter] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = filter === "All" ? articles : articles.filter((a) => a.category === filter);
  const featuredArticles = filtered.filter((a) => a.featured);
  const regularArticles = filtered.filter((a) => !a.featured);

  return (
    <section id="blog" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-sm text-primary mb-3">06. Blog &amp; Articles</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Blog &amp; Articles
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10">
            I write about web development, architecture patterns, and lessons learned building
            real-world applications.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Featured articles — larger cards */}
        {featuredArticles.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {featuredArticles.map((article, i) => {
              const globalIndex = articles.indexOf(article);
              return (
                <motion.a
                  key={article.title}
                  href={article.link}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(globalIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="group relative glass-card p-6 md:p-8 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  {/* Gradient accent top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryColors[article.category] || "from-primary/50 to-primary/20"}`} />

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full bg-gradient-to-r ${categoryColors[article.category] || "from-primary/20 to-primary/10 text-primary"}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {article.title}
                    <ArrowUpRight className={`inline ml-2 w-5 h-5 transition-all duration-300 ${hoveredIndex === globalIndex ? "opacity-100 translate-x-0 -translate-y-0" : "opacity-0 -translate-x-1 translate-y-1"}`} />
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted/50 text-muted-foreground font-mono">
                          <Tag className="inline w-2.5 h-2.5 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0 ml-3">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}

        {/* Regular articles — compact list */}
        <div className="space-y-3">
          {regularArticles.map((article, i) => {
            const globalIndex = articles.indexOf(article);
            return (
              <motion.a
                key={article.title}
                href={article.link}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                onMouseEnter={() => setHoveredIndex(globalIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 glass-card p-4 sm:p-5 rounded-lg transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full bg-gradient-to-r shrink-0 w-fit ${categoryColors[article.category] || "from-primary/20 to-primary/10 text-primary"}`}>
                  {article.category}
                </span>

                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-sm md:text-base group-hover:text-primary transition-colors duration-200 truncate">
                    {article.title}
                    <ArrowUpRight className={`inline ml-1.5 w-4 h-4 transition-all duration-300 ${hoveredIndex === globalIndex ? "opacity-100" : "opacity-0"}`} />
                  </h4>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-1 hidden sm:block">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
