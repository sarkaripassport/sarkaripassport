import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { ChevronDown, GraduationCap, CheckCircle2, Clock, FileText, ArrowRight, Briefcase, Calendar, CreditCard, User, Link as LinkIcon, Download, Globe } from 'lucide-react';
import { getJobBySlug } from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  
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

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

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
            
            {/* 1. Header Block */}
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

            {/* 2. At a Glance Grid (Dates, Fees, Age) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Important Dates */}
              {job.important_dates && job.important_dates.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-200 transition-colors">
                  <h3 className="font-bold text-[#0B1B3D] text-base mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Calendar className="w-3.5 h-3.5"/></span>
                    Important Dates
                  </h3>
                  <ul className="space-y-3">
                    {job.important_dates.map((item, i) => (
                      <li key={i} className="flex justify-between items-start gap-4 text-sm">
                        <span className="text-gray-600 leading-snug">{item.label}</span>
                        <span className="font-bold text-[#0B1B3D] text-right shrink-0">{item.date}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Application Fee */}
              {job.application_fee && job.application_fee.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-200 transition-colors">
                  <h3 className="font-bold text-[#0B1B3D] text-base mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><CreditCard className="w-3.5 h-3.5"/></span>
                    Application Fee
                  </h3>
                  <ul className="space-y-3">
                    {job.application_fee.map((item, i) => (
                      <li key={i} className="flex justify-between items-start gap-4 text-sm">
                        <span className="text-gray-600 leading-snug">{item.category}</span>
                        <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded text-right shrink-0">{item.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Age Limit */}
              {job.age_limit && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:border-blue-200 transition-colors lg:col-span-1 md:col-span-2">
                  <h3 className="font-bold text-[#0B1B3D] text-base mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><User className="w-3.5 h-3.5"/></span>
                    Age Limit <span className="font-normal text-xs text-gray-500">(As on {job.age_limit.cutoff_date})</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Minimum Age</span>
                      <span className="font-bold text-[#0B1B3D]">{job.age_limit.min_age}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Maximum Age</span>
                      <span className="font-bold text-[#0B1B3D]">{job.age_limit.max_age}</span>
                    </div>
                    {job.age_limit.relaxation && (
                      <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-xs text-gray-500 italic">
                        * {job.age_limit.relaxation}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Vacancy Details */}
            {job.vacancies && job.vacancies.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-[#0B1B3D] text-lg flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Briefcase className="w-3.5 h-3.5"/></span>
                    Vacancy Details
                  </h3>
                  <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                    <span className="text-xs font-bold text-[#0A58CA] uppercase">Total: </span>
                    <span className="text-sm font-black text-[#0A58CA]">{job.total_vacancies}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  {job.vacancies.map((row, i) => (
                    <div key={i} className="flex items-start gap-3 sm:gap-4 py-3 sm:py-4 border-b border-gray-100 last:border-0 group hover:bg-gray-50/50 transition-colors rounded-lg px-2 -mx-2">
                      <div className="bg-[#F4F7FA] border border-gray-200 text-[#0B1B3D] font-black text-sm sm:text-base px-2 py-1.5 rounded-lg shrink-0 min-w-[3.5rem] sm:min-w-[4.5rem] text-center shadow-sm group-hover:bg-[#0A58CA] group-hover:text-white group-hover:border-[#0A58CA] transition-all">
                        {row.vac}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <h4 className="font-bold text-[#0B1B3D] text-[13px] sm:text-[15px] leading-snug group-hover:text-[#0A58CA] transition-colors">{row.name}</h4>
                        <div className="flex items-start gap-1.5 mt-1.5 bg-white border border-gray-100 rounded p-1.5 sm:px-2 sm:py-1.5 inline-flex w-full sm:w-auto shadow-sm">
                          <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 shrink-0 mt-0.5 sm:mt-0" />
                          <span className="text-[11px] sm:text-[12px] font-medium text-gray-600 leading-tight">{row.education}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Extra Information (Rich Text) */}
            {job.description_html && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><FileText className="w-3.5 h-3.5"/></span>
                  Additional Information
                </h3>
                
                <div className="prose prose-sm sm:prose-base prose-blue max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description_html }} />
              </div>
            )}

            {/* 5. Important Links */}
            {job.important_links && job.important_links.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-5 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><LinkIcon className="w-3.5 h-3.5"/></span>
                  Important Links
                </h3>
                
                <div className="flex flex-col gap-3">
                  {job.important_links.map((link, i) => {
                    const isApply = link.label.toLowerCase().includes('apply');
                    const isDownload = link.label.toLowerCase().includes('download') || link.label.toLowerCase().includes('notification');
                    
                    return (
                      <a 
                        key={i} 
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`
                          flex items-center justify-between p-4 rounded-xl border transition-all group
                          ${isApply 
                            ? 'bg-gradient-to-r from-[#0A58CA] to-blue-600 border-[#084298] text-white hover:shadow-lg hover:-translate-y-0.5' 
                            : 'bg-gray-50 border-gray-200 text-[#0B1B3D] hover:border-blue-300 hover:bg-blue-50'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                            ${isApply ? 'bg-white/20' : 'bg-white border border-gray-200 text-[#0A58CA] shadow-sm'}
                          `}>
                            {isApply ? <ArrowRight className="w-5 h-5 text-white" /> : 
                             isDownload ? <Download className="w-5 h-5" /> : 
                             <Globe className="w-5 h-5" />}
                          </div>
                          <span className={`font-extrabold ${isApply ? 'text-lg text-white' : 'text-base'}`}>
                            {link.label}
                          </span>
                        </div>
                        <div className={`text-sm font-bold ${isApply ? 'text-blue-100' : 'text-[#0A58CA]'}`}>
                          Click Here
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
          
          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-6 lg:sticky lg:top-6">
             <div className="bg-[#0A58CA] rounded-xl text-white p-6 shadow-md border-b-4 border-[#084298]">
               <h3 className="font-bold text-xl mb-2">Apply Online Now</h3>
               <p className="text-blue-100 text-sm mb-5 leading-relaxed">Submit your application before <strong className="text-white">{job.last_date}</strong> to avoid last minute server issues.</p>
               
               {job.important_links?.find(l => l.label.toLowerCase().includes('apply')) ? (
                 <a 
                   href={job.important_links.find(l => l.label.toLowerCase().includes('apply'))?.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full py-3 bg-white text-[#0A58CA] rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                 >
                   Proceed to Application <ArrowRight className="w-4 h-4" />
                 </a>
               ) : (
                 <button className="w-full py-3 bg-white/20 text-white rounded-lg font-bold cursor-not-allowed">
                   Link Not Available Yet
                 </button>
               )}
             </div>

             {/* Quick Actions */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
               <h3 className="font-bold text-[#0B1B3D] text-sm mb-2 border-b border-gray-100 pb-2">Quick Actions</h3>
               <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                 <FileText className="w-4 h-4 text-gray-500" /> Save for Later
               </button>
               <button className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors">
                 <Globe className="w-4 h-4 text-gray-500" /> Share with Friends
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
