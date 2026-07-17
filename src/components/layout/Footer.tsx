import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";
import { getJobs, getSettings } from "@/lib/db";
import ProtectedEmail from "@/components/ui/ProtectedEmail";
import LiveTimestamp from "../ui/LiveTimestamp";

export default async function Footer({ lang = 'en' }: { lang?: string }) {
  const getLink = (path: string) => {
    if (path.startsWith('http') || path.startsWith(`/${lang}`)) return path;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const jobs = await getJobs();
  const settings = await getSettings();
  const latestJob = jobs.sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())[0];
  const lastUpdated = latestJob 
    ? new Date(latestJob.updated_at || latestJob.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })
    : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });

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
              <Link href={getLink("/")} className="text-2xl font-bold tracking-tight text-white block leading-none">GovJobWala</Link>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Your trusted companion for government job updates, results, admit cards, answer keys and more.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              {settings.social_links?.facebook && (
                <Link href={settings.social_links.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: '#1877F2' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                </Link>
              )}
              {settings.social_links?.twitter && (
                <Link href={settings.social_links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 bg-black">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                </Link>
              )}
              {settings.social_links?.youtube && (
                <Link href={settings.social_links.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: '#FF0000' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582 6.186a2.708 2.708 0 0 0-1.904-1.913C17.999 3.8 12 3.8 12 3.8s-5.999 0-7.678.473A2.708 2.708 0 0 0 2.418 6.186C1.945 7.875 1.945 12 1.945 12s0 4.125.473 5.814a2.708 2.708 0 0 0 1.904 1.913C5.999 20.2 12 20.2 12 20.2s5.999 0 7.678-.473a2.708 2.708 0 0 0 1.904-1.913C22.055 16.125 22.055 12 22.055 12s0-4.125-.473-5.814zM9.945 15.188V8.812L15.426 12l-5.481 3.188z"/></svg>
                </Link>
              )}
              {settings.social_links?.telegram && (
                <Link href={settings.social_links.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: '#26A5E4' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.96-.65-.34-1.01.24-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.07-.05-.17-.03-.25-.01-.11.03-1.78 1.14-5.02 3.33-.47.33-.9.49-1.28.48-.42-.01-1.22-.24-1.82-.44-.73-.24-1.31-.37-1.27-.78.02-.22.31-.44.87-.66 3.42-1.49 5.7-2.47 6.84-2.95 3.25-1.36 3.93-1.6 4.38-1.6.1 0 .32.02.46.14.12.1.15.24.16.35.02.06.02.13.01.21z"/></svg>
                </Link>
              )}
              {settings.social_links?.instagram && (
                <Link href={settings.social_links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110" style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </Link>
              )}
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h2 className="text-white font-bold mb-4">Top Categories</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href={getLink("/explore/10th-pass")} className="hover:text-white transition">10th Pass Jobs</Link></li>
              <li><Link href={getLink("/explore/12th-pass")} className="hover:text-white transition">12th Pass Jobs</Link></li>
              <li><Link href={getLink("/explore/graduate")} className="hover:text-white transition">Graduate Jobs</Link></li>
              <li><Link href={getLink("/explore/police")} className="hover:text-white transition">Police Jobs</Link></li>
              <li><Link href={getLink("/explore/banking")} className="hover:text-white transition">Banking Jobs</Link></li>
              <li><Link href={getLink("/explore/up")} className="hover:text-white transition">UP Govt Jobs</Link></li>
              <li><Link href={getLink("/explore/bihar")} className="hover:text-white transition">Bihar Govt Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href={getLink("/jobs")} className="hover:text-white transition">Latest Jobs</Link></li>
              <li><Link href={getLink("/admit-card")} className="hover:text-white transition">Admit Card</Link></li>
              <li><Link href={getLink("/results")} className="hover:text-white transition">Results</Link></li>
              <li><Link href={getLink("/answer-key")} className="hover:text-white transition">Answer Key</Link></li>
              <li><Link href={getLink("/syllabus")} className="hover:text-white transition">Syllabus</Link></li>
              <li><Link href={getLink("/admission")} className="hover:text-white transition">Admission</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4">Tools</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href={getLink("/tools?tab=resizer")} className="hover:text-white transition flex items-center gap-2">Image Resizer</Link></li>
              <li><Link href={getLink("/tools?tab=merger")} className="hover:text-white transition flex items-center gap-2">Photo+Sign Merge</Link></li>
              <li><Link href={getLink("/tools?tab=signature")} className="hover:text-white transition flex items-center gap-2">Signature Pad</Link></li>
              <li><Link href={getLink("/tools?tab=img-to-pdf")} className="hover:text-white transition flex items-center gap-2">Image to PDF</Link></li>
              <li><Link href={getLink("/tools?tab=merge-pdf")} className="hover:text-white transition flex items-center gap-2">Merge PDF</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-white font-bold mb-4">Company & Legal</h2>
            <ul className="space-y-2 text-sm text-gray-300 mb-6">
              <li><Link href={getLink("/about")} className="hover:text-white transition">About Us</Link></li>
              <li><Link href={getLink("/contact")} className="hover:text-white transition">Contact Us</Link></li>
              <li><Link href={getLink("/privacy")} className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href={getLink("/terms")} className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href={getLink("/disclaimer")} className="hover:text-white transition">Disclaimer</Link></li>
              <li><Link href={getLink("/sitemap")} className="hover:text-white transition">HTML Sitemap</Link></li>
            </ul>

            <h2 className="text-white font-bold mb-4">Contact Us</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><ProtectedEmail user="admin" className="hover:text-white transition flex items-center gap-2" /></li>
              <li><ProtectedEmail user="contact" className="hover:text-white transition flex items-center gap-2" /></li>
              <li><ProtectedEmail user="support" className="hover:text-white transition flex items-center gap-2" /></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-300">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2026 GovJobWala. All Rights Reserved.</p>
            <span suppressHydrationWarning className="px-2 py-1 bg-gray-800/50 rounded-md text-gray-300 font-medium tracking-wide">
              Last Updated: <span className="font-bold text-white"><LiveTimestamp initialTimestamp={lastUpdated} /></span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Job Aspirants
          </div>
        </div>
      </div>
    </footer>
  );
}
