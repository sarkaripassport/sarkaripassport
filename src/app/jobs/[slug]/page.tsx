import Link from "next/link";
import { Building, MapPin, Calendar, Briefcase, FileText, Download, ExternalLink, Share2, CheckCircle2 } from "lucide-react";

export default function JobDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="bg-brand-light min-h-screen pb-16">
      {/* Job Header Banner */}
      <div className="bg-brand-navy text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-3 border border-blue-500/30">
                Central Government
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
                SSC CHSL Recruitment 2026
              </h1>
              <p className="text-lg text-gray-300 flex items-center gap-2">
                <Building className="h-5 w-5" /> Staff Selection Commission (SSC)
              </p>
            </div>
            <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/10">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-300">
            <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-400" /> All India</span>
            <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-blue-400" /> 3,712 Posts</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-blue-400" /> Posted: 01 June 2026</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        
        {/* Quick Action Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">Application Deadline</p>
            <p className="text-xl font-bold text-accent-red">15 August 2026</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="#" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-light text-brand-navy border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" /> Notification
            </Link>
            <Link href="#" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-colors">
              Apply Online <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Content Tabs / Sections */}
        <div className="space-y-8">
          
          {/* Job Summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-brand-navy mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-blue" />
              Job Summary
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Staff Selection Commission (SSC) has released the notification for the Combined Higher Secondary (10+2) Level (CHSL) Examination 2026. Interested candidates who fulfill the eligibility criteria can apply online. The recruitment aims to fill vacancies for Lower Divisional Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operators (DEO) across various ministries and departments of the Government of India.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-bold text-brand-navy mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent-green" /> Eligibility Quick Check
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
                <li>Must have passed 12th Standard or equivalent from a recognized Board.</li>
                <li>Age must be between 18 to 27 years.</li>
                <li>Indian Citizenship required.</li>
              </ul>
            </div>
          </section>

          {/* Important Dates & Fees Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dates */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-navy">Important Dates</h2>
              </div>
              <div className="p-6">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody>
                    <tr className="border-b border-gray-50"><td className="py-3 font-medium">Application Start</td><td className="py-3 text-right font-bold text-brand-navy">01 June 2026</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-3 font-medium">Last Date to Apply</td><td className="py-3 text-right font-bold text-accent-red">15 August 2026</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-3 font-medium">Fee Payment Last Date</td><td className="py-3 text-right font-bold text-brand-navy">17 August 2026</td></tr>
                    <tr><td className="py-3 font-medium">Tier-1 Exam Date</td><td className="py-3 text-right font-bold text-brand-navy">Oct-Nov 2026</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Application Fee */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-brand-navy">Application Fee</h2>
              </div>
              <div className="p-6">
                <table className="w-full text-sm text-left text-gray-600">
                  <tbody>
                    <tr className="border-b border-gray-50"><td className="py-3 font-medium">General / OBC / EWS</td><td className="py-3 text-right font-bold text-brand-navy">₹ 100/-</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-3 font-medium">SC / ST / PH</td><td className="py-3 text-right font-bold text-accent-green">Nil (₹ 0/-)</td></tr>
                    <tr><td className="py-3 font-medium">All Category Female</td><td className="py-3 text-right font-bold text-accent-green">Nil (₹ 0/-)</td></tr>
                  </tbody>
                </table>
                <p className="text-xs text-gray-400 mt-4 text-center">Pay the exam fee through Online Debit Card, Credit Card, Net Banking mode only.</p>
              </div>
            </section>
          </div>

          {/* Vacancy Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-brand-navy">Vacancy Details & Qualification</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Post Name</th>
                    <th className="px-6 py-4 font-semibold">Total Posts</th>
                    <th className="px-6 py-4 font-semibold">Eligibility / Qualification</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-brand-navy">Lower Divisional Clerk (LDC) / JSA</td>
                    <td className="px-6 py-4 font-bold">1,856</td>
                    <td className="px-6 py-4">Passed 10+2 Intermediate Exam in Any Recognized Board in India.</td>
                  </tr>
                  <tr className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-medium text-brand-navy">Data Entry Operator (DEO)</td>
                    <td className="px-6 py-4 font-bold">1,856</td>
                    <td className="px-6 py-4">Passed 10+2 Intermediate Exam with Science Stream and Mathematics as a subject.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Apply */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl font-bold text-brand-navy mb-4">How to Apply</h2>
            <div className="prose prose-sm prose-blue max-w-none text-gray-600">
              <ol className="list-decimal list-outside ml-4 space-y-2">
                <li>Visit the official SSC website (ssc.nic.in).</li>
                <li>Register as a new user or log in if you already have an account.</li>
                <li>Click on 'Apply' in the 'Combined Higher Secondary (10+2) Level Examination 2026' section.</li>
                <li>Fill in the application form completely and accurately.</li>
                <li>Upload scanned passport size photograph and signature as per specified dimensions.</li>
                <li>Pay the application fee online.</li>
                <li>Submit the form and print the confirmation page for future reference.</li>
              </ol>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
