import { FileText } from "lucide-react";

import { getSeoAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "Terms of Service | GovJobWala",
    description: "GovJobWala Terms of Service",
    alternates: getSeoAlternates(lang, '/terms')
  };
}


export default function TermsPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-gray-500">Last Updated: October 2023</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-blue max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Welcome to <strong>GovJobWala</strong>. By accessing this website, we assume you accept these terms and conditions. Do not continue to use GovJobWala if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">1. General Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            GovJobWala is an independent job portal that aggregates information about government jobs, results, and admit cards from various public sources. We are <strong>not</strong> affiliated with, endorsed by, or sponsored by any government organization or agency. All information provided on this website is for educational and informational purposes only.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">2. Accuracy of Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. You are advised to verify the details from official government notification PDFs and websites before applying.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">3. User Conduct</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            When using our platform, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>Provide accurate information when creating an account or subscribing to alerts.</li>
            <li>Not use the website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</li>
            <li>Not use the website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">4. Liability</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
          </p>

        </div>
      </div>
    </div>
  );
}
