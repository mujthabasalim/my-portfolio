import { Star, Eye, EyeOff, Edit2, Trash2, Lock } from "lucide-react";
import { EnrichedProject, ManualProject } from "@/hooks/useGitHubProjects";
import { formatRepoName } from "@/lib/utils";

interface AdminProjectItemProps {
  project: EnrichedProject;
  editingProject: string | null;
  editDescription: string;
  setEditDescription: (v: string) => void;
  setEditingProject: (v: string | null) => void;
  onSaveDescription: (p: EnrichedProject) => void;
  onToggleFeatured: (p: EnrichedProject) => void;
  onToggleHidden: (p: EnrichedProject) => void;
  onEditManual: (p: ManualProject) => void;
  onDeleteManual: (id: string) => void;
}

const AdminProjectItem = ({
  project,
  editingProject,
  editDescription,
  setEditDescription,
  setEditingProject,
  onSaveDescription,
  onToggleFeatured,
  onToggleHidden,
  onEditManual,
  onDeleteManual,
}: AdminProjectItemProps) => {
  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-300 ${
        project.isHidden
          ? "border-border/50 bg-muted/30 opacity-60"
          : "border-border bg-secondary/30 hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-heading text-sm font-semibold truncate">
              {formatRepoName(project.name)}
            </h3>
            {project.isManual && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-accent/15 text-accent font-mono flex items-center gap-1">
                <Lock size={10} /> Private
              </span>
            )}
            {project.isFeatured && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-primary/15 text-primary font-mono shadow-[0_0_10px_hsl(175_80%_50%/0.1)]">
                Featured
              </span>
            )}
            {project.isHidden && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-destructive/15 text-destructive font-mono">
                Hidden
              </span>
            )}
            {project.language && (
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-accent/5 text-accent/70 font-mono">
                {project.language}
              </span>
            )}
          </div>

          {editingProject === project.name ? (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary/50"
                placeholder="Custom description..."
                autoFocus
              />
              <button
                onClick={() => onSaveDescription(project)}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
              >
                Save
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p
              onClick={() => {
                setEditingProject(project.name);
                setEditDescription(
                  project.isManual
                    ? project.manual?.description || ""
                    : project.override?.custom_description || ""
                );
              }}
              className="text-xs text-muted-foreground truncate cursor-pointer hover:text-foreground transition-colors"
              title="Click to edit description"
            >
              {project.description || "No description provided."}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleFeatured(project)}
            className={`p-2 rounded-lg transition-all ${
              project.isFeatured
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
            title={project.isFeatured ? "Remove from featured" : "Mark as featured"}
          >
            <Star size={16} fill={project.isFeatured ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onToggleHidden(project)}
            className={`p-2 rounded-lg transition-all ${
              project.isHidden
                ? "text-destructive bg-destructive/10"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title={project.isHidden ? "Show project" : "Hide project"}
          >
            {project.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {project.isManual && (
            <>
              <button
                onClick={() => onEditManual(project.manual!)}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                title="Edit project"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => onDeleteManual(project.manual!.id)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="Delete project"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProjectItem;
