import Link from "next/link";
import { ShieldCheck, Facebook, Twitter, Youtube, Instagram, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B1B3D] text-gray-300 pt-16 pb-8 border-t-4 border-[#0A58CA]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#0A58CA] rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight block leading-none text-white">Naukri Passport</span>
                <span className="text-[10px] text-gray-400 font-medium tracking-wide">Sarkari Jobs + Eligibility Assistant</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your trusted companion for government job updates, results, admit cards, answer keys and more.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A58CA] transition-colors"><Facebook className="w-4 h-4 text-white" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A58CA] transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
              </Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A58CA] transition-colors"><Youtube className="w-4 h-4 text-white" /></Link>
              <Link href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#0A58CA] transition-colors"><Instagram className="w-4 h-4 text-white" /></Link>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/jobs" className="hover:text-white transition">Latest Jobs</Link></li>
              <li><Link href="/admit-card" className="hover:text-white transition">Admit Card</Link></li>
              <li><Link href="/results" className="hover:text-white transition">Results</Link></li>
              <li><Link href="/answer-key" className="hover:text-white transition">Answer Key</Link></li>
              <li><Link href="/syllabus" className="hover:text-white transition">Syllabus</Link></li>
              <li><Link href="/admission" className="hover:text-white transition">Admission</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition flex items-center gap-2">Eligibility Checker <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-sm">New</span></Link></li>
              <li><Link href="#" className="hover:text-white transition flex items-center gap-2">Document Readiness <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-sm">New</span></Link></li>
              <li><Link href="#" className="hover:text-white transition flex items-center gap-2">Application Tracker <span className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-sm">New</span></Link></li>
              <li><Link href="#" className="hover:text-white transition">Notification Alerts</Link></li>
              <li><Link href="#" className="hover:text-white transition">Saved Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link href="/press" className="hover:text-white transition">Press & Media</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Naukri Passport. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Job Aspirants
          </div>
        </div>
      </div>
    </footer>
  );
}
