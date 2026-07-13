"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileMenu({ lang = 'en' }: { lang?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const getLink = (path: string) => {
    if (path.startsWith('http') || path.startsWith(`/${lang}`)) return path;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const navLinks = [
    { name: "Latest Jobs", href: "/jobs" },
    { name: "Admit Card", href: "/admit-card" },
    { name: "Results", href: "/results" },
    { name: "Answer Key", href: "/answer-key" },
    { name: "Syllabus", href: "/syllabus" },
    { name: "Admission", href: "/admission" },
    { name: "Tools", href: "/tools", isNew: true },
  ];

  return (
    <div className="md:hidden flex items-center">
      <button 
        aria-label="Toggle Menu"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-300 hover:text-white transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0B1B3D] border-t border-gray-800 shadow-xl z-50 flex flex-col px-4 py-4 space-y-4 pb-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getLink(link.href)}
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white font-semibold flex items-center justify-between py-3 border-b border-gray-800 last:border-b-0"
            >
              {link.name === "Tools" ? (
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-center w-full">
                    <span>{link.name}</span>
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase">New</span>
                  </div>
                  <div className="mt-2 pl-4 flex flex-col gap-2 border-l border-gray-700">
                    <Link href={getLink("/tools?tab=resizer")} onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm py-1 block">Image Resizer</Link>
                    <Link href={getLink("/tools?tab=merger")} onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm py-1 block">Photo+Sign Merge</Link>
                    <Link href={getLink("/tools?tab=signature")} onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm py-1 block">Signature Pad</Link>
                    <Link href={getLink("/tools?tab=img-to-pdf")} onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm py-1 block">Image to PDF</Link>
                    <Link href={getLink("/tools?tab=merge-pdf")} onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-sm py-1 block">Merge PDF</Link>
                  </div>
                </div>
              ) : (
                <>
                  <span>{link.name}</span>
                  {link.isNew && (
                    <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase">
                      New
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
