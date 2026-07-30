import Link from "next/link";
import CategoryIcon from "./CategoryIcon";

interface Category {
  id: string;
  name: any;
  slug: string;
  icon: string;
}

export default function CategoryGrid({ categories, lang, title, specialSlugs }: { categories: Category[], lang: string, title: string, specialSlugs: string[] }) {

  if (categories.length === 0) return null;

  // Implement the architecture plan redirect for special slugs
  const getCategoryUrl = (slug: string) => {
    return `/${lang}/category/${slug}`;
  };

  const getCategoryColors = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('rail') || s.includes('train')) {
      return { border: 'border-blue-100 hover:border-blue-300', text: 'group-hover:text-blue-700', shadow: 'hover:shadow-blue-500/5', bg: 'group-hover:bg-blue-50' };
    }
    if (s.includes('bank') || s.includes('finance') || s.includes('landmark')) {
      return { border: 'border-emerald-100 hover:border-emerald-300', text: 'group-hover:text-emerald-700', shadow: 'hover:shadow-emerald-500/5', bg: 'group-hover:bg-emerald-50' };
    }
    if (s.includes('police') || s.includes('def') || s.includes('shield')) {
      return { border: 'border-rose-100 hover:border-rose-300', text: 'group-hover:text-rose-700', shadow: 'hover:shadow-rose-500/5', bg: 'group-hover:bg-rose-50' };
    }
    if (s.includes('ssc') || s.includes('upsc') || s.includes('civil')) {
      return { border: 'border-indigo-100 hover:border-indigo-300', text: 'group-hover:text-indigo-700', shadow: 'hover:shadow-indigo-500/5', bg: 'group-hover:bg-indigo-50' };
    }
    return { border: 'border-purple-100 hover:border-purple-300', text: 'group-hover:text-purple-700', shadow: 'hover:shadow-purple-500/5', bg: 'group-hover:bg-purple-50' };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-[#0B1B3D] text-lg">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.slice(0, 20).map((item) => {
          const colors = getCategoryColors(item.slug);
          return (
            <Link key={item.id} href={getCategoryUrl(item.slug)} scroll={true} prefetch={false} className={`flex items-center gap-2 p-2 border rounded-lg transition-all group bg-white ${colors.border} ${colors.shadow}`}>
              <div className={`w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center shrink-0 transition-colors ${colors.bg}`}>
                <CategoryIcon name={item.icon || item.name.en} className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <span className={`text-xs font-bold text-gray-700 truncate transition-colors ${colors.text}`}>{item.name[lang] || item.name.en}</span>
            </Link>
          );
        })}
      </div>
      {categories.length > 20 && (
        <details className="group mt-3">
          <summary className="text-xs font-bold text-[#0A58CA] hover:underline cursor-pointer list-none flex justify-center w-full mt-2">
            <span className="group-open:hidden">View All Categories</span>
            <span className="hidden group-open:inline">Show Less</span>
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {categories.slice(20).map((item) => {
              const colors = getCategoryColors(item.slug);
              return (
                <Link key={item.id} href={getCategoryUrl(item.slug)} prefetch={false} className={`flex items-center gap-2 p-2 border rounded-lg transition-all group bg-white ${colors.border} ${colors.shadow}`}>
                  <div className={`w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center shrink-0 transition-colors ${colors.bg}`}>
                    <CategoryIcon name={item.icon || item.name.en} className="w-6 h-6 transition-transform group-hover:scale-110" />
                  </div>
                  <span className={`text-xs font-bold text-gray-700 truncate transition-colors ${colors.text}`}>{item.name[lang] || item.name.en}</span>
                </Link>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
