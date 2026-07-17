"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

interface Category {
  id: string;
  name: any;
  slug: string;
  icon: string;
}

export default function CategoryGrid({ categories, lang, title, specialSlugs }: { categories: Category[], lang: string, title: string, specialSlugs: string[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedCategories = showAll ? categories : categories.slice(0, 20);

  if (categories.length === 0) return null;

  // Implement the architecture plan redirect for special slugs
  const getCategoryUrl = (slug: string) => {
    if (specialSlugs.includes(slug)) {
      return `/${lang}/${slug}`;
    }
    return `/${lang}/category/${slug}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-[#0B1B3D] text-lg">{title}</h2>
        {categories.length > 20 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-bold text-[#0A58CA] hover:underline"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {displayedCategories.map((item) => (
          <Link key={item.id} href={getCategoryUrl(item.slug)} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:border-[#0A58CA] hover:shadow-sm transition-all group bg-white">
            <div className="w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
              <CategoryIcon name={item.icon || 'Briefcase'} className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-bold text-gray-700 group-hover:text-[#0A58CA] truncate">{item.name[lang] || item.name.en}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
