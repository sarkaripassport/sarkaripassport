"use server";

import { revalidatePath } from "next/cache";
import { deleteJob as dbDeleteJob } from "@/lib/db";

export async function deleteJobAction(id: string) {
  try {
    const success = await dbDeleteJob(id);
    if (success) {
      // Revalidate paths so changes show up everywhere, especially localized routes
      revalidatePath('/', 'layout');
      return { success: true, message: "Job deleted successfully" };
    } else {
      return { success: false, message: "Job not found" };
    }
  } catch (error: any) {
    console.error("Failed to delete job:", error);
    return { success: false, message: error.message || "Failed to delete job" };
  }
}
