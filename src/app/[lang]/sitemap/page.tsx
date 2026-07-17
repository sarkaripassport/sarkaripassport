import { Metadata } from 'next';
import { getDictionary } from '@/dictionaries';
import { getCategories, getJobs } from '@/lib/db';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { getAlternates } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  return {
    title: `Sitemap | ${dict.home.title}`,
    description: `HTML Sitemap for ${dict.home.title}. Navigate all categories, jobs, and important pages.`,
    alternates: getAlternates(params.lang, '/sitemap'),
  };
}

export default async function SitemapPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);
  
  const [categories, jobs] = await Promise.all([
    getCategories(),
    getJobs()
  ]);

  const liveJobs = jobs.filter(j => j.isLive);
  
  const staticRoutes = [
    { name: 'Home', path: '/' },
    { name: 'All Jobs', path: '/jobs' },
    { name: 'Admit Card', path: '/admit-card' },
    { name: 'Results', path: '/results' },
    { name: 'Answer Key', path: '/answer-key' },
    { name: 'Syllabus', path: '/syllabus' },
    { name: 'Admission', path: '/admission' },
    { name: 'Tools & Calculators', path: '/tools' },
  ];

  const infoRoutes = [
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Disclaimer', path: '/disclaimer' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
  ];

  const specialSlugs = ['results', 'admit-card', 'answer-key', 'syllabus', 'admission'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
        <div className="mb-10 border-b border-gray-100 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1B3D] mb-3">HTML Sitemap</h1>
          <p className="text-gray-600">Complete directory of all pages on GovJobWala to help you navigate our site.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          
          {/* Main Pages */}
          <div>
            <h2 className="text-xl font-bold text-[#0A58CA] mb-4 flex items-center border-b border-gray-100 pb-2">
              Main Pages
            </h2>
            <ul className="space-y-3">
              {staticRoutes.map(route => (
                <li key={route.path}>
                  <Link href={`/${params.lang}${route.path}`} className="flex items-center text-gray-700 hover:text-[#0A58CA] font-medium transition-colors group">
                    <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-[#0A58CA]" />
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h2 className="text-xl font-bold text-[#0A58CA] mb-4 flex items-center border-b border-gray-100 pb-2">
              Job Categories
            </h2>
            <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {categories.map(cat => {
                const route = specialSlugs.includes(cat.slug) ? `/${cat.slug}` : `/category/${cat.slug}`;
                return (
                  <li key={cat.id}>
                    <Link href={`/${params.lang}${route}`} className="flex items-center text-gray-700 hover:text-[#0A58CA] font-medium transition-colors group">
                      <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-[#0A58CA]" />
                      {cat.name[params.lang as keyof typeof cat.name] || cat.name.en}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Information & Legal */}
          <div>
            <h2 className="text-xl font-bold text-[#0A58CA] mb-4 flex items-center border-b border-gray-100 pb-2">
              Information
            </h2>
            <ul className="space-y-3">
              {infoRoutes.map(route => (
                <li key={route.path}>
                  <Link href={`/${params.lang}${route.path}`} className="flex items-center text-gray-700 hover:text-[#0A58CA] font-medium transition-colors group">
                    <ChevronRight className="w-4 h-4 mr-2 text-gray-400 group-hover:text-[#0A58CA]" />
                    {route.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-100">
           <h2 className="text-xl font-bold text-[#0A58CA] mb-6 flex items-center">
              Recently Posted Jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveJobs.slice(0, 30).map(job => (
                <Link key={job.id} href={`/${params.lang}/jobs/${job.slug}`} className="block p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                  <div className="font-bold text-gray-800 text-sm truncate" title={job.title[params.lang as keyof typeof job.title] || job.title.en}>
                    {job.title[params.lang as keyof typeof job.title] || job.title.en}
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-6 text-center">
               <Link href={`/${params.lang}/jobs`} className="inline-flex items-center justify-center font-bold text-white bg-[#0A58CA] px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                 View All Jobs <ExternalLink className="w-4 h-4 ml-2" />
               </Link>
            </div>
        </div>

      </div>
    </div>
  );
}
