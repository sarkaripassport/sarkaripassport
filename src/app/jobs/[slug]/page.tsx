import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { ChevronDown, GraduationCap, Building2, CheckCircle2, Clock, FileText, ArrowRight, Briefcase } from 'lucide-react';
import { getJobBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  
  if (!job) {
    return {
      title: 'Job Not Found - Naukri Passport',
    }
  }

  return {
    title: job.seo_title || `${job.title} Recruitment`,
    description: job.seo_description || `Apply now for ${job.title} at ${job.organization}.`,
  }
}

export default async function JobDetailPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  // Generate Google JobPosting JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.description_html,
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.organization,
    },
    'datePosted': job.created_at,
    'validThrough': job.last_date,
  };

  return (
    <div className="bg-[#F4F7FA] min-h-screen py-6 font-sans text-gray-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link href="/jobs" className="hover:text-[#0A58CA]">Latest Jobs</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gray-900 font-medium">{job.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT MAIN CONTENT */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Header Block */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center justify-center overflow-hidden p-2">
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-[#0B1B3D] mb-2 tracking-tight">{job.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-700">{job.organization}</h2>
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg ${job.statusColor}`}><CheckCircle2 className="w-3.5 h-3.5" /> {job.status}</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100"><Clock className="w-3.5 h-3.5" /> Last Date: {job.last_date}</span>
                </div>
              </div>
            </div>

            {/* Content Display */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><FileText className="w-3.5 h-3.5"/></span>
                Notification Details
              </h3>
              
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description_html }} />
            </div>

            {/* Vacancy Details */}
            {job.vacancies && job.vacancies.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-[#0B1B3D] text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Briefcase className="w-3.5 h-3.5"/></span>
                    Vacancy Details
                  </h3>
                </div>
                
                <div className="flex flex-col gap-3">
                  {job.vacancies.map((row, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 sm:p-5 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                      <div className="flex-1">
                        <h4 className="font-extrabold text-[#0B1B3D] text-[15px] sm:text-base group-hover:text-[#0A58CA] transition-colors">{row.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 flex items-start gap-1.5 font-medium">
                          <GraduationCap className="w-4 h-4 text-gray-400 shrink-0" />
                          {row.education}
                        </p>
                      </div>
                      <div className="bg-[#F8FAFC] border border-gray-100 rounded-lg px-4 py-2.5 flex flex-col items-center justify-center min-w-[120px] shrink-0 sm:items-end sm:bg-transparent sm:border-0 sm:p-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Vacancies</span>
                        <span className="font-black text-xl text-[#0A58CA] leading-tight">{row.vac}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                     <div className="font-bold text-gray-700 text-base">Total Vacancies</div>
                     <div className="font-black text-2xl text-[#0B1B3D]">{job.total_vacancies}</div>
                  </div>
                </div>
              </div>
            )}

          </div>
          
          {/* RIGHT SIDEBAR Placeholder */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-6">
             <div className="bg-[#0A58CA] rounded-xl text-white p-6 shadow-md border-b-4 border-[#084298]">
               <h3 className="font-bold text-xl mb-2">Apply Online Now</h3>
               <p className="text-blue-100 text-sm mb-5 leading-relaxed">Submit your application before {job.last_date} to avoid last minute server issues.</p>
               <button className="w-full py-3 bg-white text-[#0A58CA] rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                 Proceed to Application <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
