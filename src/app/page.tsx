import Link from "next/link";
import { Search, MapPin, Briefcase, GraduationCap, Calendar, CheckCircle2, Building2, Bookmark, ChevronRight, FileText, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Emblem for Trust & Authenticity spanning the whole section */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')] bg-no-repeat bg-center bg-cover sm:bg-contain"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-4/5 space-y-4">
            <div className="inline-flex items-center gap-2 px-2 py-1 bg-blue-50 text-[#0A58CA] text-xs font-bold rounded-full border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> India's Trusted Government Job Portal
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0B1B3D] tracking-tight">
              Latest Government Jobs, Results, Admit Cards & Eligibility Updates
            </h1>
            <p className="text-base text-gray-600 max-w-xl">
              Find verified Sarkari job updates and check your eligibility with Naukri Passport.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Link href="/jobs" className="px-4 py-2 text-sm bg-[#0A58CA] text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">
                Latest Jobs
              </Link>
              <button className="px-4 py-2 text-sm bg-white text-[#0B1B3D] border border-gray-300 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 transition">
                <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span> Create Profile
              </button>
              <button className="px-4 py-2 text-sm bg-white text-[#0B1B3D] border border-gray-300 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 transition">
                <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Check Eligibility
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-8 pb-16">
        
        {/* Advanced Search Bar */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by job title, keyword..." 
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A58CA]"
            />
            <button className="absolute right-1.5 top-1.5 px-4 py-1 text-sm bg-[#0A58CA] text-white font-bold rounded-md hover:bg-blue-700 transition-colors">
              Search
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Qualification</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>State</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Department</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Job Type</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Last Date</option></select>
          </div>
        </div>

        {/* Quick Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { n: 'Latest Jobs', v: '128', icon: Briefcase, c: 'text-blue-600' },
            { n: 'Admit Card', v: '42', icon: FileText, c: 'text-green-600' },
            { n: 'Results', v: '31', icon: Award, c: 'text-red-500' },
            { n: 'Answer Key', v: '26', icon: CheckCircle2, c: 'text-orange-500' },
            { n: 'Syllabus', v: '57', icon: GraduationCap, c: 'text-purple-600' },
            { n: 'Admission', v: '18', icon: Building2, c: 'text-teal-600' },
            { n: 'Maharashtra Jobs', v: '64', icon: MapPin, c: 'text-pink-600' },
            { n: 'Central Govt. Jobs', v: '92', icon: Building2, c: 'text-indigo-600' }
          ].map((cat, i) => (
            <div key={i} className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:shadow-md transition">
              <cat.icon className={`w-5 h-5 mb-1 ${cat.c}`} />
              <span className="text-[11px] leading-tight font-bold text-[#0B1B3D]">{cat.n}</span>
              <span className="text-sm font-black text-gray-800">{cat.v}</span>
            </div>
          ))}
        </div>

        {/* Latest Jobs Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#0B1B3D]">Latest Jobs</h2>
            <Link href="/jobs" className="text-sm font-bold text-[#0A58CA] hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 font-bold">Post Name</th>
                  <th className="px-6 py-3 font-bold text-center">Vacancies</th>
                  <th className="px-6 py-3 font-bold text-center">Last Date</th>
                  <th className="px-6 py-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { title: "SSC CGL 2026", vac: "12,256", date: "24 Jun 2026" },
                  { title: "MSC Bank Bharti 2026", vac: "175", date: "30 Jun 2026" },
                  { title: "AFCAT 02/2026", vac: "-", date: "15 Jul 2026" },
                  { title: "MPPSC Group B & C", vac: "385", date: "20 Jul 2026" },
                  { title: "IB ACIO Grade-II", vac: "995", date: "12 Jun 2026" },
                ].map((job, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-[#0B1B3D]">{job.title}</td>
                    <td className="px-6 py-4 text-center font-semibold text-gray-800">{job.vac}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{job.date}</td>
                    <td className="px-6 py-4 flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-[#0A58CA] border border-blue-200 rounded hover:bg-blue-50">View Details</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-white bg-[#0A58CA] rounded hover:bg-blue-700">Check Eligibility</button>
                      <button className="p-1.5 text-gray-400 hover:text-[#0B1B3D] border border-gray-200 rounded"><Bookmark className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4-Column Grid for Updates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Latest Admit Cards", items: ["RRB ALP Admit Card 2026", "SSC CHSL Admit Card 2026", "IB ACIO Admit Card 2026", "UP Police Constable Admit Card"] },
            { title: "Latest Results", items: ["SSC GD Result 2026", "UP Police Constable Result", "IB Security Assistant Result", "Railway Group D Result"] },
            { title: "Latest Answer Keys", items: ["SSC GD Answer Key 2026", "RRB NTPC Answer Key 2026", "SSC CHSL Answer Key 2026", "UP Police Constable Answer Key"] },
            { title: "Latest Syllabus", items: ["UPSC CSE Syllabus 2026", "MPSC Group B Syllabus", "SSC CGL Tier 1 Syllabus", "IBPS PO Syllabus 2026"] }
          ].map((col, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                <h3 className="font-bold text-[#0B1B3D]">{col.title}</h3>
                <Link href="#" className="text-xs font-bold text-[#0A58CA] hover:underline">View All</Link>
              </div>
              <ul className="space-y-3">
                {col.items.map((item, j) => (
                  <li key={j} className="flex justify-between items-start gap-2">
                    <Link href="#" className="text-sm text-gray-700 hover:text-[#0A58CA] hover:underline leading-tight">{item}</Link>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">20 May 2026</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trending Categories */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-[#0B1B3D] mb-4">Trending Categories</h3>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            {['SSC', 'Railway', 'Bank', 'Police', 'Defence', 'UPSC', 'MPSC', 'Teaching', 'PSU', '10th Pass', '12th Pass', 'Graduate'].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:border-[#0A58CA] group-hover:bg-blue-50 transition">
                  <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
                </div>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0B1B3D]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Banner CTA */}
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
              <FileText className="w-10 h-10 text-[#0A58CA]" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#0B1B3D] mb-1">Confused whether you are eligible?</h3>
              <p className="text-gray-600">Create your Naukri Passport profile once and check your eligibility for every job instantly.</p>
            </div>
          </div>
          <button className="px-8 py-3 bg-[#0A58CA] text-white font-bold rounded-lg whitespace-nowrap shadow-md shadow-blue-500/20 hover:bg-blue-700 relative z-10">
            Create Free Profile
          </button>
        </div>

      </main>

    </div>
  );
}
