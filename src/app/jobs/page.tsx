"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ChevronDown, Building2, MapPin, Briefcase, GraduationCap, Users, Shield, Landmark, Train, Monitor, Bookmark, MessageCircle, Filter } from "lucide-react";

export default function JobsListingPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-[#F4F7FA] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-2">Latest Jobs</h1>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
            <ChevronDown className="w-3 h-3 -rotate-90" />
            <span className="text-gray-900 font-medium">Latest Jobs</span>
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
                  { title: "SSC CGL 2026", org: "Staff Selection Commission", qual: "Graduate", vac: "12,256", date: "24 Jun 2026", status: "New", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "MSC Bank Bharti 2026", org: "Maharashtra State Co-op Bank", qual: "Graduate", vac: "175", date: "30 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "AFCAT 02/2026", org: "Indian Air Force", qual: "Graduate", vac: "-", date: "15 Jul 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "MPPSC Group B & C", org: "Madhya Pradesh Public Service Commission", qual: "Graduate", vac: "385", date: "20 Jul 2026", status: "Last Date Near", color: "text-[#E37400] bg-[#FEF7E0]" },
                  { title: "IB ACIO Grade-II", org: "Intelligence Bureau", qual: "Graduate", vac: "995", date: "12 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "RRB Technician 2026", org: "Railway Recruitment Board", qual: "10th Pass/ITI", vac: "9,144", date: "28 Jun 2026", status: "New", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "UP Police Constable 2026", org: "Uttar Pradesh Police", qual: "12th Pass", vac: "60,244", date: "25 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "IOCL Apprentice 2026", org: "Indian Oil Corporation", qual: "Graduate/Diploma", vac: "2,470", date: "15 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "BSF Constable Tradesman", org: "Border Security Force", qual: "10th Pass", vac: "3,588", date: "22 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                  { title: "DRDO CEPTAM 10 2026", org: "DRDO", qual: "ITI/Diploma", vac: "1,904", date: "18 Jun 2026", status: "Active", color: "text-[#1E8E3E] bg-[#E6F4EA]" },
                ];

                return (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 font-bold">Post Name</th>
                            <th className="px-6 py-4 font-bold">Organization</th>
                            <th className="px-6 py-4 font-bold">Qualification</th>
                            <th className="px-6 py-4 font-bold text-center">Vacancies</th>
                            <th className="px-6 py-4 font-bold text-center">Last Date</th>
                            <th className="px-6 py-4 font-bold text-center">Status</th>
                            <th className="px-6 py-4 font-bold text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {jobsList.map((job, i) => (
                            <tr key={i} className="hover:bg-gray-50 group">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex flex-shrink-0 items-center justify-center p-1">
                                    <Building2 className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-[#0B1B3D] flex items-center gap-2">
                                      {job.title}
                                      {job.status === 'New' && <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded">New</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-gray-600 max-w-[200px] truncate">{job.org}</td>
                              <td className="px-6 py-5">
                                <span className={`text-xs font-semibold ${job.qual.includes('Graduate') ? 'text-purple-600' : 'text-pink-600'}`}>{job.qual}</span>
                              </td>
                              <td className="px-6 py-5 text-center font-bold text-gray-800">{job.vac}</td>
                              <td className="px-6 py-5 text-center text-gray-600">{job.date}</td>
                              <td className="px-6 py-5 text-center">
                                <span className={`px-2 py-1 text-[11px] font-bold rounded ${job.color}`}>{job.status}</span>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center justify-center gap-2">
                                  <Link href={`/jobs/slug-${i}`} className="px-4 py-2 text-xs font-bold text-[#0A58CA] border border-blue-200 rounded-lg hover:bg-blue-50">View Details</Link>
                                  <button className="px-4 py-2 text-xs font-bold text-white bg-[#0A58CA] rounded-lg hover:bg-blue-700 shadow-md">Check Eligibility</button>
                                  <button className="p-2 text-gray-400 hover:text-[#0B1B3D] border border-gray-200 rounded-lg hover:bg-gray-50"><Bookmark className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden flex flex-col divide-y divide-gray-100">
                      {jobsList.map((job, i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 transition-colors">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-[#0B1B3D] text-base leading-tight mb-1">{job.title}</h3>
                              <p className="text-xs text-gray-500 font-medium">{job.org}</p>
                            </div>
                            <span className={`shrink-0 px-2 py-1 text-[10px] font-bold rounded ${job.color}`}>{job.status}</span>
                          </div>
                          
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4 mt-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Qualification</p>
                              <p className={`text-xs font-bold ${job.qual.includes('Graduate') ? 'text-purple-600' : 'text-pink-600'}`}>{job.qual}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Vacancies</p>
                              <p className="text-xs font-bold text-gray-800">{job.vac}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Last Date</p>
                              <p className="text-xs font-bold text-red-600">{job.date}</p>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button className="w-full py-2.5 text-xs font-bold text-white bg-[#0A58CA] rounded-lg hover:bg-blue-700 shadow-md">Check Eligibility</button>
                            <div className="flex gap-2">
                              <Link href={`/jobs/slug-${i}`} className="flex-1 flex items-center justify-center py-2.5 text-xs font-bold text-[#0A58CA] border border-blue-200 rounded-lg hover:bg-blue-50">View Details</Link>
                              <button className="p-2.5 flex items-center justify-center text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"><Bookmark className="w-4 h-4" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
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
