import { Loader2, X, Plus } from "lucide-react";
import { ManualProject } from "@/hooks/useGitHubProjects";

interface AdminProjectFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  editingManualId: string | null;
  manualName: string;
  setManualName: (v: string) => void;
  manualDesc: string;
  setManualDesc: (v: string) => void;
  manualUrl: string;
  setManualUrl: (v: string) => void;
  manualLang: string;
  setManualLang: (v: string) => void;
  manualTags: string;
  setManualTags: (v: string) => void;
  onReset: () => void;
}

const AdminProjectForm = ({
  onSubmit,
  isSubmitting,
  editingManualId,
  manualName,
  setManualName,
  manualDesc,
  setManualDesc,
  manualUrl,
  setManualUrl,
  manualLang,
  setManualLang,
  manualTags,
  setManualTags,
  onReset,
}: AdminProjectFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-8 p-4 rounded-xl bg-secondary/30 border border-accent/20 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-accent">
          {editingManualId ? "Edit Private Project" : "Add New Private Project"}
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Project Name *</label>
          <input
            required
            type="text"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="e.g. Private Banking App"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Live URL (optional)</label>
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="https://..."
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Primary Language</label>
          <input
            type="text"
            value={manualLang}
            onChange={(e) => setManualLang(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="e.g. TypeScript"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Topics (comma separated)</label>
          <input
            type="text"
            value={manualTags}
            onChange={(e) => setManualTags(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-accent/50"
            placeholder="react, tailwind, node"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium">Description</label>
        <textarea
          value={manualDesc}
          onChange={(e) => setManualDesc(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-accent/50"
          placeholder="Tell us about the project..."
        />
      </div>
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50 hover:shadow-[0_0_15px_hsl(175_80%_50%/0.2)] transition-all"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin mx-auto" />
          ) : editingManualId ? (
            "Update Project"
          ) : (
            "Create Private Project"
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AdminProjectForm;
