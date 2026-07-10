"use server";

import { saveContactMessage, ContactMessage } from "@/lib/db";

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
