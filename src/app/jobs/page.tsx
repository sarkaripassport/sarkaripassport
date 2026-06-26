import { getJobs, getCategories } from "@/lib/db";
import JobsClient from "./JobsClient";

export const dynamic = 'force-dynamic';

export default async function JobsListingPage() {
  const [jobs, categories] = await Promise.all([
    getJobs(),
    getCategories()
  ]);
  return <JobsClient jobs={jobs} categories={categories} />;
}
