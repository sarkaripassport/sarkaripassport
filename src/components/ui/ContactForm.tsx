"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await submitContactForm(formData);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-6">Thank you for reaching out. Our team will get back to you shortly.</p>
        <button onClick={() => setSuccess(false)} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="firstName">First Name</label>
          <input required type="text" name="firstName" id="firstName" placeholder="John" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="lastName">Last Name</label>
          <input required type="text" name="lastName" id="lastName" placeholder="Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="email">Email Address</label>
        <input required type="email" name="email" id="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="subject">Subject</label>
        <select required name="subject" id="subject" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all text-gray-700 cursor-pointer">
          <option value="General Inquiry">General Inquiry</option>
          <option value="Report a Bug or Issue">Report a Bug or Issue</option>
          <option value="Advertisement / Partnership">Advertisement / Partnership</option>
          <option value="Feedback & Suggestions">Feedback & Suggestions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2" htmlFor="message">Message</label>
        <textarea required name="message" id="message" rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all resize-none"></textarea>
      </div>

      <button disabled={isSubmitting} type="submit" className="w-full bg-[#0A58CA] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        )}
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
