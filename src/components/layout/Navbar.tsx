import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 bg-brand-blue rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">N</span>
              </div>
              <span className="text-xl font-bold text-brand-navy tracking-tight">
                Naukri <span className="text-brand-blue">Passport</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">Latest Jobs</Link>
            <Link href="/admit-cards" className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">Admit Card</Link>
            <Link href="/results" className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">Results</Link>
            <Link href="/syllabus" className="text-sm font-medium text-brand-gray hover:text-brand-blue transition-colors">Syllabus</Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex p-2 text-brand-gray hover:text-brand-blue hover:bg-blue-50 rounded-full transition-colors" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-navy hover:bg-brand-blue rounded-lg transition-colors shadow-sm">
              <User className="h-4 w-4" />
              Sign In
            </Link>
            <button className="md:hidden p-2 text-brand-gray" aria-label="Mobile menu">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
