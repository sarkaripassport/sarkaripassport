import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#0B1B3D] text-white border-b border-gray-800 sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#061129] py-1 border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <Link href="/sitemap.xml" className="text-[10px] text-gray-400 hover:text-white transition-colors">
            Sitemap
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0A58CA] rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <Link href="/" className="text-xl font-bold tracking-tight block leading-none">Naukri Passport</Link>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">Sarkari Jobs + Eligibility Assistant</span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-semibold">
            <Link href="/jobs" className="hover:text-[#0A58CA] transition-colors border-b-2 border-transparent hover:border-[#0A58CA] py-5">Latest Jobs</Link>
            <Link href="/admit-card" className="text-gray-300 hover:text-white transition-colors py-5">Admit Card</Link>
            <Link href="/results" className="text-gray-300 hover:text-white transition-colors py-5">Results</Link>
            <Link href="/answer-key" className="text-gray-300 hover:text-white transition-colors py-5">Answer Key</Link>
            <Link href="/syllabus" className="text-gray-300 hover:text-white transition-colors py-5">Syllabus</Link>
            <Link href="/admission" className="text-gray-300 hover:text-white transition-colors py-5">Admission</Link>
            <Link href="/tools" className="text-gray-300 hover:text-white transition-colors py-5 flex items-center gap-1">
              Tools <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm font-bold uppercase">New</span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white hidden sm:block">
              <Search className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-gray-700 hidden sm:block"></div>
            <Link href="/login" className="hidden sm:block px-5 py-2 text-sm font-bold border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-5 py-2 text-sm font-bold bg-[#0A58CA] text-white rounded-lg hover:bg-blue-700 shadow-md transition-colors">
              Create Profile
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
