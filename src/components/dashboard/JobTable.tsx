import { useEffect, useState } from "react";
import { Pencil, Trash2, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/mockJobs";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface JobTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const typeStyles: Record<string, string> = {
  "Full-time": "bg-accent text-accent-foreground",
  "Part-time": "bg-secondary text-secondary-foreground",
  "Remote": "bg-success/15 text-success",
};

export function JobTable({ jobs, onEdit, onDelete }: JobTableProps) {
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadSaved = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", user.id);
      if (data) {
        setSavedIds(new Set(data.map((r: { job_id: number }) => r.job_id)));
      }
    };
    loadSaved();
  }, []);

  const handleToggleSave = async (job: Job) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to save jobs");
      return;
    }

    const isSaved = savedIds.has(job.id);

    if (isSaved) {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", job.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(job.id);
        return next;
      });
      toast.success("Job removed from saved");
    } else {
      const { error } = await supabase
        .from("saved_jobs")
        .insert({ user_id: user.id, job_id: job.id });
      if (error) {
        toast.error(error.message);
        return;
      }
      setSavedIds((prev) => new Set(prev).add(job.id));
      toast.success("Job saved");
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center shadow-card">
        <p className="text-sm text-muted-foreground">No jobs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Title</th>
              <th className="px-4 py-3 text-left font-medium">Salary</th>
              <th className="px-4 py-3 text-left font-medium">Location</th>
              <th className="px-4 py-3 text-left font-medium">Job Type</th>
              <th className="px-4 py-3 text-left font-medium">Created At</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => {
              const isSaved = savedIds.has(job.id);
              return (
                <tr key={job.id} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{job.title}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{job.salary}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{job.location}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Badge variant="secondary" className={cn("font-medium", typeStyles[job.jobType])}>
                      {job.jobType}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{job.createdAt}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleToggleSave(job)}
                        aria-label={isSaved ? "Unsave" : "Save"}
                        aria-pressed={isSaved}
                        className={cn(isSaved && "text-primary hover:text-primary")}
                      >
                        <Bookmark
                          className={cn("h-4 w-4", isSaved && "fill-current")}
                        />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => onEdit(job)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(job)}
                        aria-label="Delete"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
