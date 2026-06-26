"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, Edit, Trash2, Filter, ChevronDown, CheckCircle2, Clock } from "lucide-react";
import type { Job, Category } from "@/lib/db";
import { deleteJobAction } from "./actions";

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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      setIsDeleting(id);
      try {
        const result = await deleteJobAction(id);
        if (result.success) {
          setJobs(jobs.filter(j => j.id !== id));
        } else {
          alert(result.message);
        }
      } catch (e) {
        alert("An error occurred while deleting.");
      }
      setIsDeleting(null);
    }
  };

  // Filtering Logic
  const filteredJobs = jobs.filter(job => {
    // Category Filter
    const matchesCategory = categoryFilter === "all" ? true : (
      job.category === categoryFilter || job.categories?.includes(categoryFilter)
    );
    
    // Search Filter
    const matchesSearch = searchQuery 
      ? job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.organization.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
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
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
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

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="p-4 font-bold">Job Title & Organization</th>
              <th className="p-4 font-bold">Categories</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Updated At</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredJobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No jobs found matching your filters.
                </td>
              </tr>
            ) : (
              filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-blue-50/50 transition group">
                  <td className="p-4">
                    <div className="font-bold text-[#0B1B3D] mb-1 line-clamp-1">{job.title}</div>
                    <div className="text-gray-500 text-xs">{job.organization}</div>
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
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${job.statusColor}`}>
                      {job.isLive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {job.status}
                    </span>
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
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link 
                        href={`/admin/editor?id=${job.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(job.id, job.title)}
                        disabled={isDeleting === job.id}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition disabled:opacity-50"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
