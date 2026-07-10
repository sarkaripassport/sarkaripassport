"use server";

import { addJobComment, JobComment } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addJobCommentAction(slug: string, comment: Omit<JobComment, 'id' | 'created_at'>) {
  try {
    const newComment = await addJobComment(slug, comment);
    
    if (newComment) {
      revalidatePath(`/[lang]/jobs/${slug}`, "page");
      revalidatePath(`/admin/jobs/${slug}/comments`, "page");
      return { success: true, comment: newComment };
    }
    
    return { error: "Job not found." };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment." };
  }
}
