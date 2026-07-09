import { Megaphone, Mail, Download, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press & Media | GovJobWala",
  description: "Press releases, media kits, and contact information for journalists and media professionals.",
};

export default function PressPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0B1B3D] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Press & <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Media</span>
          </h1>
          <p className="text-blue-100/80 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Resources, press releases, and brand assets for journalists and media professionals covering GovJobWala.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-6">Recent Press Releases</h2>
              
              <div className="space-y-6">
                {[
                  { date: "October 15, 2026", title: "GovJobWala Launches AI-Powered Eligibility Predictor", desc: "Revolutionizing how government job aspirants find suitable vacancies." },
                  { date: "August 22, 2026", title: "Over 1 Million Active Users Reached in Tier 2 & Tier 3 Cities", desc: "Bridging the information gap for rural and semi-urban candidates." },
                  { date: "June 05, 2026", title: "GovJobWala Introduces Native Marathi and Hindi Support", desc: "Ensuring language is never a barrier to a government career." }
                ].map((item, i) => (
                  <div key={i} className="group border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <p className="text-sm font-bold text-[#0A58CA] mb-2">{item.date}</p>
                    <h3 className="text-xl font-bold text-[#0B1B3D] mb-2 group-hover:text-[#0A58CA] transition-colors cursor-pointer">{item.title}</h3>
                    <p className="text-gray-500 mb-3">{item.desc}</p>
                    <button className="text-sm font-bold text-gray-700 flex items-center gap-1 group-hover:text-[#0A58CA] transition-colors">
                      Read Full Release <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">Brand Guidelines</h2>
              <p className="text-gray-600 mb-6">
                When using the GovJobWala brand, please adhere to our official brand guidelines to ensure consistency. Do not alter our logo colors, stretch the logo, or use it on unapproved backgrounds.
              </p>
              <button className="bg-gray-100 text-[#0B1B3D] font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Brand Guidelines PDF
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#0B1B3D] to-[#0A58CA] p-8 rounded-2xl shadow-lg text-white">
              <h3 className="text-xl font-bold mb-4">Media Inquiries</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                If you are a member of the press and require information or an interview, please reach out to our media relations team.
              </p>
              <a href="mailto:support.naukaripassport@gmail.com" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl">
                <Mail className="w-5 h-5 text-blue-200" />
                <div>
                  <p className="text-xs text-blue-200 font-medium">Press Contact</p>
                  <p className="font-bold text-sm">support.naukaripassport@gmail.com</p>
                </div>
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-6">Media Assets</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#0A58CA] hover:bg-blue-50 transition-colors group">
                  <span className="font-bold text-gray-700 group-hover:text-[#0A58CA]">Logo Pack (SVG/PNG)</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-[#0A58CA]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#0A58CA] hover:bg-blue-50 transition-colors group">
                  <span className="font-bold text-gray-700 group-hover:text-[#0A58CA]">Founder Headshots</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-[#0A58CA]" />
                </button>
                <button className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-[#0A58CA] hover:bg-blue-50 transition-colors group">
                  <span className="font-bold text-gray-700 group-hover:text-[#0A58CA]">Product Screenshots</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-[#0A58CA]" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
