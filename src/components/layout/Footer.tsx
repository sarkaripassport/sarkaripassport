import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-brand-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">N</span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                Naukri Passport
              </span>
            </div>
            <p className="text-sm text-gray-400">
              India's smartest and most trusted platform for government job seekers. Find your next career move with advanced tools.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/jobs" className="hover:text-white transition-colors">Latest Jobs</Link></li>
              <li><Link href="/admit-cards" className="hover:text-white transition-colors">Admit Cards</Link></li>
              <li><Link href="/results" className="hover:text-white transition-colors">Results</Link></li>
              <li><Link href="/answer-keys" className="hover:text-white transition-colors">Answer Keys</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/syllabus" className="hover:text-white transition-colors">Syllabus</Link></li>
              <li><Link href="/eligibility" className="hover:text-white transition-colors">Eligibility Checker</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Admin & Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Naukri Passport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
