import { Briefcase, MapPin, Users, Rocket, Coffee, GraduationCap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | GovJobWala",
  description: "Join the GovJobWala team and help millions of Indians achieve their government job dreams.",
};

export default function CareersPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0B1B3D] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-20 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Build the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Employment</span>
          </h1>
          <p className="text-blue-100/80 md:text-xl max-w-2xl mx-auto leading-relaxed">
            Join a mission-driven team dedicated to organizing India's government job data and making it accessible to millions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Perks Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-[#0B1B3D] text-center mb-12">Life at GovJobWala</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-7 h-7 text-[#0A58CA]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">High Impact</h3>
              <p className="text-gray-500 leading-relaxed">The code you write directly helps millions of rural and urban aspirants secure their futures.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">Remote First</h3>
              <p className="text-gray-500 leading-relaxed">Work from anywhere in India. We care about your output, not your physical location.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">Continuous Learning</h3>
              <p className="text-gray-500 leading-relaxed">Annual learning stipends and a culture that promotes experimenting with the latest tech.</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-3xl font-black text-[#0B1B3D] mb-8">Open Positions</h2>
          
          <div className="space-y-4">
            {[
              { role: "Senior Frontend Engineer (React/Next.js)", type: "Full-Time", location: "Remote / Nashik", dept: "Engineering" },
              { role: "Data Entry & Content Specialist", type: "Full-Time", location: "Nashik, India", dept: "Operations" },
              { role: "SEO & Growth Marketing Manager", type: "Full-Time", location: "Remote", dept: "Marketing" },
            ].map((job, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#0A58CA] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer">
                <div>
                  <h3 className="text-xl font-bold text-[#0B1B3D] mb-2 group-hover:text-[#0A58CA] transition-colors">{job.role}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.type}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                    <span className="bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-bold text-gray-700">{job.dept}</span>
                  </div>
                </div>
                <button className="bg-[#0A58CA] text-white font-bold px-6 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
                  Apply Now
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-3">Don't see a fit?</h3>
            <p className="text-gray-600 mb-6">We are always looking for talented individuals. Send us your resume and let us know how you can contribute.</p>
            <a href="mailto:support.naukaripassport@gmail.com" className="inline-block bg-white text-[#0A58CA] font-bold px-6 py-3 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
              support.naukaripassport@gmail.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
