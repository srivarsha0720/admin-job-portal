import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, MapPin, Briefcase, DollarSign, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSavedJobs, type Job } from "@/lib/mockJobs";

export const Route = createFileRoute("/dashboard/saved")({
  head: () => ({
    meta: [{ title: "Saved Jobs — JobBoard Admin" }],
  }),
  component: SavedJobsPage,
});

function SavedJobsPage() {
  const [saved, setSaved] = useState<Job[]>(mockSavedJobs);

  const handleRemove = (job: Job) => {
    setSaved((prev) => prev.filter((j) => j.id !== job.id));
    toast.success("Removed from saved jobs");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Saved Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Jobs you've bookmarked for later review.
        </p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center shadow-card">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Bookmark className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No saved jobs yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Jobs you save will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((job) => (
            <div
              key={job.id}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 shadow-card transition-shadow hover:shadow-elegant"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-foreground">{job.title}</h3>
                <Badge variant="secondary">{job.jobType}</Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.salary}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5" />
                  Saved on {job.createdAt}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRemove(job)}
                className="mt-4 gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
