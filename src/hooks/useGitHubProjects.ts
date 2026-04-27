import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export interface ProjectOverride {
  id: string;
  repo_name: string;
  custom_description: string | null;
  is_featured: boolean;
  is_hidden: boolean;
  display_order: number | null;
}

export interface ManualProject {
  id: string;
  name: string;
  description: string | null;
  homepage_url: string | null;
  topics: string[];
  language: string | null;
  is_featured: boolean;
  is_hidden: boolean;
  created_at: string;
}

export interface EnrichedProject {
  repo?: GitHubRepo;
  manual?: ManualProject;
  name: string;
  description: string;
  html_url?: string;
  homepage?: string | null;
  language?: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  isFeatured: boolean;
  isHidden: boolean;
  isManual: boolean;
  override?: ProjectOverride;
}

async function fetchGitHubUsername(): Promise<string> {
  const { data } = await supabase
    .from("portfolio_config")
    .select("value")
    .eq("key", "github_username")
    .single();
  return data?.value || "mujthabasalim";
}

async function fetchResumeUrl(): Promise<string> {
  const { data } = await supabase
    .from("portfolio_config")
    .select("value")
    .eq("key", "resume_url")
    .single();
  return data?.value || "/resume.pdf";
}

async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated`,
    );
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const data: GitHubRepo[] = await res.json();
    repos.push(...data);
    if (data.length < perPage) break;
    page++;
  }

  return repos.filter((r) => !r.fork && !r.archived);
}

async function fetchOverrides(): Promise<ProjectOverride[]> {
  const { data } = await supabase.from("project_overrides").select("*");
  return (data as ProjectOverride[]) || [];
}

async function fetchManualProjects(): Promise<ManualProject[]> {
  const { data } = await supabase
    .from("manual_projects")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ManualProject[]) || [];
}

export function useGitHubProjects() {
  const usernameQuery = useQuery({
    queryKey: ["github-username"],
    queryFn: fetchGitHubUsername,
    staleTime: 5 * 60 * 1000,
  });

  const resumeQuery = useQuery({
    queryKey: ["resume-url"],
    queryFn: fetchResumeUrl,
  });

  const reposQuery = useQuery({
    queryKey: ["github-repos", usernameQuery.data],
    queryFn: () => fetchGitHubRepos(usernameQuery.data!),
    enabled: !!usernameQuery.data,
    staleTime: 5 * 60 * 1000,
  });

  const overridesQuery = useQuery({
    queryKey: ["project-overrides"],
    queryFn: fetchOverrides,
    staleTime: 60 * 1000,
  });

  const manualQuery = useQuery({
    queryKey: ["manual-projects"],
    queryFn: fetchManualProjects,
    staleTime: 60 * 1000,
  });

  const contributionsQuery = useQuery({
    queryKey: ["github-contributions", usernameQuery.data],
    queryFn: async () => {
      const res = await fetch(
        `https://github-contributions-api.deno.dev/${usernameQuery.data}.json`,
      );
      if (!res.ok) throw new Error("Failed to fetch contributions");
      return res.json();
    },
    enabled: !!usernameQuery.data,
    staleTime: 5 * 60 * 1000,
  });

  const githubProjects: EnrichedProject[] = (reposQuery.data || []).map(
    (repo) => {
      const override = overridesQuery.data?.find(
        (o) => o.repo_name === repo.name,
      );
      return {
        repo,
        name: repo.name,
        description:
          override?.custom_description ||
          repo.description ||
          "No description available.",
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics,
        isFeatured: override?.is_featured || false,
        isHidden: override?.is_hidden || false,
        isManual: false,
        override,
      };
    },
  );

  const manualProjects: EnrichedProject[] = (manualQuery.data || []).map(
    (m) => ({
      manual: m,
      name: m.name,
      description: m.description || "No description available.",
      homepage: m.homepage_url,
      language: m.language,
      stargazers_count: 0,
      forks_count: 0,
      topics: m.topics || [],
      isFeatured: m.is_featured,
      isHidden: m.is_hidden,
      isManual: true,
    }),
  );

  const allProjects = [...manualProjects, ...githubProjects];

  // Sort: featured first, then by date (newest first)
  const visibleProjects = allProjects
    .filter((p) => !p.isHidden)
    .sort((a, b) => {
      // 1. Featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // 2. Secondary sort: Date (newest first)
      const dateA = a.isManual
        ? new Date(a.manual!.created_at).getTime()
        : new Date(a.repo!.pushed_at).getTime();
      const dateB = b.isManual
        ? new Date(b.manual!.created_at).getTime()
        : new Date(b.repo!.pushed_at).getTime();

      return dateB - dateA;
    });

  return {
    projects: visibleProjects,
    allProjects,
    isLoading:
      usernameQuery.isLoading ||
      reposQuery.isLoading ||
      manualQuery.isLoading ||
      contributionsQuery.isLoading ||
      resumeQuery.isLoading,
    error:
      usernameQuery.error ||
      reposQuery.error ||
      manualQuery.error ||
      contributionsQuery.error ||
      resumeQuery.error,
    username: usernameQuery.data,
    resumeUrl: resumeQuery.data || "/resume.pdf",
    totalContributions: contributionsQuery.data?.totalContributions || 0,
    contributionWeeks: contributionsQuery.data?.contributions || [],
  };
}
