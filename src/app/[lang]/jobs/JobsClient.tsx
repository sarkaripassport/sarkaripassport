"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronDown, Building2, MapPin, Briefcase, GraduationCap, Filter, Bookmark, X } from "lucide-react";
import JobCard from "@/components/JobCard";
import type { Job, Category } from "@/lib/db";
import { Locale } from "@/i18n/getDictionary";

export default function JobsClient({ jobs, categories, lang, dict, pageTitle, pagePath }: { jobs: Job[], categories: Category[], lang: Locale, dict: any, pageTitle?: string, pagePath?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("cat") || "all");
  
  // New dynamic filter states
  const [selectedQual, setSelectedQual] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all"); // e.g. "Live" or "all"
  const [sortBy, setSortBy] = useState<string>("Latest");

  // Pagination
  const ITEMS_PER_PAGE = Number(process.env.NEXT_PUBLIC_JOBS_PER_PAGE) || 12;
  const currentPage = Number(searchParams.get("page")) || 1;

  // Update state if URL changes externally
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchParams.get("q") || "");
      setSelectedCategory(searchParams.get("cat") || "all");
    }, 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    updateURL(searchQuery, slug);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL(searchQuery, selectedCategory);
  };

  const updateURL = (q: string, cat: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat && cat !== "all") params.set("cat", cat);
    
    router.push(`/${lang}/jobs?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedQual("all");
    setSelectedState("all");
    setSelectedType("all");
    setSortBy("Latest");
    router.push(`/${lang}/jobs`, { scroll: false });
  };

  // Filter and Sort Jobs
  const filteredJobs = jobs.filter(j => {
    // Category match
    const catName = categories.find(c => c.slug === selectedCategory)?.name.en;
    const matchesCat = selectedCategory === "all" ? true : (
      j.category === catName || j.categories?.includes(catName || "")
    );
    
    // Search match
    const matchesSearch = searchQuery ? (j.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) || j.organization[lang].toLowerCase().includes(searchQuery.toLowerCase())) : true;
    
    // Qualification match (checks quick_facts if available)
    const matchesQual = selectedQual === "all" ? true : (j.quick_facts?.qualification[lang]?.toLowerCase().includes(selectedQual.toLowerCase()) || false);
    
    // State/Location match
    const matchesState = selectedState === "all" ? true : (j.quick_facts?.job_location[lang]?.toLowerCase().includes(selectedState.toLowerCase()) || false);
    
    // Type match (Live vs All)
    const matchesType = selectedType === "all" ? true : (selectedType === "Live" ? j.isLive : true);

    return matchesCat && matchesSearch && matchesQual && matchesState && matchesType;
  }).sort((a, b) => {
    if (sortBy === "Ending Soon") {
      return (a.daysLeft || 999) - (b.daysLeft || 999);
    }
    if (sortBy === "Most Vacancies") {
      const vA = parseInt(a.quick_facts?.vacancies.replace(/,/g, '') || "0");
      const vB = parseInt(b.quick_facts?.vacancies.replace(/,/g, '') || "0");
      return vB - vA;
    }
    // Default: Latest
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getCount = (catName: string) => jobs.filter(j => j.category === catName || j.categories?.includes(catName)).length;
  const quickCategories = categories.filter(c => c.isQuickLink).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const activeFiltersCount = (selectedQual !== "all" ? 1 : 0) + (selectedState !== "all" ? 1 : 0) + (selectedType !== "all" ? 1 : 0);

  return (
    <div className="bg-[#F4F7FA] min-h-screen pt-2 pb-6 lg:pt-4 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Title */}
        <div className="mb-3 lg:mb-4">
          <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 sm:gap-2 font-medium mb-1">
            <Link href={`/${lang}`} className="hover:text-[#0A58CA] transition-colors">{dict.navigation.home}</Link>
            <ChevronDown className="w-3 h-3 -rotate-90 text-gray-400" />
            <span className="text-[#0A58CA] font-bold">{pagePath || "Jobs"}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B1B3D] tracking-tight">{pageTitle || dict.home.viewAllJobs}</h1>
            
            {/* Mobile Sidebar Toggle (Inline) */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden bg-white border border-gray-200 rounded-lg p-2 flex items-center gap-2 font-bold text-[#0B1B3D] shadow-sm active:scale-[0.99] transition-transform"
            >
              <Filter className="w-4 h-4 text-[#0A58CA]" />
              <span className="text-sm hidden sm:inline-block">Filters</span>
              {activeFiltersCount > 0 && <span className="bg-[#0A58CA] text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">{activeFiltersCount}</span>}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

          {/* Left Sidebar */}
          <div className={`w-full lg:w-[300px] shrink-0 space-y-6 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            
            {/* Filter Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-black text-[#0B1B3D] text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#0A58CA]" /> Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button onClick={handleReset} className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md transition-colors">
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by post name..." 
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all text-[#0B1B3D] font-medium" 
                />
              </form>

              <div className="space-y-5 mb-6">
                
                {/* Qualification Filter */}
                <div className="space-y-2.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-gray-400" /> Qualification
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedQual}
                      onChange={(e) => setSelectedQual(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0B1B3D] font-bold outline-none focus:ring-2 focus:ring-[#0A58CA] transition-all cursor-pointer appearance-none shadow-sm hover:border-gray-300"
                    >
                      <option value="all">Any Qualification</option>
                      <option value="10th">10th Pass</option>
                      <option value="12th">12th Pass</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Post Graduate">Post Graduate</option>
                      <option value="Diploma">Diploma / ITI</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
                
                {/* State Filter */}
                <div className="space-y-2.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" /> State
                  </label>
                  <div className="relative">
                    <select 
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-[#0B1B3D] font-bold outline-none focus:ring-2 focus:ring-[#0A58CA] transition-all cursor-pointer appearance-none shadow-sm hover:border-gray-300"
                    >
                      <option value="all">All India (Any State)</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Bihar">Bihar</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Job Type Filter */}
                <div className="space-y-2.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Job Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => setSelectedType("all")} 
                      className={`py-2 rounded-lg text-xs font-bold transition-colors border ${selectedType === "all" ? "bg-[#0B1B3D] text-white border-[#0B1B3D]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      All Jobs
                    </button>
                    <button 
                      onClick={() => setSelectedType("Live")} 
                      className={`py-2 rounded-lg text-xs font-bold transition-colors border ${selectedType === "Live" ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span></span>
                        Live Now
                      </span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Browse by Category Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] p-6 hidden lg:block">
              <h3 className="font-black text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0A58CA]" /> Departments
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button 
                    onClick={() => handleCategorySelect("all")} 
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === "all" ? "bg-blue-50 text-[#0A58CA] font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}
                  >
                    <span className="flex items-center gap-3">
                      <Bookmark className={`w-4 h-4 ${selectedCategory === "all" ? "text-[#0A58CA]" : "text-gray-400"}`} />
                      All Categories
                    </span>
                  </button>
                </li>
                {quickCategories.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => handleCategorySelect(item.slug)} 
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === item.slug ? "bg-blue-50 text-[#0A58CA] font-bold" : "text-gray-600 hover:bg-gray-50 font-medium"}`}
                    >
                      <span className="flex items-center gap-3">
                        <Bookmark className={`w-4 h-4 ${selectedCategory === item.slug ? "text-[#0A58CA]" : "text-gray-400"}`} />
                        {item.name[lang]}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedCategory === item.slug ? "bg-[#0A58CA] text-white" : "bg-gray-100 text-gray-500"}`}>
                        {jobs.filter(j => j.category === item.name.en || j.categories?.includes(item.name.en)).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-5">
            
            {/* Sort & Category Dropdowns (Small) */}
            <div className="flex justify-end gap-2">
              <div className="relative inline-block lg:hidden">
                <select 
                  value={selectedCategory}
                  onChange={(e) => handleCategorySelect(e.target.value)}
                  className="pl-2 pr-6 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-[#0B1B3D] outline-none focus:ring-1 focus:ring-[#0A58CA] appearance-none cursor-pointer shadow-sm max-w-[120px] truncate"
                >
                  <option value="all">All Categories</option>
                  {quickCategories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name[lang]}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1.5 pointer-events-none" />
              </div>
              <div className="relative inline-block">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-2 pr-6 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-[#0B1B3D] outline-none focus:ring-1 focus:ring-[#0A58CA] appearance-none cursor-pointer shadow-sm"
                >
                  <option value="Latest">Latest Updates</option>
                  <option value="Ending Soon">Ending Soon</option>
                  <option value="Most Vacancies">Most Vacancies</option>
                </select>
                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-1.5 pointer-events-none" />
              </div>
            </div>

            {/* Jobs Grid */}
            <div className="relative">
              {filteredJobs.length === 0 ? (
                <div className="bg-white py-16 px-6 text-center rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-black text-[#0B1B3D] mb-2">
                    {activeFiltersCount === 0 && selectedCategory !== 'all' && !searchQuery 
                      ? "No updates found" 
                      : "No exact matches found"}
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
                    {activeFiltersCount === 0 && selectedCategory !== 'all' && !searchQuery 
                      ? "We couldn't find any recent jobs or updates for this category right now."
                      : "We couldn't find any jobs matching all your current filters. Try removing some filters to see more results."}
                  </p>
                  <button onClick={handleReset} className="px-6 py-3 bg-[#0B1B3D] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md flex items-center gap-2">
                    {activeFiltersCount === 0 && selectedCategory !== 'all' && !searchQuery 
                      ? "Browse All Jobs"
                      : <><X className="w-4 h-4" /> Clear All Filters</>}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {currentJobs.map((job, index) => (
                    <JobCard 
                      key={job.id} 
                      title={job.title[lang] || job.title.en || 'Untitled Job'}
                      org={job.organization[lang] || job.organization.en || 'Unknown Organization'}
                      qual={job.quick_facts?.qualification?.[lang] || job.quick_facts?.qualification?.en}
                      vac={job.quick_facts?.vacancies || '-'}
                      date={job.quick_facts?.last_date[lang] || '-'}
                      status={job.status}
                      statusColor={job.statusColor}
                      isLive={job.isLive}
                      isTrending={job.isTrending}
                      daysLeft={job.daysLeft}
                      link={`/${lang}/jobs/${job.slug}`}
                      logoUrl={job.logo_url}
                      logoAlt={job.logo_alt?.[lang] || job.logo_alt?.en || job.organization[lang] || job.organization.en || 'Logo'}
                      lang={lang as any}
                      priority={index < 6}
                      labels={{
                        trending: dict.home.trending,
                        daysLeft: dict.home.daysLeft,
                        lastDate: dict.job.lastDate,
                        details: dict.job.vacancyDetails.split(' ')[1] || 'Details',
                        applyNow: dict.job.applyNow
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-xl mt-6 shadow-sm">
                {currentPage > 1 ? (
                  <Link
                    href={`/${lang}/jobs?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(Math.max(1, currentPage - 1)) }).toString()}`}
                    scroll={false}
                    className="px-3 py-1 text-sm font-bold border border-gray-200 rounded-md text-[#0B1B3D] hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </Link>
                ) : (
                  <button disabled className="px-3 py-1 text-sm font-bold border border-gray-200 rounded-md disabled:opacity-50 text-[#0B1B3D]">
                    Previous
                  </button>
                )}
                
                <span className="text-sm font-bold text-gray-500">
                  Page <span className="text-[#0A58CA]">{currentPage}</span> of {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/${lang}/jobs?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: String(Math.min(totalPages, currentPage + 1)) }).toString()}`}
                    scroll={false}
                    className="px-3 py-1 text-sm font-bold border border-gray-200 rounded-md text-[#0B1B3D] hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </Link>
                ) : (
                  <button disabled className="px-3 py-1 text-sm font-bold border border-gray-200 rounded-md disabled:opacity-50 text-[#0B1B3D]">
                    Next
                  </button>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
