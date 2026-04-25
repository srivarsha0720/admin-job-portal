import { useMemo, useState } from "react";
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
import { mockJobs, type Job } from "@/lib/mockJobs";

export const Route = createFileRoute("/dashboard/jobs")({
  head: () => ({
    meta: [{ title: "Jobs — JobBoard Admin" }],
  }),
  component: JobsPage,
});

const PAGE_SIZE = 6;

function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState<Job | null>(null);

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

  const handleSubmit = (data: Omit<Job, "id" | "createdAt">) => {
    if (editing) {
      setJobs((prev) => prev.map((j) => (j.id === editing.id ? { ...j, ...data } : j)));
      toast.success("Job updated successfully");
    } else {
      const newJob: Job = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setJobs((prev) => [newJob, ...prev]);
      toast.success("Job created successfully");
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
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

      <JobTable jobs={paginated} onEdit={handleEdit} onDelete={setDeleting} />

      <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />

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
