import { getJobs } from "@/lib/db";
import JobsClient from "./JobsClient";

export const dynamic = 'force-dynamic';

export default async function JobsListingPage() {
  const jobs = await getJobs();
  return <JobsClient jobs={jobs} />;
}
