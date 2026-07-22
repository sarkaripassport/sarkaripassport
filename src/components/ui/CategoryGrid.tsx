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
    if (specialSlugs.includes(slug)) {
      return `/${lang}/${slug}`;
    }
    return `/${lang}/category/${slug}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-[#0B1B3D] text-lg">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {categories.slice(0, 20).map((item) => (
          <Link key={item.id} href={getCategoryUrl(item.slug)} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:border-[#0A58CA] hover:shadow-sm transition-all group bg-white">
            <div className="w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
              <CategoryIcon name={item.icon || 'Briefcase'} className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-bold text-gray-700 group-hover:text-[#0A58CA] truncate">{item.name[lang] || item.name.en}</span>
          </Link>
        ))}
      </div>
      {categories.length > 20 && (
        <details className="group mt-3">
          <summary className="text-xs font-bold text-[#0A58CA] hover:underline cursor-pointer list-none flex justify-center w-full mt-2">
            <span className="group-open:hidden">View All Categories</span>
            <span className="hidden group-open:inline">Show Less</span>
          </summary>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {categories.slice(20).map((item) => (
              <Link key={item.id} href={getCategoryUrl(item.slug)} className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:border-[#0A58CA] hover:shadow-sm transition-all group bg-white">
                <div className="w-9 h-9 rounded-md bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                  <CategoryIcon name={item.icon || 'Briefcase'} className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-xs font-bold text-gray-700 group-hover:text-[#0A58CA] truncate">{item.name[lang] || item.name.en}</span>
              </Link>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
