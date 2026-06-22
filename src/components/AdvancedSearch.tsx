'use client';

import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function AdvancedSearch() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
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
  );
}
