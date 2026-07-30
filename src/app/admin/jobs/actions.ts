"use server";

import { revalidatePath } from "next/cache";
import { deleteJob as dbDeleteJob, updateJob as dbUpdateJob } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function deleteJobAction(id: string) {
  try {
    await requireAdmin();
    const success = await dbDeleteJob(id);
    if (success) {
      // Revalidate paths so changes show up everywhere, especially localized routes
      revalidatePath('/', 'layout');
      revalidatePath('/admin/jobs');
      return { success: true, message: "Job deleted successfully" };
    } else {
      return { success: false, message: "Job not found" };
    }
  } catch (error: any) {
    console.error("Failed to delete job:", error);
    return { success: false, message: error.message || "Failed to delete job" };
  }
}

export async function toggleJobLiveStatusAction(id: string, newIsLive: boolean) {
  try {
    await requireAdmin();
    const updated = await dbUpdateJob(id, { isLive: newIsLive });
    if (updated) {
      revalidatePath('/', 'layout');
      revalidatePath('/admin/jobs');
      return { 
        success: true, 
        isLive: updated.isLive, 
        message: `Job ${newIsLive ? 'shown on' : 'hidden from'} front end.` 
      };
    } else {
      return { success: false, message: "Job not found" };
    }
  } catch (error: any) {
    console.error("Failed to toggle job live status:", error);
    return { success: false, message: error.message || "Failed to update job status" };
  }
}
