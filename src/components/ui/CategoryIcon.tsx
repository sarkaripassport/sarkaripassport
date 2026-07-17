import React from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export default function CategoryIcon({ name, className = "w-10 h-10" }: CategoryIconProps) {
  // A mapping of our lucide icon names to beautiful, colorful, multi-layered SVG illustrations.
  
  if (name === 'Train') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="8" width="40" height="48" rx="8" fill="#1E3A8A" />
        <rect x="18" y="16" width="28" height="16" rx="4" fill="#60A5FA" />
        <path d="M12 44L8 56H56L52 44H12Z" fill="#3B82F6" />
        <circle cx="20" cy="40" r="4" fill="#FBBF24" />
        <circle cx="44" cy="40" r="4" fill="#FBBF24" />
        <rect x="28" y="4" width="8" height="4" fill="#9CA3AF" />
        <path d="M20 56L16 64H24L20 56Z" fill="#4B5563" />
        <path d="M44 56L40 64H48L44 56Z" fill="#4B5563" />
      </svg>
    );
  }

  if (name === 'Landmark') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4L4 24H60L32 4Z" fill="#059669" />
        <path d="M32 10L12 24H52L32 10Z" fill="#34D399" />
        <rect x="8" y="24" width="48" height="4" fill="#064E3B" />
        <rect x="12" y="28" width="6" height="28" fill="#10B981" />
        <rect x="24" y="28" width="6" height="28" fill="#10B981" />
        <rect x="36" y="28" width="6" height="28" fill="#10B981" />
        <rect x="48" y="28" width="6" height="28" fill="#10B981" />
        <rect x="4" y="56" width="56" height="6" fill="#064E3B" />
      </svg>
    );
  }

  if (name === 'Shield' || name === 'ShieldCheck') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4L8 12V28C8 42 18 54 32 60C46 54 56 42 56 28V12L32 4Z" fill="#DC2626" />
        <path d="M32 8L12 15V28C12 39 19 49 32 54C45 49 52 39 52 28V15L32 8Z" fill="#EF4444" />
        <path d="M42 26L28 40L22 34" stroke="#FEF2F2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === 'GraduationCap') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 12L4 24L32 36L60 24L32 12Z" fill="#4C1D95" />
        <path d="M16 30.5V44C16 50 24 54 32 54C40 54 48 50 48 44V30.5" fill="#7C3AED" />
        <path d="M60 24V40" stroke="#F59E0B" strokeWidth="4" />
        <circle cx="60" cy="42" r="4" fill="#FBBF24" />
        <path d="M60 46V56" stroke="#F59E0B" strokeWidth="4" />
      </svg>
    );
  }

  if (name === 'FileText') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="4" width="40" height="56" rx="4" fill="#38BDF8" />
        <rect x="16" y="8" width="32" height="48" rx="2" fill="#E0F2FE" />
        <rect x="22" y="18" width="20" height="4" rx="2" fill="#0284C7" />
        <rect x="22" y="28" width="20" height="4" rx="2" fill="#0284C7" />
        <rect x="22" y="38" width="14" height="4" rx="2" fill="#0284C7" />
        <circle cx="44" cy="46" r="6" fill="#EF4444" />
        <circle cx="44" cy="46" r="3" fill="#FCA5A5" />
      </svg>
    );
  }
  
  if (name === 'Building2') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="12" width="32" height="52" fill="#4F46E5" />
        <rect x="20" y="8" width="24" height="4" fill="#312E81" />
        <rect x="24" y="20" width="6" height="8" fill="#A5B4FC" />
        <rect x="34" y="20" width="6" height="8" fill="#A5B4FC" />
        <rect x="24" y="32" width="6" height="8" fill="#A5B4FC" />
        <rect x="34" y="32" width="6" height="8" fill="#A5B4FC" />
        <rect x="24" y="44" width="6" height="8" fill="#A5B4FC" />
        <rect x="34" y="44" width="6" height="8" fill="#A5B4FC" />
        <rect x="12" y="60" width="40" height="4" fill="#1E1B4B" />
      </svg>
    );
  }

  // Fallback beautiful Briefcase for "Briefcase" or unknown
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="48" height="36" rx="4" fill="#D97706" />
      <rect x="8" y="20" width="48" height="12" fill="#B45309" />
      <path d="M24 20V12C24 9.79086 25.7909 8 28 8H36C38.2091 8 40 9.79086 40 12V20" stroke="#78350F" strokeWidth="4" />
      <rect x="28" y="28" width="8" height="6" rx="2" fill="#FCD34D" />
    </svg>
  );
}
