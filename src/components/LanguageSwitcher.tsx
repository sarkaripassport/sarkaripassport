"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
];

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLanguageUrl = (langCode: string) => {
    if (!pathname) return `/${langCode}`;
    // Replace the current language code in the pathname with the new one
    // pathname looks like /en/jobs or /hi/admit-card
    const pathParts = pathname.split('/');
    if (pathParts.length > 1 && ['en', 'hi', 'mr'].includes(pathParts[1])) {
      pathParts[1] = langCode;
      return pathParts.join('/');
    }
    // Fallback if not found
    return `/${langCode}${pathname}`;
  };

  const currentLangLabel = languages.find(l => l.code === currentLang)?.label || "English";

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-white"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="hidden sm:inline">{currentLangLabel}</span>
        <span className="sm:hidden">{currentLang.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200">
          <div className="py-1">
            {languages.map((lang) => (
              <Link
                key={lang.code}
                href={getLanguageUrl(lang.code)}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors ${
                  currentLang === lang.code 
                    ? "bg-blue-50 text-blue-700 font-bold" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {lang.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
