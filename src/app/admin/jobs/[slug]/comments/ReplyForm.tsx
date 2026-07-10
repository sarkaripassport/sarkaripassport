"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { addJobCommentAction } from "@/app/actions/comments";

export default function ReplyForm({ jobSlug, replyToName }: { jobSlug: string, replyToName: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    
    try {
      const res = await addJobCommentAction(jobSlug, {
        name: "GovJobWala Team",
        text: `@${replyToName} ${text}`,
        is_admin_reply: true,
      });
      
      if (res.success) {
        setIsOpen(false);
        (e.target as HTMLFormElement).reset();
        // Force refresh to show new comment
        window.location.reload();
      } else {
        alert(res.error || "Failed to reply");
      }
    } catch (err) {
      alert("Error submitting reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-[#0A58CA] hover:underline flex items-center gap-1"
      >
        <Send className="w-3.5 h-3.5" /> Reply to {replyToName}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        required
        name="text"
        placeholder={`Write your reply to ${replyToName}...`}
        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A58CA] min-h-[100px] pr-24"
      ></textarea>
      
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button 
          type="button" 
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-[#0A58CA] text-white px-4 py-1.5 rounded text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Post"}
        </button>
      </div>
    </form>
  );
}
