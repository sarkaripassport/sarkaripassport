import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJobBySlug } from '@/lib/db';
import { ChevronDown, CheckCircle2, Clock, MapPin, GraduationCap, Users, DollarSign, Calendar, Info, FileText, ArrowRight, CheckSquare, ListOrdered, Share2, HelpCircle } from 'lucide-react';

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
    description: job.seo_description || job.job_summary,
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  // Generate JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'title': job.title,
    'description': job.job_summary,
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.organization,
      'logo': job.logo_url
    },
    'datePosted': job.created_at,
    'validThrough': job.quick_facts?.last_date,
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 md:pb-6 font-sans text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Latest Jobs</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gray-900 truncate max-w-[300px]">{job.title}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1000px] mx-auto px-0 md:px-4 mt-0 md:mt-6 space-y-2 md:space-y-6">
        
        {/* Section 1: Hero Section */}
        <section className="bg-white md:rounded-2xl border-b md:border border-gray-200 p-5 md:p-8 relative overflow-hidden shadow-sm">
          {/* Decorative background shape */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            {job.logo_url && (
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-2 mb-2">
                <img src={job.logo_url} alt={job.organization} className="max-w-full max-h-full object-contain" />
              </div>
            )}
            
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
              <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded ${job.statusColor}`}>{job.status}</span>
              <span className="inline-flex items-center px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 text-[10px] font-black uppercase tracking-wider rounded"><Clock className="w-3 h-3 mr-1" /> {job.daysLeft} Days Left</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-black text-[#0B1B3D] leading-tight tracking-tight">{job.title}</h1>
            <p className="text-sm md:text-base font-bold text-gray-500">{job.organization}</p>
          </div>
        </section>

        {/* Section 14: Eligibility Match Widget (Simulated) */}
        {job.eligibility_rules && job.eligibility_rules.length > 0 && (
          <section className="bg-gradient-to-br from-indigo-900 to-[#0B1B3D] md:rounded-2xl p-5 md:p-6 text-white shadow-lg mx-4 md:mx-0 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-auto flex flex-col items-center justify-center shrink-0">
                <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center relative">
                  <span className="text-xl font-black">?%</span>
                  <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Analyze</div>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-lg mb-1">Are you eligible for this post?</h3>
                <p className="text-indigo-200 text-sm mb-4 leading-relaxed">Create your profile once and our smart engine will instantly calculate your eligibility score for {job.organization}.</p>
                <div className="flex justify-center md:justify-start gap-3">
                  <button className="bg-white text-indigo-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-gray-50 transition-colors">Complete Profile</button>
                  <button className="bg-indigo-800 border border-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">Login</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 2: Quick Facts */}
        {job.quick_facts && (
          <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
            <h2 className="text-base font-black text-[#0B1B3D] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3"><Info className="w-5 h-5 text-blue-600" /> At a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase"><Users className="w-3.5 h-3.5" /> Vacancies</div>
                <div className="font-black text-[#0B1B3D] text-lg">{job.quick_facts.vacancies}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase"><GraduationCap className="w-3.5 h-3.5" /> Qualification</div>
                <div className="font-black text-[#0B1B3D]">{job.quick_facts.qualification}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase"><MapPin className="w-3.5 h-3.5" /> Location</div>
                <div className="font-black text-[#0B1B3D]">{job.quick_facts.job_location}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase"><DollarSign className="w-3.5 h-3.5" /> Salary</div>
                <div className="font-black text-green-700">{job.quick_facts.salary}</div>
              </div>
            </div>
          </section>
        )}

        {/* Desktop Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2 md:space-y-6 w-full">
            
            {/* Section 3: Summary */}
            {job.job_summary && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-3">Job Summary</h2>
                <p className="text-sm leading-relaxed text-gray-600">{job.job_summary}</p>
              </section>
            )}

            {/* Section 4: Timelines */}
            {job.important_dates && job.important_dates.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Important Dates</h2>
                <div className="relative border-l-2 border-blue-100 ml-3 space-y-6">
                  {job.important_dates.map((date, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-sm font-bold text-[#0B1B3D]">{date.label}</h4>
                      <p className="text-sm text-blue-600 font-bold mt-0.5">{date.date}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 7: Vacancies */}
            {job.vacancy_cards && job.vacancy_cards.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Vacancy Details ({job.quick_facts?.vacancies})</h2>
                
                {/* Mobile Cards (Hidden on md+) */}
                <div className="space-y-4 md:hidden">
                  {job.vacancy_cards.map((vac, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 shadow-sm bg-gray-50/50">
                      <h3 className="font-bold text-[#0B1B3D] mb-3 border-b border-gray-200 pb-2">{vac.post_name}</h3>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Posts</span>
                        <span className="bg-blue-100 text-blue-800 font-black px-2.5 py-1 rounded text-sm">{vac.total}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-500 uppercase">Qualification</span>
                        <span className="text-sm font-bold text-gray-800 text-right max-w-[60%] leading-tight">{vac.education}</span>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Category Wise Distribution</span>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(vac.categories).map(([cat, val]) => (
                            <div key={cat} className="flex-1 min-w-[3rem] bg-gray-50 border border-gray-100 rounded text-center py-1.5">
                              <div className="text-[9px] font-bold text-gray-500 uppercase">{cat}</div>
                              <div className="text-sm font-black text-[#0B1B3D]">{val}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (Hidden on mobile) */}
                <div className="hidden md:block overflow-hidden border border-gray-200 rounded-xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3 font-bold text-[#0B1B3D]">Post Name</th>
                        <th className="p-3 font-bold text-[#0B1B3D]">Total</th>
                        <th className="p-3 font-bold text-[#0B1B3D]">Qualification</th>
                        <th className="p-3 font-bold text-[#0B1B3D] border-l border-gray-200">Category Breakdown</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {job.vacancy_cards.map((vac, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="p-3 font-bold text-[#0B1B3D] align-top">{vac.post_name}</td>
                          <td className="p-3 font-black text-blue-600 align-top"><span className="bg-blue-50 px-2.5 py-1 rounded border border-blue-100">{vac.total}</span></td>
                          <td className="p-3 text-gray-700 font-medium align-top leading-snug max-w-[200px]">{vac.education}</td>
                          <td className="p-3 border-l border-gray-100 align-top">
                            <div className="flex gap-2 flex-wrap">
                              {Object.entries(vac.categories).map(([cat, val]) => (
                                <span key={cat} className="inline-flex flex-col border border-gray-200 rounded px-2 py-1 text-center bg-white min-w-[3rem]">
                                  <span className="text-[9px] text-gray-500 font-bold uppercase">{cat}</span>
                                  <span className="text-sm font-black text-gray-800 leading-none mt-0.5">{val}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Section 10: Selection Process */}
            {job.selection_process && job.selection_process.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><ListOrdered className="w-5 h-5 text-blue-600" /> Selection Process</h2>
                <div className="space-y-4">
                  {job.selection_process.map((step) => (
                    <div key={step.step_number} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 border border-blue-200">{step.step_number}</div>
                      <div>
                        <h4 className="font-bold text-[#0B1B3D] mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 13: How To Apply */}
            {job.how_to_apply && job.how_to_apply.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-blue-600" /> How to Apply</h2>
                <div className="space-y-3">
                  {job.how_to_apply.map((step) => (
                    <div key={step.step_number} className="flex gap-3 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="font-black text-blue-400 shrink-0">Step {step.step_number}:</span>
                      <span className="text-gray-700">{step.instruction}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Section 16: FAQs */}
            {job.faqs && job.faqs.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {job.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                        {faq.question}
                        <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 bg-white leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar (Sticky on Desktop) */}
          <div className="w-full md:w-[350px] shrink-0 space-y-4 md:space-y-6 md:sticky md:top-20 h-fit">
             
             {/* Desktop Quick Apply Card */}
             <div className="hidden md:block bg-gradient-to-b from-[#0A58CA] to-[#084298] rounded-2xl text-white p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-black text-xl mb-2">Ready to Apply?</h3>
                <p className="text-blue-100 text-sm mb-5 leading-relaxed">Submit your application before <strong className="text-white">{job.quick_facts?.last_date}</strong>.</p>
                <a href={job.important_links?.[0]?.url || '#'} className="w-full py-3.5 bg-yellow-400 text-yellow-950 hover:bg-yellow-300 rounded-xl font-black transition-colors shadow flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                  Apply Online Now <ArrowRight className="w-4 h-4" />
                </a>
             </div>

             {/* Application Fee Card */}
             {job.application_fee && job.application_fee.length > 0 && (
               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Application Fee</h3>
                 <ul className="space-y-3">
                   {job.application_fee.map((fee, idx) => (
                     <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                       <span className="text-gray-600">{fee.category}</span>
                       <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{fee.amount}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             {/* Important Links Card */}
             {job.important_links && job.important_links.length > 0 && (
               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Important Links</h3>
                 <div className="space-y-2">
                   {job.important_links.map((link, idx) => (
                     <a key={idx} href={link.url} target="_blank" className={`flex items-center justify-between p-3 rounded-lg border text-sm font-bold transition-colors ${link.is_primary ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                       {link.label}
                       <ArrowRight className="w-4 h-4" />
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-3 z-50 flex items-center gap-3">
        <button className="flex-1 py-3 bg-white border border-[#0A58CA] text-[#0A58CA] rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Eligibility
        </button>
        <a href={job.important_links?.[0]?.url || '#'} className="flex-1 py-3 bg-[#0A58CA] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wide">
          Apply Now <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
