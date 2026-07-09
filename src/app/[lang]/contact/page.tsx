import { Mail, MapPin, Send, MessageSquare, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | GovJobWala",
  description: "Get in touch with the GovJobWala team. We are here to help you with government job queries, feedback, and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0B1B3D] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Touch</span>
          </h1>
          <p className="text-blue-100/80 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or need help? Our team is always ready to assist you on your journey to a government job.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Information Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-[#0A58CA]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">Email Us</h3>
              <p className="text-gray-500 mb-4 text-sm">Our friendly team is here to help.</p>
              <a href="mailto:support.naukaripassport@gmail.com" className="text-[#0A58CA] font-bold hover:underline">
                support.naukaripassport@gmail.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#0A58CA]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">Office Location</h3>
              <p className="text-gray-500 mb-4 text-sm">Come say hello at our headquarters.</p>
              <p className="font-bold text-gray-800">
                Nashik, Maharashtra<br/>
                India
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-6 h-6 text-[#0A58CA]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">Social Media</h3>
              <p className="text-gray-500 mb-4 text-sm">Follow us for real-time updates.</p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-[#0A58CA] transition-colors font-bold">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-[#0A58CA] transition-colors font-bold">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-[#0A58CA] transition-colors font-bold">Telegram</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-lg">
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                    <input type="text" placeholder="John" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                    <input type="text" placeholder="Doe" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all text-gray-700 cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Report a Bug or Issue</option>
                    <option>Advertisement / Partnership</option>
                    <option>Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea rows={5} placeholder="How can we help you?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all resize-none"></textarea>
                </div>

                <button type="button" className="w-full bg-[#0A58CA] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
