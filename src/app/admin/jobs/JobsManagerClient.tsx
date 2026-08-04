"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, CheckCircle2, Clock, Copy, MessageSquare, Share2, Eye, EyeOff } from "lucide-react";
import type { Job, Category } from "@/lib/db";
import { deleteJobAction, deleteMultipleJobsAction, toggleJobLiveStatusAction } from "./actions";

export default function JobsManagerClient({ 
  initialJobs, 
  categories 
}: { 
  initialJobs: Job[], 
  categories: Category[] 
}) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "expired">("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);


  const isJobExpired = (job: Job) => {
    if (job.daysLeft !== undefined && job.daysLeft <= 0) return true;
    const dateStr = job.quick_facts?.last_date?.en;
    if (dateStr) {
      const parts = dateStr.split(/[\/-]/);
      let d: Date | null = null;
      if (parts.length === 3) {
        d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
      } else {
        d = new Date(dateStr);
      }
      if (d && !isNaN(d.getTime())) {
        return d.getTime() - new Date().getTime() <= 0;
      }
    }
    return false;
  };

  const handleToggleLive = async (id: string, currentIsLive: boolean) => {
    setIsToggling(id);
    try {
      const result = await toggleJobLiveStatusAction(id, !currentIsLive);
      if (result.success && result.isLive !== undefined) {
        setJobs(jobs.map(j => j.id === id ? { ...j, isLive: result.isLive! } : j));
      } else {
        alert(result.message);
      }
    } catch (e) {
      alert("An error occurred while changing visibility.");
    }
    setIsToggling(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      setIsDeleting(id);
      try {
        const result = await deleteJobAction(id);
        if (result.success) {
          setJobs(jobs.filter(j => j.id !== id));
          setSelectedJobIds(prev => prev.filter(selectedId => selectedId !== id));
        } else {
          alert(result.message);
        }
      } catch (e) {
        alert("An error occurred while deleting.");
      }
      setIsDeleting(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedJobIds(filteredJobs.map(j => j.id));
    } else {
      setSelectedJobIds([]);
    }
  };

  const handleToggleSelectJob = (id: string) => {
    setSelectedJobIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedJobIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedJobIds.length} selected job(s)? This action cannot be undone and will clean up all associated organization logos.`)) {
      setIsBulkDeleting(true);
      try {
        const result = await deleteMultipleJobsAction(selectedJobIds);
        if (result.success) {
          setJobs(jobs.filter(j => !selectedJobIds.includes(j.id)));
          setSelectedJobIds([]);
        } else {
          alert(result.message);
        }
      } catch (e) {
        alert("An error occurred while deleting selected jobs.");
      } finally {
        setIsBulkDeleting(false);
      }
    }
  };


  const generateWhatsAppMessage = (job: Job) => {
    const title = job.title.en;
    const org = job.organization.en;
    const salary = job.quick_facts?.salary?.en || 'As per norms';
    const lastDate = job.quick_facts?.last_date?.en || 'Check Website';
    const link = `https://govjobwala.com/en/jobs/${job.slug}`;

    const msg = `🚨 *NEW GOVERNMENT JOB ALERT* 🚨\n\n📌 *${title}*\n🏢 *Organization:* ${org}\n💰 *Salary:* ${salary}\n⏳ *Last Date:* ${lastDate}\n\n👉 *Apply Now & Full Details:* ${link}\n\n_Share with your friends and groups!_`;
    
    navigator.clipboard.writeText(msg).then(() => {
      alert("WhatsApp message copied to clipboard! Paste it in your groups.");
    }).catch(() => {
      alert("Failed to copy. Please try again.");
    });
  };

  // Filtering Logic
  const filteredJobs = jobs.filter(job => {
    // Category Filter
    const matchesCategory = categoryFilter === "all" ? true : (
      job.category === categoryFilter || job.categories?.includes(categoryFilter)
    );
    
    // Search Filter
    const matchesSearch = searchQuery 
      ? job.title.en.toLowerCase().includes(searchQuery.toLowerCase()) || job.organization.en.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Status Filter
    const matchesStatus = statusFilter === "all" ? true : (
      statusFilter === "published" ? (job.isLive === true && !isJobExpired(job)) :
      statusFilter === "draft" ? job.isLive === false :
      statusFilter === "expired" ? isJobExpired(job) : true
    );

    return matchesCategory && matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      
      {/* Action Bar */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by title or org..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A58CA] w-full sm:w-64"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A58CA] appearance-none bg-white w-full sm:w-48 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name.en}>{cat.name.en}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-2 text-sm font-medium transition ${statusFilter === 'all' ? 'bg-[#0A58CA] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("published")}
              className={`px-3 py-2 text-sm font-medium transition border-l border-gray-300 ${statusFilter === 'published' ? 'bg-[#0A58CA] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Published
            </button>
            <button 
              onClick={() => setStatusFilter("draft")}
              className={`px-3 py-2 text-sm font-medium transition border-l border-gray-300 ${statusFilter === 'draft' ? 'bg-[#0A58CA] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Drafts
            </button>
            <button 
              onClick={() => setStatusFilter("expired")}
              className={`px-3 py-2 text-sm font-medium transition border-l border-gray-300 ${statusFilter === 'expired' ? 'bg-rose-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Expired
            </button>
          </div>
        </div>

        {/* Add New Button */}
        <Link 
          href="/admin/editor" 
          className="bg-[#0A58CA] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm w-full md:w-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add New Job
        </Link>
      </div>

      {/* Floating Batch Action Banner */}
      {selectedJobIds.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B1B3D]">
            <span className="bg-[#0A58CA] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
              {selectedJobIds.length}
            </span>
            <span>{selectedJobIds.length === 1 ? 'job selected' : 'jobs selected'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              {isBulkDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Selected ({selectedJobIds.length})
                </>
              )}
            </button>
            <button
              onClick={() => setSelectedJobIds([])}
              className="text-xs text-gray-600 hover:text-gray-900 font-semibold px-2 py-1 cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={filteredJobs.length > 0 && filteredJobs.every(j => selectedJobIds.includes(j.id))}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-[#0A58CA] focus:ring-[#0A58CA] cursor-pointer"
                  title="Select All Visible Jobs"
                />
              </th>
              <th className="p-4 font-bold">Job Title & Organization</th>
              <th className="p-4 font-bold">Categories</th>
              <th className="p-4 font-bold">Author</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Comments</th>
              <th className="p-4 font-bold">Updated At</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  No jobs found matching your filters.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => {
                const isSelected = selectedJobIds.includes(job.id);
                return (
                  <tr key={job.id} className={`transition group ${isSelected ? 'bg-blue-50/80' : 'hover:bg-blue-50/50'}`}>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectJob(job.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#0A58CA] focus:ring-[#0A58CA] cursor-pointer"
                      />
                    </td>
                    <td className="p-4">

                    <div className="font-bold text-[#0B1B3D] mb-1 line-clamp-1">{job.title.en}</div>
                    <div className="text-gray-500 text-xs">{job.organization.en}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {job.categories && job.categories.length > 0 ? (
                        job.categories.map((cat, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {job.category || 'Uncategorized'}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-xs text-gray-700 font-medium">
                      {job.created_by ? job.created_by : <span className="text-gray-400 italic">Unknown</span>}
                    </div>
                    {job.last_edited_by && job.last_edited_by !== job.created_by && (
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Edited: {job.last_edited_by}
                      </div>
                    )}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-col items-start gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border ${
                        isJobExpired(job)
                          ? 'text-rose-700 bg-rose-50 border-rose-200'
                          : job.isLive
                          ? job.statusColor
                          : 'text-yellow-800 bg-yellow-100 border-yellow-200'
                      }`}>
                        {isJobExpired(job) ? (
                          <Clock className="w-3 h-3 text-rose-600" />
                        ) : job.isLive ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {isJobExpired(job) ? 'Expired' : job.isLive ? job.status : 'Draft'}
                      </span>
                      <button
                        onClick={() => handleToggleLive(job.id, job.isLive)}
                        disabled={isToggling === job.id}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold transition border shadow-xs ${
                          job.isLive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        } disabled:opacity-50`}
                        title={job.isLive ? "Click to hide from front end" : "Click to show on front end"}
                      >
                        {job.isLive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {job.isLive ? "Live (Hide)" : "Hidden (Show)"}
                      </button>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <Link 
                      href={`/admin/jobs/${job.slug}/comments`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      {job.comments?.length || 0}
                    </Link>
                  </td>

                  <td className="p-4">
                    <div className="text-gray-900 font-medium text-xs">
                      {new Date(job.updated_at || job.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className="text-gray-400 text-[10px]">
                      {new Date(job.updated_at || job.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </td>
                  
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => generateWhatsAppMessage(job)}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded transition"
                        title="Copy WhatsApp Forward Message"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <Link 
                        href={`/admin/editor?cloneId=${job.id}`}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded transition"
                        title="Clone Job (e.g. for Admit Card)"
                      >
                        <Copy className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/admin/editor?id=${job.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(job.id, job.title.en)}
                        disabled={isDeleting === job.id}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition disabled:opacity-50"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer (Placeholder) */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex justify-between items-center">
        <span>Showing {filteredJobs.length} jobs</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50">Next</button>
        </div>
      </div>

    </div>
  );
}
