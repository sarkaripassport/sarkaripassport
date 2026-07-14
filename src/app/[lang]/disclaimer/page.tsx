import { AlertTriangle } from "lucide-react";

import { getSeoAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "Disclaimer | GovJobWala",
    description: "GovJobWala Disclaimer",
    alternates: getSeoAlternates(lang, '/disclaimer')
  };
}


export default function DisclaimerPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-6 shadow-lg shadow-red-900/10">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4 tracking-tight">
            Disclaimer
          </h1>
          <p className="text-gray-500">Last Updated: October 2023</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-blue max-w-none">
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg mb-8">
            <h3 className="text-amber-800 font-bold mt-0 mb-2">Important Notice</h3>
            <p className="text-amber-700 m-0 leading-relaxed">
              <strong>GovJobWala (govjobwala.com) is NOT a government website.</strong> We are an independent educational portal providing aggregated information about government jobs, results, and admit cards.
            </p>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Please read this disclaimer carefully before using the GovJobWala website.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">No Government Affiliation</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            GovJobWala operates as an independent entity. We are not affiliated with, endorsed by, or in any way officially connected with the Government of India, any State Governments, or any of their agencies, departments, or public sector undertakings (PSUs). The official websites of the respective government organizations should always be your primary source of information.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">Accuracy of Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            While our team works diligently to ensure that the information provided on our portal—such as job vacancies, syllabus, admit cards, and results—is accurate and up to date, human errors may occur. The information is gathered from various public sources, employment news, and official government websites. 
            <br /><br />
            <strong>We strongly advise all candidates to verify the details directly from the official notifications and official government websites before applying for any position.</strong> We do not take responsibility for any typing errors, omissions, or inaccuracies in the published content.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">No Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Under no circumstances will GovJobWala, its owners, employees, or affiliates be held liable for any direct, indirect, incidental, or consequential damages arising out of the use of or inability to use this website. This includes, but is not limited to, missing a deadline, application rejection, or financial loss due to reliance on the information provided on this platform.
          </p>
          
          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">External Links</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Through this website, you are able to link to other websites which are not under the control of GovJobWala. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
          </p>
        </div>
      </div>
    </div>
  );
}
