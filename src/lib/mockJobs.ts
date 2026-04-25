export type JobType = "Full-time" | "Part-time" | "Remote";

export interface Job {
  id: string;
  title: string;
  salary: string;
  location: string;
  jobType: JobType;
  createdAt: string;
}

export const mockJobs: Job[] = [
  { id: "1", title: "Senior Frontend Engineer", salary: "$120k - $150k", location: "San Francisco, CA", jobType: "Full-time", createdAt: "2025-04-12" },
  { id: "2", title: "Product Designer", salary: "$95k - $115k", location: "Remote", jobType: "Remote", createdAt: "2025-04-10" },
  { id: "3", title: "Backend Developer", salary: "$110k - $140k", location: "New York, NY", jobType: "Full-time", createdAt: "2025-04-08" },
  { id: "4", title: "Marketing Specialist", salary: "$60k - $75k", location: "Austin, TX", jobType: "Part-time", createdAt: "2025-04-05" },
  { id: "5", title: "DevOps Engineer", salary: "$130k - $160k", location: "Remote", jobType: "Remote", createdAt: "2025-04-03" },
  { id: "6", title: "Data Analyst", salary: "$80k - $100k", location: "Chicago, IL", jobType: "Full-time", createdAt: "2025-04-01" },
  { id: "7", title: "UX Researcher", salary: "$90k - $110k", location: "Seattle, WA", jobType: "Full-time", createdAt: "2025-03-28" },
  { id: "8", title: "Mobile Developer", salary: "$115k - $140k", location: "Remote", jobType: "Remote", createdAt: "2025-03-25" },
  { id: "9", title: "Customer Support Lead", salary: "$55k - $70k", location: "Boston, MA", jobType: "Part-time", createdAt: "2025-03-22" },
  { id: "10", title: "Engineering Manager", salary: "$160k - $200k", location: "San Francisco, CA", jobType: "Full-time", createdAt: "2025-03-20" },
  { id: "11", title: "Content Writer", salary: "$50k - $65k", location: "Remote", jobType: "Remote", createdAt: "2025-03-18" },
  { id: "12", title: "QA Engineer", salary: "$85k - $105k", location: "Denver, CO", jobType: "Full-time", createdAt: "2025-03-15" },
];

export const mockSavedJobs: Job[] = [mockJobs[0], mockJobs[2], mockJobs[4]];
