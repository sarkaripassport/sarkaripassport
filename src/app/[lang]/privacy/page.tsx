import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Naukri Passport",
  description: "Read our Privacy Policy to understand how Naukri Passport collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0B1B3D] mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500">Last Updated: October 2023</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 prose prose-blue max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            At <strong>Naukri Passport</strong>, we respect your privacy and are committed to protecting it. This Privacy Policy explains our practices regarding the collection, use, and disclosure of information that we receive through our website and services.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We collect information from you when you visit our site, register an account, subscribe to our newsletter, or fill out a form. This may include:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and location (if you choose to provide it).</li>
            <li><strong>Usage Data:</strong> Information on how you interact with our website, including IP address, browser type, pages visited, and time spent.</li>
            <li><strong>Cookies:</strong> Small data files stored on your device to enhance your user experience.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Any of the information we collect from you may be used in one of the following ways:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li>To personalize your experience and deliver content relevant to your job search.</li>
            <li>To improve our website based on the information and feedback we receive from you.</li>
            <li>To send periodic emails regarding job updates, alerts, and notifications.</li>
            <li>To respond to your customer service requests and support needs.</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">3. Protection of Your Information</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            We implement a variety of security measures to maintain the safety of your personal information. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">4. Third-Party Links</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Occasionally, at our discretion, we may include or offer third-party products, services, or links to official government websites on our platform. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
          </p>

          <h2 className="text-2xl font-bold text-[#0B1B3D] mt-10 mb-4">5. Contacting Us</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            If there are any questions regarding this privacy policy, you may contact us using the information below:
          </p>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 inline-block">
            <p className="font-bold text-[#0B1B3D] mb-1">Naukri Passport HQ</p>
            <p className="text-gray-600 mb-2">Nashik, Maharashtra, India</p>
            <a href="mailto:support.naukaripassport@gmail.com" className="text-[#0A58CA] font-bold hover:underline">
              support.naukaripassport@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
