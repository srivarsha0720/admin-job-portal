import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Job } from "@/lib/mockJobs";

interface JobFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Job, "id" | "createdAt">) => void;
  initial?: Job | null;
}

const JOB_TYPES = ["Full-time", "Part-time", "Remote"];

export function JobFormModal({ open, onOpenChange, onSubmit, initial }: JobFormModalProps) {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState<string>("Full-time");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      // Strip non-numeric chars from existing salary string for the number input
      const initialSalary = initial?.salary ?? "";
      const numericSalary = String(initialSalary).replace(/[^\d.]/g, "");
      setSalary(numericSalary);
      setLocation(initial?.location ?? "");
      setJobType(initial?.jobType ?? "Full-time");
      setErrors({});
    }
  }, [open, initial]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Title is required";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!salary.toString().trim()) {
      newErrors.salary = "Salary is required";
    } else {
      const salaryNum = Number(salary);
      if (Number.isNaN(salaryNum)) {
        newErrors.salary = "Salary must be a valid number";
      } else if (salaryNum <= 0) {
        newErrors.salary = "Salary must be greater than 0";
      }
    }

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!jobType || !JOB_TYPES.includes(jobType)) {
      newErrors.jobType = "Please select a job type";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    onSubmit({
      title: title.trim(),
      salary: Number(salary) as unknown as string,
      location: location.trim(),
      jobType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Job" : "Add New Job"}</DialogTitle>
          <DialogDescription>
            {initial ? "Update the job details below." : "Fill in the details to create a new job listing."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              aria-invalid={!!errors.title}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              min="1"
              step="any"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 120000"
              aria-invalid={!!errors.salary}
            />
            {errors.salary && <p className="text-xs text-destructive">{errors.salary}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
              aria-invalid={!!errors.location}
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobType">Job Type</Label>
            <Select value={jobType} onValueChange={(v) => setJobType(v)}>
              <SelectTrigger id="jobType" aria-invalid={!!errors.jobType}>
                <SelectValue placeholder="Select a job type" />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.jobType && <p className="text-xs text-destructive">{errors.jobType}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{initial ? "Save Changes" : "Create Job"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
