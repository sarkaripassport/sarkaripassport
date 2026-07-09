'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, ChevronDown } from 'lucide-react';
import type { Category } from '@/lib/db';
import { Locale } from '@/i18n/getDictionary';

interface AdvancedSearchProps {
  lang: Locale;
  categories: Category[];
}

export default function AdvancedSearch({ lang, categories }: AdvancedSearchProps) {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  
  // Hardcoded for now until we expand DB schema
  const [qual, setQual] = useState('');
  const [state, setState] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (cat) params.set('cat', cat);
    if (qual) params.set('qual', qual);
    if (state) params.set('state', state);

    router.push(`/${lang}/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 sm:p-4 space-y-2 sm:space-y-3">
      <form onSubmit={handleSearch} className="relative flex flex-col gap-2 sm:gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
          <input 
            type="text" 
            aria-label="Search query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by job title, keyword..." 
            className="w-full pl-8 sm:pl-9 pr-24 py-1.5 sm:py-2 text-[11px] sm:text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A58CA]"
          />
          <button type="submit" className="absolute right-1 top-1 px-3 py-1 text-[11px] sm:text-sm bg-[#0A58CA] text-white font-bold rounded-md hover:bg-blue-700 transition-colors hidden sm:block">
            Search
          </button>
        </div>
        
        <button 
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)} 
          className="md:hidden w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-bold text-gray-600 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <Filter className="w-3.5 h-3.5" /> Advanced Filters
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 ${isFilterOpen ? 'grid' : 'hidden md:grid'}`}>
          <select aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] sm:text-xs text-gray-600 outline-none">
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name[lang]}</option>
            ))}
          </select>
          <select aria-label="Qualification" value={qual} onChange={(e) => setQual(e.target.value)} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] sm:text-xs text-gray-600 outline-none">
            <option value="">Any Qual.</option>
            <option value="10th">10th Pass</option>
            <option value="12th">12th Pass</option>
            <option value="grad">Graduate</option>
          </select>
          <select aria-label="Location" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-[10px] sm:text-xs text-gray-600 outline-none">
            <option value="">Any Location</option>
            <option value="delhi">Delhi</option>
            <option value="up">Uttar Pradesh</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="all-india">All India</option>
          </select>
          <button type="submit" className="md:hidden w-full px-3 py-1.5 text-[11px] bg-[#0A58CA] text-white font-bold rounded-md hover:bg-blue-700 transition-colors">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
