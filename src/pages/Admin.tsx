import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  useGitHubProjects,
  type EnrichedProject,
  type ManualProject,
} from "@/hooks/useGitHubProjects";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  Loader2,
  Settings,
  ArrowLeft,
  Github,
  Plus,
  Lock,
  X,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import AdminProjectForm from "@/components/admin/AdminProjectForm";
import AdminProjectItem from "@/components/admin/AdminProjectItem";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { allProjects, isLoading, username } = useGitHubProjects();

  const [githubUsername, setGithubUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");

  // Manual project form state
  const [showManualForm, setShowManualForm] = useState(false);
  const [editingManualId, setEditingManualId] = useState<string | null>(null);
  const [manualName, setManualName] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualUrl, setManualUrl] = useState("");
  const [manualLang, setManualLang] = useState("");
  const [manualTags, setManualTags] = useState("");
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (username) setGithubUsername(username);
  }, [username]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="glass-card p-8 text-center max-w-md">
          <h1 className="font-heading text-2xl font-bold mb-2 text-destructive">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            You don't have admin privileges. Contact the portfolio owner to get access.
          </p>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-primary hover:underline"
          >
            Back to portfolio
          </button>
        </div>
      </div>
    );
  }

  const handleSaveUsername = async () => {
    setSavingUsername(true);
    const { error } = await supabase
      .from("portfolio_config")
      .update({ value: githubUsername })
      .eq("key", "github_username");

    if (error) {
      toast.error("Failed to update username");
    } else {
      toast.success("GitHub username updated!");
      queryClient.invalidateQueries({ queryKey: ["github-username"] });
      queryClient.invalidateQueries({ queryKey: ["github-repos"] });
    }
    setSavingUsername(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim()) return;

    setIsSubmittingManual(true);
    const projectData = {
      name: manualName,
      description: manualDesc,
      homepage_url: manualUrl,
      language: manualLang,
      topics: manualTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    let error;
    if (editingManualId) {
      const { error: err } = await supabase
        .from("manual_projects")
        .update(projectData)
        .eq("id", editingManualId);
      error = err;
    } else {
      const { error: err } = await supabase
        .from("manual_projects")
        .insert(projectData);
      error = err;
    }

    if (error) {
      toast.error(editingManualId ? "Failed to update project" : "Failed to add project");
    } else {
      toast.success(editingManualId ? "Project updated!" : "Private project added!");
      resetManualForm();
      queryClient.invalidateQueries({ queryKey: ["manual-projects"] });
    }
    setIsSubmittingManual(false);
  };

  const resetManualForm = () => {
    setManualName("");
    setManualDesc("");
    setManualUrl("");
    setManualLang("");
    setManualTags("");
    setEditingManualId(null);
    setShowManualForm(false);
  };

  const editManualProject = (project: ManualProject) => {
    setManualName(project.name);
    setManualDesc(project.description || "");
    setManualUrl(project.homepage_url || "");
    setManualLang(project.language || "");
    setManualTags(project.topics?.join(", ") || "");
    setEditingManualId(project.id);
    setShowManualForm(true);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const deleteManualProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("manual_projects")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: ["manual-projects"] });
    }
  };

  const toggleFeatured = async (project: EnrichedProject) => {
    const newVal = !project.isFeatured;

    if (project.isManual) {
      await supabase
        .from("manual_projects")
        .update({ is_featured: newVal })
        .eq("id", project.manual!.id);
      queryClient.invalidateQueries({ queryKey: ["manual-projects"] });
    } else {
      const { data: existing } = await supabase
        .from("project_overrides")
        .select("*")
        .eq("repo_name", project.name)
        .single();

      if (existing) {
        await supabase
          .from("project_overrides")
          .update({ is_featured: newVal })
          .eq("repo_name", project.name);
      } else {
        await supabase.from("project_overrides").insert({
          repo_name: project.name,
          is_featured: newVal,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["project-overrides"] });
    }
    toast.success(newVal ? "Marked as featured" : "Removed from featured");
  };

  const toggleHidden = async (project: EnrichedProject) => {
    const newVal = !project.isHidden;

    if (project.isManual) {
      await supabase
        .from("manual_projects")
        .update({ is_hidden: newVal })
        .eq("id", project.manual!.id);
      queryClient.invalidateQueries({ queryKey: ["manual-projects"] });
    } else {
      const { data: existing } = await supabase
        .from("project_overrides")
        .select("*")
        .eq("repo_name", project.name)
        .single();

      if (existing) {
        await supabase
          .from("project_overrides")
          .update({ is_hidden: newVal })
          .eq("repo_name", project.name);
      } else {
        await supabase.from("project_overrides").insert({
          repo_name: project.name,
          is_hidden: newVal,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["project-overrides"] });
    }
    toast.success(newVal ? "Project hidden" : "Project visible");
  };

  const saveDescription = async (project: EnrichedProject) => {
    const desc = editDescription.trim() || null;

    if (project.isManual) {
      await supabase
        .from("manual_projects")
        .update({ description: desc })
        .eq("id", project.manual!.id);
      queryClient.invalidateQueries({ queryKey: ["manual-projects"] });
    } else {
      const { data: existing } = await supabase
        .from("project_overrides")
        .select("*")
        .eq("repo_name", project.name)
        .single();

      if (existing) {
        await supabase
          .from("project_overrides")
          .update({ custom_description: desc })
          .eq("repo_name", project.name);
      } else {
        await supabase.from("project_overrides").insert({
          repo_name: project.name,
          custom_description: desc,
        });
      }
      queryClient.invalidateQueries({ queryKey: ["project-overrides"] });
    }
    setEditingProject(null);
    toast.success("Description updated!");
  };

  return (
    <div className="dark">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="font-heading text-lg font-bold flex items-center gap-2">
                  <Settings size={18} className="text-primary" /> Admin Panel
                </h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut().then(() => navigate("/"))}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
          {/* GitHub Config */}
          <div className="glass-card p-6">
            <h2 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
              <Github size={20} className="text-primary" /> GitHub Configuration
            </h2>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-1.5">
                  GitHub Username
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. octocat"
                />
              </div>
              <button
                onClick={handleSaveUsername}
                disabled={savingUsername}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {savingUsername ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save
              </button>
            </div>
          </div>

          {/* Private Projects Management */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Lock size={20} className="text-accent" /> Private Projects
              </h2>
              <button
                onClick={() => {
                  if (showManualForm) resetManualForm();
                  else setShowManualForm(true);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  showManualForm
                    ? "bg-secondary text-foreground"
                    : "bg-accent text-accent-foreground hover:opacity-90"
                }`}
              >
                {showManualForm ? <X size={14} /> : <Plus size={14} />}
                {showManualForm ? "Cancel" : "Add Private"}
              </button>
            </div>

            {showManualForm && (
              <AdminProjectForm
                onSubmit={handleManualSubmit}
                isSubmitting={isSubmittingManual}
                editingManualId={editingManualId}
                manualName={manualName}
                setManualName={setManualName}
                manualDesc={manualDesc}
                setManualDesc={setManualDesc}
                manualUrl={manualUrl}
                setManualUrl={setManualUrl}
                manualLang={manualLang}
                setManualLang={setManualLang}
                manualTags={manualTags}
                setManualTags={setManualTags}
                onReset={resetManualForm}
              />
            )}

            <div className="space-y-3">
              {allProjects.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No projects found.
                </p>
              )}

              {allProjects.map((project) => (
                <AdminProjectItem
                  key={project.isManual ? project.manual?.id : project.name}
                  project={project}
                  editingProject={editingProject}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  setEditingProject={setEditingProject}
                  onSaveDescription={saveDescription}
                  onToggleFeatured={toggleFeatured}
                  onToggleHidden={toggleHidden}
                  onEditManual={editManualProject}
                  onDeleteManual={deleteManualProject}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
