"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ChevronDown, Building2, MapPin, Briefcase, GraduationCap, Users, Shield, Landmark, Train, Monitor, Bookmark, MessageCircle, Filter } from "lucide-react";
import JobCard from "@/components/JobCard";
import { Job } from "@/lib/db";

export default function JobsClient({ jobs }: { jobs: Job[] }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Jobs");

  const categories = ["All Jobs", "Latest Jobs", "Admit Card", "Result", "Answer Key", "Syllabus", "Admission"];

  const filteredJobs = selectedCategory === "All Jobs" 
    ? jobs 
    : jobs.filter(j => j.category === selectedCategory);

  return (
    <div className="bg-[#F4F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Browse Jobs</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-gray-900 font-medium">Jobs</span>
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
                <input type="text" placeholder="Search by post name, keyword..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0A58CA]" />
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
              <h3 className="font-bold text-[#0B1B3D] mb-4">Quick Categories</h3>
              <ul className="space-y-1">
                {[
                  { n: 'Latest Jobs', icon: Landmark, color: 'text-indigo-600' },
                  { n: 'Admit Card', icon: Bookmark, color: 'text-green-600' },
                  { n: 'Result', icon: Shield, color: 'text-blue-600' },
                  { n: 'Syllabus', icon: Briefcase, color: 'text-orange-600' },
                  { n: 'Admission', icon: GraduationCap, color: 'text-red-600' },
                ].map((item, i) => (
                  <li key={i}>
                    <button onClick={() => setSelectedCategory(item.n)} className="w-full flex items-center justify-between py-2 text-sm text-gray-600 hover:text-[#0A58CA] group text-left">
                      <span className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                        <span className={selectedCategory === item.n ? "font-bold text-[#0A58CA]" : ""}>{item.n}</span>
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600">
                        {jobs.filter(j => j.category === item.n).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-4">
            
            {/* Tabs and Sort */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex overflow-x-auto hide-scrollbar gap-1">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap rounded-md transition-colors ${
                      selectedCategory === cat 
                      ? 'text-[#0A58CA] bg-blue-50 font-bold border-b-2 border-[#0A58CA] rounded-b-none' 
                      : 'text-gray-600 hover:text-[#0B1B3D] hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
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
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-4 sm:p-5">
              {filteredJobs.length === 0 ? (
                <div className="py-12 text-center text-gray-500 font-medium">
                  No jobs found in this category.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {filteredJobs.map((job) => (
                    <JobCard 
                      key={job.id} 
                      title={job.title}
                      org={job.organization}
                      vac={job.quick_facts?.vacancies || '-'}
                      date={job.quick_facts?.last_date || '-'}
                      status={job.status}
                      statusColor={job.statusColor}
                      isLive={job.isLive}
                      isTrending={job.isTrending}
                      daysLeft={job.daysLeft}
                      link={`/jobs/${job.slug}`} 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
