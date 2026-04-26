export type JobType = "Full-time" | "Part-time" | "Remote";

export interface Job {
  id: number;
  title: string;
  salary: string;
  location: string;
  jobType: string;
  createdAt: string;
}

export const mockJobs: Job[] = [
  { id: 1, title: "Senior Frontend Engineer", salary: "$120k - $150k", location: "San Francisco, CA", jobType: "Full-time", createdAt: "2025-04-12" },
  { id: 2, title: "Product Designer", salary: "$95k - $115k", location: "Remote", jobType: "Remote", createdAt: "2025-04-10" },
  { id: 3, title: "Backend Developer", salary: "$110k - $140k", location: "New York, NY", jobType: "Full-time", createdAt: "2025-04-08" },
  { id: 4, title: "Marketing Specialist", salary: "$60k - $75k", location: "Austin, TX", jobType: "Part-time", createdAt: "2025-04-05" },
  { id: 5, title: "DevOps Engineer", salary: "$130k - $160k", location: "Remote", jobType: "Remote", createdAt: "2025-04-03" },
];

export const mockSavedJobs: Job[] = [mockJobs[0], mockJobs[2], mockJobs[4]];

