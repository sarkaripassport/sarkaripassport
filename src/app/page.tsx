"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, MapPin, Briefcase, GraduationCap, Calendar, CheckCircle2, Building2, Bookmark, ChevronRight, FileText, Award, Filter, ChevronDown } from "lucide-react";

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-gray-800">

      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Background Emblem for Trust & Authenticity spanning the whole section */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')] bg-no-repeat bg-center bg-cover sm:bg-contain"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-4/5 space-y-4">
            <h1 className="flex items-center flex-wrap gap-3 text-lg md:text-xl lg:text-2xl font-extrabold text-[#0B1B3D] tracking-tight">
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Latest Government Jobs, Results, Admit Cards & Eligibility Updates
            </h1>
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
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="md:hidden w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-gray-600 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Filter className="w-4 h-4" /> Advanced Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          <div className={`grid-cols-2 md:grid-cols-5 gap-3 ${isFilterOpen ? 'grid' : 'hidden md:grid'}`}>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Qualification</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>State</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Department</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Job Type</option></select>
            <select className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 outline-none"><option>Last Date</option></select>
          </div>
        </div>

        {/* Quick Category Cards */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
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
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-2 sm:p-4 text-center hover:border-[#0A58CA] hover:shadow-md transition-all cursor-pointer">
              <cat.icon className={`w-5 h-5 sm:w-8 sm:h-8 mx-auto mb-1.5 sm:mb-2 ${cat.c}`} />
              <div className="font-bold text-gray-900 text-[10px] sm:text-sm mb-0.5 sm:mb-1 leading-tight break-words">{cat.n}</div>
              <div className="font-extrabold text-sm sm:text-xl text-gray-800">{cat.v}</div>
            </div>
          ))}
        </div>

        {/* Latest Jobs Table Exact Copy - with Live & Embossed Effects */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] mt-6 overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 drop-shadow-sm">Latest Jobs</h2>
            <Link href="/jobs" className="text-sm font-semibold text-[#0A58CA] hover:text-blue-700 hover:underline transition-colors">View All</Link>
          </div>
          
          {(() => {
            const latestJobsList = [
              { title: "SSC CGL 2026", vac: "12,256", date: "24 Jun 2026", status: "New", statusColor: "text-green-800 bg-green-100 border border-green-200 shadow-sm", isLive: true },
              { title: "MSC Bank Bharti 2026", vac: "175", date: "30 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200 shadow-sm", isLive: true },
              { title: "AFCAT 02/2026", vac: "-", date: "15 Jul 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200 shadow-sm", isLive: true },
              { title: "MPPSC Group B & C", vac: "385", date: "20 Jul 2026", status: "Last Date Near", statusColor: "text-amber-800 bg-amber-100 border border-amber-200 shadow-sm", isLive: false },
              { title: "IB ACIO Grade-II", vac: "995", date: "12 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200 shadow-sm", isLive: true },
            ];

            return (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-xs text-gray-800 font-bold bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 whitespace-nowrap">Post Name</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Vacancies</th>
                        <th className="px-4 py-3 whitespace-nowrap text-center">Last Date</th>
                        <th className="px-4 py-3 whitespace-nowrap">Status</th>
                        <th className="px-4 py-3 whitespace-nowrap text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {latestJobsList.map((job, i) => (
                        <tr key={i} className="group hover:bg-blue-50/40 text-gray-800 font-semibold bg-white transition-all duration-200">
                          <td className="px-4 py-3.5 group-hover:text-[#0A58CA] transition-colors">{job.title}</td>
                          <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{job.vac}</td>
                          <td className="px-4 py-3.5 text-center text-gray-600 font-medium">{job.date}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${job.statusColor}`}>
                              {job.isLive && (
                                <span className="relative flex h-1.5 w-1.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                                </span>
                              )}
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 flex items-center justify-end gap-2">
                            <button className="px-3 py-1.5 text-[11px] font-bold text-[#0A58CA] border border-[#0A58CA] rounded shadow-sm bg-white hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all whitespace-nowrap">
                              View Details
                            </button>
                            <button className="px-3 py-1.5 text-[11px] font-bold text-white bg-gradient-to-b from-[#0A58CA] to-blue-700 border border-blue-800 rounded shadow-[0_2px_4px_rgba(10,88,202,0.3)] hover:shadow-[0_4px_8px_rgba(10,88,202,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner transition-all whitespace-nowrap">
                              Check Eligibility
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden flex flex-col divide-y divide-gray-100">
                  {latestJobsList.map((job, i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-bold text-[#0B1B3D] text-[13px] leading-tight flex-1">{job.title}</h3>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold tracking-wide ${job.statusColor}`}>
                          {job.isLive && (
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                            </span>
                          )}
                          {job.status}
                        </span>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded border border-gray-100 mb-3">
                        <div className="text-center flex-1 border-r border-gray-200">
                          <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Vacancies</p>
                          <p className="text-[11px] font-bold text-gray-800">{job.vac}</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Last Date</p>
                          <p className="text-[11px] font-bold text-red-600">{job.date}</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 text-[10px] font-bold text-[#0A58CA] border border-blue-200 rounded shadow-sm bg-white hover:bg-blue-50 transition-colors">
                          View Details
                        </button>
                        <button className="flex-1 py-2 text-[10px] font-bold text-white bg-gradient-to-b from-[#0A58CA] to-blue-700 border border-blue-800 rounded shadow-sm hover:shadow-md transition-colors">
                          Check Eligibility
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
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
