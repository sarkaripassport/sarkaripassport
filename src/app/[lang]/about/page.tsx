import { ShieldCheck, Target, Zap, Heart, CheckCircle2 } from "lucide-react";

import { Metadata } from "next";
import ProtectedEmail from "@/components/ui/ProtectedEmail";
import { getSeoAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "About Us | GovJobWala",
    description: "Learn about GovJobWala - Your trusted companion for government jobs, results, admit cards, and eligibility checking.",
    alternates: getSeoAlternates(lang, '/about')
  };
}


export default function AboutPage() {
  return (
    <div className="bg-[#F4F7FA] min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0B1B3D] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500 rounded-full blur-3xl opacity-10 pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A58CA] rounded-2xl mb-6 shadow-lg shadow-blue-900/50">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Your Trusted Companion for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-400">Government Jobs</span>
          </h1>
          <p className="text-blue-100/80 md:text-xl max-w-3xl mx-auto leading-relaxed">
            At GovJobWala, we believe finding a government job shouldn't be complicated. We bridge the gap between aspirants and opportunities with genuine, lightning-fast updates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-[#0A58CA]" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To democratize access to government job information across India. We strive to provide the most accurate, timely, and easy-to-understand updates for Sarkari Naukri, Admit Cards, and Results so that no deserving candidate misses an opportunity.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1B3D] mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become India's most advanced and personalized career platform for government aspirants, leveraging technology to predict eligibility, recommend jobs, and guide candidates through every step of their examination journey.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-black text-[#0B1B3D] text-center mb-10">Why Choose GovJobWala?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Lightning Fast Updates", desc: "Get notified about new vacancies and admit cards the moment they are released by the government." },
              { title: "100% Genuine Information", desc: "Every job posting is manually verified with official government notifications and PDFs." },
              { title: "Smart Eligibility Checker", desc: "Don't waste time reading long PDFs. Our tools tell you instantly if you are eligible to apply." },
              { title: "Zero Clutter Design", desc: "No annoying popups or confusing links. Just a clean, premium experience designed for candidates." },
              { title: "Multi-language Support", desc: "Access critical job updates in English, Hindi, and Marathi to ensure language is never a barrier." },
              { title: "Made for Mobile", desc: "A seamless experience whether you are checking results on your phone or applying from a cyber cafe." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#0B1B3D] mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us Block */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-black text-[#0B1B3D] mb-6">Contact Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions or want to partner with us? Reach out directly to our respective teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <ProtectedEmail user="admin" className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-[#0A58CA] hover:shadow-md transition" />
            <ProtectedEmail user="contact" className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-[#0A58CA] hover:shadow-md transition" />
            <ProtectedEmail user="support" className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 font-bold text-[#0A58CA] hover:shadow-md transition" />
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="bg-gradient-to-br from-[#0B1B3D] to-[#0A58CA] rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <Heart className="w-12 h-12 text-red-400 fill-current mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black mb-4">Join Our Community</h2>
            <p className="text-blue-100 max-w-2xl mx-auto mb-8 text-lg">
              Thousands of aspirants trust GovJobWala daily. Let us help you secure your dream government job.
            </p>
            <a href="/jobs" className="inline-block bg-white text-[#0A58CA] font-bold px-8 py-3.5 rounded-lg hover:bg-gray-50 transition-colors shadow-md">
              Explore Latest Jobs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
