import Link from "next/link";
import { ChevronDown, GraduationCap, MapPin, Building2, CheckCircle2, Clock, ShieldCheck, Download, ExternalLink, Bookmark, CheckSquare, FileText, UploadCloud, Monitor, CheckCircle, FileQuestion, ArrowRight, Briefcase } from "lucide-react";

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-[#F4F7FA] min-h-screen py-6 font-sans text-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-500 flex items-center gap-2 mb-6">
          <Link href="/" className="hover:text-[#0A58CA]">Home</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link href="/jobs" className="hover:text-[#0A58CA]">Latest Jobs</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gray-900 font-medium">SSC CGL 2026</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT MAIN CONTENT */}
          <div className="flex-1 space-y-6 w-full">
            
            {/* Header Block */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center justify-center overflow-hidden p-2">
                {/* Emblem placeholder */}
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png')] bg-contain bg-center bg-no-repeat"></div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-black text-[#0B1B3D] mb-2 tracking-tight">SSC CGL 2026</h1>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-gray-700">Staff Selection Commission</h2>
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                </div>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed max-w-3xl">
                  Combined Graduate Level (CGL) Examination 2026 for recruitment to various Group B and Group C posts in different Ministries/Departments/Organizations of Government of India.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#0A58CA] text-xs font-bold rounded-lg border border-blue-100"><GraduationCap className="w-3.5 h-3.5" /> Graduate</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100"><Building2 className="w-3.5 h-3.5" /> Central Govt</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100"><Clock className="w-3.5 h-3.5" /> Last Date Near</span>
                </div>
              </div>
            </div>

            {/* Grid 1: Summary & Dates */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><FileText className="w-3.5 h-3.5"/></span>
                  1. Job Summary
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  SSC CGL is a prestigious examination conducted by the Staff Selection Commission for recruitment to various Group B and Group C posts. It offers excellent career opportunities in Government of India offices.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Clock className="w-3.5 h-3.5"/></span>
                  2. Important Dates
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Online Apply Start Date</span><span className="text-gray-900 font-bold">: 09 Jun 2026</span></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Last Date to Apply</span><span className="text-red-600 font-bold">: 24 Jun 2026</span></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Last Date to Pay Fee</span><span className="text-gray-900 font-bold">: 25 Jun 2026</span></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Tier-I Exam Date</span><span className="text-gray-900 font-bold">: Aug - Sep 2026</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 font-medium">Tier-II Exam Date</span><span className="text-gray-900 font-bold">: Dec 2026 / Jan 2027</span></div>
                </div>
              </div>
            </div>

            {/* Grid 2: Fee & Age */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm">₹</span>
                  3. Application Fee
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">General / OBC / EWS</span><span className="text-gray-900 font-bold">: ₹ 100/-</span></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">SC / ST / PwBD / Female</span><span className="text-green-600 font-bold">: ₹ 0/-</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 font-medium">Mode of Payment</span><span className="text-gray-900 font-bold">: Online</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><ShieldCheck className="w-3.5 h-3.5"/></span>
                  4. Age Limit <span className="text-xs text-gray-400 font-normal">(as on 01 Aug 2026)</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Minimum Age</span><span className="text-gray-900 font-bold">: 18 Years</span></div>
                  <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-600 font-medium">Maximum Age</span><span className="text-gray-900 font-bold">: 32 Years</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 font-medium">Age Relaxation</span><span className="text-gray-900 font-bold">: As per Govt. Rules</span></div>
                </div>
              </div>
            </div>

            {/* 5. Vacancy Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#0B1B3D] text-lg flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Briefcase className="w-3.5 h-3.5"/></span>
                  5. Vacancy Details
                </h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {[
                  { name: "Assistant Section Officer (ASO)", education: "Bachelor's Degree in any stream", vac: "2,150" },
                  { name: "Income Tax Inspector", education: "Bachelor's Degree in any stream", vac: "1,550" },
                  { name: "Inspector (Central Excise)", education: "Bachelor's Degree in any stream", vac: "950" },
                  { name: "Sub Inspector (CBI)", education: "Bachelor's Degree with 50% Marks", vac: "300" },
                  { name: "Tax Assistant", education: "Bachelor's Degree + Typing Speed 8000 KDPH", vac: "4,000" },
                ].map((row, i) => (
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
                
                {/* Total Summary Footer */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                   <div className="font-bold text-gray-700 text-base">Total Vacancies</div>
                   <div className="font-black text-2xl text-[#0B1B3D]">8,950</div>
                </div>
              </div>

              <div className="mt-5 text-right">
                <Link href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0A58CA] hover:text-blue-700 hover:underline">
                  View Full Vacancy Details <ArrowRight className="w-4 h-4"/>
                </Link>
              </div>
            </div>

            {/* Grid 3: Qual & Selection Process */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><GraduationCap className="w-3.5 h-3.5"/></span>
                  6. Education Qualification
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Bachelor's Degree in any stream from a recognized University/Institution in India. <br/><br/>
                  <span className="text-xs text-gray-500 font-normal">Candidates must possess essential qualification on or before the last date of application.</span>
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><CheckSquare className="w-3.5 h-3.5"/></span>
                  7. Selection Process
                </h3>
                <div className="flex items-center justify-between mt-6 px-2">
                  <div className="flex flex-col items-center text-center w-16">
                    <div className="w-8 h-8 rounded-full bg-[#0A58CA] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md">1</div>
                    <span className="text-[10px] font-bold text-gray-800 leading-tight">Tier-I<br/><span className="font-normal text-gray-400">(CBT)</span></span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-2 -mt-6"></div>
                  <div className="flex flex-col items-center text-center w-16">
                    <div className="w-8 h-8 rounded-full bg-[#0A58CA] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md">2</div>
                    <span className="text-[10px] font-bold text-gray-800 leading-tight">Tier-II<br/><span className="font-normal text-gray-400">(CBT)</span></span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-2 -mt-6"></div>
                  <div className="flex flex-col items-center text-center w-16">
                    <div className="w-8 h-8 rounded-full bg-[#0A58CA] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md">3</div>
                    <span className="text-[10px] font-bold text-gray-800 leading-tight">Doc<br/>Verify</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-2 -mt-6"></div>
                  <div className="flex flex-col items-center text-center w-16">
                    <div className="w-8 h-8 rounded-full bg-[#0A58CA] text-white flex items-center justify-center font-bold text-xs mb-2 shadow-md">4</div>
                    <span className="text-[10px] font-bold text-gray-800 leading-tight">Medical<br/>Exam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid 4: How to Apply & FAQs */}
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><Monitor className="w-3.5 h-3.5"/></span>
                  8. How to Apply
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span> Visit the official website of SSC.</li>
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span> Click on 'Apply Online' link.</li>
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span> Register and fill the application form carefully.</li>
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span> Upload required documents and photograph.</li>
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">5</span> Pay the application fee online.</li>
                  <li className="flex items-start gap-3"><span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A58CA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">6</span> Submit the form and take a printout for future reference.</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                <h3 className="font-bold text-[#0B1B3D] text-lg mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-blue-50 text-[#0A58CA] flex items-center justify-center text-sm"><FileQuestion className="w-3.5 h-3.5"/></span>
                  10. FAQs
                </h3>
                <div className="space-y-2">
                  {["What is SSC CGL?", "What is the age limit for SSC CGL 2026?", "What is the application fee for SSC CGL 2026?", "Is there any negative marking in SSC CGL Tier-I?", "Syllabus"].map((q, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                      <span className="text-xs font-bold text-gray-700">{q}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right">
                  <Link href="#" className="text-xs font-bold text-[#0A58CA] hover:underline">View More FAQs →</Link>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-6 lg:sticky lg:top-24">
            
            {/* Primary Action Buttons */}
            <div className="space-y-3">
              <button className="w-full flex justify-center items-center gap-2 py-3.5 bg-[#0A58CA] text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition">
                Apply Online <ExternalLink className="w-4 h-4" />
              </button>
              <button className="w-full flex justify-center items-center gap-2 py-3 bg-white text-[#0B1B3D] border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                <Download className="w-4 h-4 text-blue-600" /> Official Notification
              </button>
              <button className="w-full flex justify-center items-center gap-2 py-3 bg-white text-[#0B1B3D] border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" /> Check My Eligibility
              </button>
              <button className="w-full flex justify-center items-center gap-2 py-3 bg-white text-[#0B1B3D] border border-gray-300 font-bold rounded-xl hover:bg-gray-50 transition shadow-sm">
                <Bookmark className="w-4 h-4 text-gray-500" /> Save Job
              </button>
            </div>

            {/* Match / Eligibility Card */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-6 bg-gradient-to-br from-white to-blue-50/50">
              <h3 className="font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-[#0A58CA]"/> Your Match / Eligibility
              </h3>
              <div className="border border-blue-200 bg-white rounded-xl p-5 text-center shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-[#0A58CA] rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <p className="text-sm text-gray-600 mb-4 font-medium">Login to check your eligibility instantly and get a match score.</p>
                <button className="w-full py-2.5 bg-[#0A58CA] text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm mb-2">Login</button>
                <button className="w-full py-2.5 text-[#0A58CA] text-sm font-bold hover:underline">Create Profile</button>
              </div>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-gray-500"/> Required Documents
              </h3>
              <ul className="space-y-2 text-xs text-gray-600 list-disc list-inside ml-1">
                <li>Passport Size Photograph</li>
                <li>Signature (Scanned)</li>
                <li>10th Marksheet</li>
                <li>12th Marksheet</li>
                <li>Graduation Degree/Marksheet</li>
                <li>Caste Certificate (if applicable)</li>
                <li>PwBD Certificate (if applicable)</li>
                <li>Photo ID Proof (Aadhaar/PAN/Voter ID)</li>
              </ul>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500"/> Quick Facts
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 flex items-center gap-2"><Building2 className="w-3 h-3"/> Total Vacancies</span><span className="font-bold text-gray-900">8,950</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3"/> Last Date to Apply</span><span className="font-bold text-red-600">24 Jun 2026</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 flex items-center gap-2"><MapPin className="w-3 h-3"/> Job Location</span><span className="font-bold text-gray-900">All India</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 flex items-center gap-2"><Monitor className="w-3 h-3"/> Application Mode</span><span className="font-bold text-gray-900">Online</span></div>
                <div className="flex justify-between border-b border-gray-50 pb-2"><span className="text-gray-500 flex items-center gap-2"><CheckSquare className="w-3 h-3"/> Exam Mode</span><span className="font-bold text-gray-900">Online</span></div>
                <div className="flex justify-between"><span className="text-gray-500 flex items-center gap-2"><Briefcase className="w-3 h-3"/> Job Type</span><span className="font-bold text-gray-900">Regular</span></div>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-bold text-[#0B1B3D] mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500"/> Similar Jobs
              </h3>
              <div className="space-y-4">
                {[
                  { t: "IB Security Assistant 2026", o: "Intelligence Bureau (MHA)", d: "20 Jun 2025" },
                  { t: "Railway ALP 2025", o: "Railway Recruitment Board", d: "30 Jun 2025" },
                  { t: "UP Police Constable 2025", o: "UP Police Recruitment Board", d: "17 May 2025" },
                ].map((sj, i) => (
                  <div key={i} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-1">
                      <Link href="#" className="text-sm font-bold text-gray-800 hover:text-[#0A58CA]">{sj.t}</Link>
                      <div className="text-[10px] text-gray-500 text-right shrink-0">Last Date<br/><span className="text-gray-800 font-bold">{sj.d}</span></div>
                    </div>
                    <p className="text-xs text-gray-500">{sj.o}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/jobs" className="text-xs font-bold text-[#0A58CA] hover:underline">View All Similar Jobs →</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
