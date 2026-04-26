import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobTable } from "@/components/dashboard/JobTable";
import { JobFormModal } from "@/components/dashboard/JobFormModal";
import { Pagination } from "@/components/dashboard/Pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Job } from "@/lib/mockJobs";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [{ title: "Jobs — JobBoard Admin" }],
  }),
  component: JobsPage,
});

const PAGE_SIZE = 6;

interface JobRow {
  id: number;
  title: string;
  salary: string;
  location: string;
  job_type: string;
  created_at: string;
}

const fromRow = (r: JobRow): Job => ({
  id: r.id,
  title: r.title,
  salary: r.salary,
  location: r.location,
  jobType: r.job_type,
  createdAt: r.created_at?.slice(0, 10) ?? "",
});

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState<Job | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setJobs((data as JobRow[]).map(fromRow));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.jobType.toLowerCase().includes(q),
    );
  }, [jobs, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditing(job);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Omit<Job, "id" | "createdAt">) => {
    const payload = {
      title: data.title,
      salary: data.salary,
      location: data.location,
      job_type: data.jobType,
    };
    if (editing) {
      const { data: updated, error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", editing.id)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      const row = fromRow(updated as JobRow);
      setJobs((prev) => prev.map((j) => (j.id === editing.id ? row : j)));
      toast.success("Job updated successfully");
    } else {
      const { data: inserted, error } = await supabase
        .from("jobs")
        .insert(payload)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      setJobs((prev) => [fromRow(inserted as JobRow), ...prev]);
      toast.success("Job created successfully");
    }
    setModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from("jobs").delete().eq("id", deleting.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setJobs((prev) => prev.filter((j) => j.id !== deleting.id));
    toast.success("Job deleted");
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Jobs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your job listings and postings.
          </p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Job
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by title, location, or type..."
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="rounded-lg border border-border bg-card p-12 text-center shadow-card">
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        </div>
      ) : (
        <>
          <JobTable jobs={paginated} onEdit={handleEdit} onDelete={setDeleting} />
          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      <JobFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleSubmit}
        initial={editing}
      />

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{deleting?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
