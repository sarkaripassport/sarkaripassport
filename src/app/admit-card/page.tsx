"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ChevronDown, Building2, MapPin, Briefcase, GraduationCap, Users, Shield, Landmark, Train, Monitor, Bookmark, MessageCircle, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";

export default function AdmitCardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F4F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Admit Card</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-gray-900 font-medium">Admit Card</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between font-bold text-[#0B1B3D] shadow-sm active:scale-[0.99] transition-transform"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#0A58CA]" />
              Search Filters & Categories
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Left Sidebar */}
          <div className={`w-full lg:w-[280px] shrink-0 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            
            {/* Filter Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-[#0B1B3D] mb-4">Search & Filter Jobs</h3>
              
              <div className="relative mb-6">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input type="text" placeholder="Search by post name, organization, keyword..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0A58CA]" />
              </div>

              <div className="space-y-3 mb-6">
                {['Qualification', 'State', 'Department', 'Job Type', 'Last Date'].map((filter, i) => (
                  <button key={i} className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition">
                    <span className="flex items-center gap-2">
                      {i === 0 && <GraduationCap className="w-4 h-4 text-gray-400" />}
                      {i === 1 && <MapPin className="w-4 h-4 text-gray-400" />}
                      {i === 2 && <Building2 className="w-4 h-4 text-gray-400" />}
                      {i === 3 && <Briefcase className="w-4 h-4 text-gray-400" />}
                      {i === 4 && <Search className="w-4 h-4 text-gray-400" />}
                      {filter}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition">Reset</button>
                <button className="flex-1 py-2.5 bg-[#0A58CA] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-md">Apply Filters</button>
              </div>
            </div>

            {/* Browse by Category Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-[#0B1B3D] mb-4">Browse by Category</h3>
              <ul className="space-y-1">
                {[
                  { n: 'Central Govt. Jobs', c: '92', icon: Landmark, color: 'text-indigo-600' },
                  { n: 'State Govt. Jobs', c: '64', icon: MapPin, color: 'text-green-600' },
                  { n: 'Bank Jobs', c: '37', icon: Building2, color: 'text-blue-600' },
                  { n: 'Defence Jobs', c: '28', icon: Shield, color: 'text-orange-600' },
                  { n: 'Teaching Jobs', c: '26', icon: GraduationCap, color: 'text-red-600' },
                  { n: 'Railway Jobs', c: '24', icon: Train, color: 'text-teal-600' },
                  { n: 'Police Jobs', c: '20', icon: Shield, color: 'text-amber-600' },
                  { n: 'PSU Jobs', c: '18', icon: Building2, color: 'text-pink-600' },
                  { n: 'Others', c: '13', icon: Briefcase, color: 'text-gray-500' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="flex items-center justify-between py-2 text-sm text-gray-600 hover:text-[#0A58CA] group">
                      <span className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                        {item.n}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">{item.c}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 bg-gradient-to-br from-white to-green-50">
              <h3 className="font-bold text-[#0B1B3D] mb-2">Get job alerts on WhatsApp</h3>
              <p className="text-xs text-gray-600 mb-4">Never miss any government job updates</p>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#25D366] text-white text-sm font-bold rounded-lg hover:bg-[#128C7E] transition shadow-md">
                <MessageCircle className="w-4 h-4" /> Join Now
              </button>
            </div>

          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-4">
            
            {/* Tabs and Sort */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex overflow-x-auto hide-scrollbar">
                <button className="px-5 py-2.5 text-sm font-bold text-[#0A58CA] border-b-2 border-[#0A58CA] whitespace-nowrap">All Jobs <span className="text-xs text-blue-400 ml-1">1281</span></button>
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0B1B3D] whitespace-nowrap">Central Govt. <span className="text-xs text-gray-400 ml-1">481</span></button>
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0B1B3D] whitespace-nowrap">State Govt. <span className="text-xs text-gray-400 ml-1">372</span></button>
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0B1B3D] whitespace-nowrap">Banking <span className="text-xs text-gray-400 ml-1">181</span></button>
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0B1B3D] whitespace-nowrap">Defence <span className="text-xs text-gray-400 ml-1">123</span></button>
                <button className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-[#0B1B3D] whitespace-nowrap">Others <span className="text-xs text-gray-400 ml-1">124</span></button>
              </div>
              <div className="flex items-center gap-2 px-3 shrink-0">
                <span className="text-xs text-gray-500">Sort by:</span>
                <select className="text-sm font-bold text-[#0B1B3D] outline-none bg-transparent cursor-pointer">
                  <option>Latest</option>
                  <option>Ending Soon</option>
                  <option>Most Vacancies</option>
                </select>
              </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {(() => {
                const jobsList = [
                  { slug: "ssc-cgl-2026", title: "SSC CGL 2026", org: "Staff Selection Commission", qual: "Graduate", vac: "12,256", date: "24 Jun 2026", status: "New", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: true, daysLeft: 2 },
                  { slug: "msc-bank-2026", title: "MSC Bank Bharti 2026", org: "Maharashtra State Co-op Bank", qual: "Graduate", vac: "175", date: "30 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: false, daysLeft: 8 },
                  { slug: "afcat-02-2026", title: "AFCAT 02/2026", org: "Indian Air Force", qual: "Graduate", vac: "-", date: "15 Jul 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: true, daysLeft: 23 },
                  { slug: "mppsc-group-b-c", title: "MPPSC Group B & C", org: "Madhya Pradesh Public Service Commission", qual: "Graduate", vac: "385", date: "20 Jul 2026", status: "Last Date Near", statusColor: "text-amber-800 bg-amber-100 border border-amber-200", isLive: false, isTrending: false, daysLeft: 4 },
                  { slug: "ib-acio-grade-ii", title: "IB ACIO Grade-II", org: "Intelligence Bureau", qual: "Graduate", vac: "995", date: "12 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: false, daysLeft: 20 },
                  { slug: "rrb-technician-2026", title: "RRB Technician 2026", org: "Railway Recruitment Board", qual: "10th Pass/ITI", vac: "9,144", date: "28 Jun 2026", status: "New", statusColor: "text-blue-800 bg-blue-100 border border-blue-200", isLive: true, isTrending: true, daysLeft: 6 },
                  { slug: "up-police-constable-2026", title: "UP Police Constable 2026", org: "Uttar Pradesh Police", qual: "12th Pass", vac: "60,244", date: "25 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: false, daysLeft: 3 },
                  { slug: "iocl-apprentice-2026", title: "IOCL Apprentice 2026", org: "Indian Oil Corporation", qual: "Graduate/Diploma", vac: "2,470", date: "15 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: false, daysLeft: 10 },
                  { slug: "bsf-constable-tradesman", title: "BSF Constable Tradesman", org: "Border Security Force", qual: "10th Pass", vac: "3,588", date: "22 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: false, daysLeft: 12 },
                  { slug: "drdo-ceptam-10-2026", title: "DRDO CEPTAM 10 2026", org: "DRDO", qual: "ITI/Diploma", vac: "1,904", date: "18 Jun 2026", status: "Active", statusColor: "text-green-800 bg-green-100 border border-green-200", isLive: true, isTrending: true, daysLeft: 18 },
                ];

                return (
                  <div className="p-4 sm:p-5 bg-gray-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {jobsList.map((job, i) => (
                        <JobCard key={i} {...job} link={`/jobs/${job.slug}`} />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Pagination */}
              <div className="p-4 border-t border-gray-100 flex items-center justify-center gap-1 text-sm">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0A58CA] text-white font-bold shadow-md">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium">2</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium">3</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium">4</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium">5</button>
                <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium">64</button>
                <button className="px-4 h-10 flex items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 font-medium ml-2">Next <ChevronDown className="w-4 h-4 -rotate-90 ml-1" /></button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

