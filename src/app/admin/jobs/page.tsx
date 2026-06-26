import { getJobs, getCategories } from "@/lib/db";
import JobsManagerClient from "./JobsManagerClient";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Jobs Manager - Admin Panel",
};

export default async function AdminJobsPage() {
  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1B3D] flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#0A58CA]" />
            All Jobs Manager
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage all active and inactive job postings on the platform.
          </p>
        </div>
      </div>

      <JobsManagerClient initialJobs={jobs} categories={categories} />
    </div>
  );
}
