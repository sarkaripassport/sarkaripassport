import Link from "next/link";
import LogoIcon from "@/components/ui/LogoIcon";
import { Search, ChevronDown } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import MobileMenu from "./MobileMenu";
import { getJobs, getCategories } from "@/lib/db";
import LiveTimestamp from "../ui/LiveTimestamp";

export default async function Navbar({ lang = 'en' }: { lang?: string }) {
  const getLink = (path: string) => {
    if (path.startsWith('http') || path.startsWith(`/${lang}`)) return path;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [jobs, categories] = await Promise.all([getJobs(), getCategories()]);
  const trendingCategories = categories.filter(c => c.isTrending);
  const otherCategories = categories.filter(c => !c.isTrending && !c.isQuickLink);

  const getCategoryUrl = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/s$/, ''); // singularize
    if (cleanSlug === 'result') return `/${lang}/results`;
    if (cleanSlug === 'admit-card') return `/${lang}/admit-card`;
    if (cleanSlug === 'answer-key') return `/${lang}/answer-key`;
    if (cleanSlug === 'syllabus') return `/${lang}/syllabus`;
    if (cleanSlug === 'admission') return `/${lang}/admission`;
    return `/${lang}/category/${slug}`;
  };

  const latestJob = jobs.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];
  const lastUpdated = latestJob 
    ? new Date(latestJob.updated_at || latestJob.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <nav className="bg-[#0B1B3D] text-white border-b border-gray-800 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#061129] py-1 border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="text-[10px] text-gray-300 font-medium flex items-center gap-1">
            Last Updated: <span className="text-green-400 font-bold"><LiveTimestamp initialTimestamp={lastUpdated} /></span>
          </div>
          <a href="/sitemap.xml" className="text-[10px] text-gray-300 hover:text-white transition-colors">
            Sitemap
          </a>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <LogoIcon className="w-12 h-12 text-white" />
            <div>
              <Link href={getLink("/")} className="text-xl font-bold tracking-tight block leading-none">
                GovJob<span className="text-[#FF9933]">Wala</span>
              </Link>
              <span className="text-[10px] text-gray-300 font-medium tracking-wide">Sarkari Jobs + Eligibility Assistant</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-semibold">
            <Link href={getLink("/jobs")} prefetch={false} className="hover:text-[#0A58CA] transition-colors border-b-2 border-transparent hover:border-[#0A58CA] py-5">Latest Jobs</Link>
            <Link href={getLink("/admit-card")} prefetch={false} className="text-gray-300 hover:text-white transition-colors py-5">Admit Card</Link>
            <Link href={getLink("/results")} prefetch={false} className="text-gray-300 hover:text-white transition-colors py-5">Results</Link>
            <Link href={getLink("/answer-key")} prefetch={false} className="text-gray-300 hover:text-white transition-colors py-5">Answer Key</Link>
            <Link href={getLink("/syllabus")} prefetch={false} className="text-gray-300 hover:text-white transition-colors py-5">Syllabus</Link>
            <Link href={getLink("/admission")} prefetch={false} className="text-gray-300 hover:text-white transition-colors py-5">Admission</Link>
            <div className="relative group py-5">
              <span className="text-gray-300 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                Sarkari Sectors <ChevronDown className="w-4 h-4" />
              </span>
              {/* Mega Dropdown */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[420px] bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-4 text-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Trending Sectors</h4>
                    <div className="flex flex-col gap-1.5">
                      {trendingCategories.map(cat => (
                        <Link key={cat.id} href={getCategoryUrl(cat.slug)} prefetch={false} className="text-sm font-semibold hover:text-[#0A58CA] text-gray-700 block transition-colors">
                          {cat.name[lang as 'en'|'hi'|'mr'] || cat.name.en}
                        </Link>
                      ))}
                      {trendingCategories.length === 0 && <span className="text-xs text-gray-400 italic">None configured</span>}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 border-b pb-1">Other Areas</h4>
                    <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                      {otherCategories.map(cat => (
                        <Link key={cat.id} href={getCategoryUrl(cat.slug)} prefetch={false} className="text-sm font-semibold hover:text-[#0A58CA] text-gray-700 block transition-colors">
                          {cat.name[lang as 'en'|'hi'|'mr'] || cat.name.en}
                        </Link>
                      ))}
                      {otherCategories.length === 0 && <span className="text-xs text-gray-400 italic">None configured</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group py-5">
              <Link href={getLink("/tools")} prefetch={false} className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Tools <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase">New</span>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-0 w-48 bg-white rounded-lg shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden text-gray-800">
                <Link href={getLink("/tools?tab=resizer")} prefetch={false} className="block px-4 py-3 hover:bg-gray-50 hover:text-[#0A58CA] border-b border-gray-100">Image Resizer</Link>
                <Link href={getLink("/tools?tab=merger")} prefetch={false} className="block px-4 py-3 hover:bg-gray-50 hover:text-[#0A58CA] border-b border-gray-100">Photo+Sign Merge</Link>
                <Link href={getLink("/tools?tab=signature")} prefetch={false} className="block px-4 py-3 hover:bg-gray-50 hover:text-[#0A58CA] border-b border-gray-100">Signature Pad</Link>
                <Link href={getLink("/tools?tab=img-to-pdf")} prefetch={false} className="block px-4 py-3 hover:bg-gray-50 hover:text-[#0A58CA] border-b border-gray-100">Image to PDF</Link>
                <Link href={getLink("/tools?tab=merge-pdf")} prefetch={false} className="block px-4 py-3 hover:bg-gray-50 hover:text-[#0A58CA]">Merge PDF</Link>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="text-gray-300 hover:text-white hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-700 hidden sm:block"></div>
            
            <LanguageSwitcher />
            <MobileMenu lang={lang} categories={categories} />
          </div>
          
        </div>
      </div>
    </nav>
  );
}
