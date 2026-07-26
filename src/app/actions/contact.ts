"use server";

import { saveContactMessage, ContactMessage } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function submitContactForm(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!firstName || !lastName || !email || !message) {
      return { error: "Please fill in all required fields." };
    }

    const newMessage: ContactMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      firstName,
      lastName,
      email,
      subject: subject || "General Inquiry",
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };

    await saveContactMessage(newMessage);

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { error: "Failed to send message. Please try again later." };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    const { error } = await supabaseAdmin.from('settings').delete().eq('id', id);
    if (error) throw error;
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to delete contact message", err);
    return { error: err.message || "Failed to delete message" };
  }
}

export async function toggleMessageStatus(id: string, currentStatus: 'new' | 'read' | 'replied') {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/admin");
    const { data, error } = await supabaseAdmin.from('settings').select('data').eq('id', id).single();
    if (error || !data) throw new Error("Message not found");
    
    const msg = data.data as ContactMessage;
    msg.status = currentStatus === 'new' ? 'read' : 'new';
    
    const { error: updateError } = await supabaseAdmin.from('settings').upsert({ id, data: msg });
    if (updateError) throw updateError;
    
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (err: any) {
    console.error("Failed to update message status", err);
    return { error: err.message || "Failed to update status" };
  }
}
