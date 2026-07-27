import React from 'react';

interface CategoryIconProps {
  name: string;
  className?: string;
}

export default function CategoryIcon({ name, className = "w-10 h-10" }: CategoryIconProps) {
  // Normalize the category or icon name to perform robust matching
  const norm = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '');

  // 1. Train / Railway (Vibrant blue & silver locomotive)
  if (norm === 'train' || norm === 'railway' || norm === 'railways') {
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

  // 2. Bank / Banking / Landmark (Emerald green & gold pillars)
  if (norm === 'landmark' || norm === 'bank' || norm === 'banking' || norm === 'building2') {
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

  // 3. Shield / Police / Defence (Crimson red protective badge)
  if (norm === 'shield' || norm === 'shieldcheck' || norm === 'police' || norm === 'defence' || norm === 'defense') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 4L8 12V28C8 42 18 54 32 60C46 54 56 42 56 28V12L32 4Z" fill="#DC2626" />
        <path d="M32 8L12 15V28C12 39 19 49 32 54C45 49 52 39 52 28V15L32 8Z" fill="#EF4444" />
        <path d="M42 26L28 40L22 34" stroke="#FEF2F2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 4. GraduationCap / Admission (Purple graduate cap with gold tassels)
  if (norm === 'graduationcap' || norm === 'admission' || norm === 'university' || norm === 'school' || norm === 'userplus') {
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

  // 5. Admit Card / FileText / Document (Sky blue sheets)
  if (norm === 'filetext' || norm === 'document' || norm === 'admitcard') {
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

  // 6. Answer Key / CheckSquare (Vibrant emerald green checkbox)
  if (norm === 'checksquare' || norm === 'checkcircle' || norm === 'answerkey') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="52" height="52" rx="10" fill="#10B981" />
        <rect x="11" y="11" width="42" height="42" rx="6" fill="#D1FAE5" />
        <path d="M46 20L26 40L18 32" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // 7. Syllabus / BookOpen / Study / SSC / UPSC (Indigo open book)
  if (norm === 'bookopen' || norm === 'book' || norm === 'study' || norm === 'ssc' || norm === 'upsc' || norm === 'syllabus') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="12" width="56" height="44" rx="4" fill="#4F46E5" />
        <path d="M32 12V56" stroke="#312E81" strokeWidth="4" />
        <path d="M8 16H28" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 26H28" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 36H24" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M8 46H20" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 16H56" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 26H56" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 36H52" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
        <path d="M36 46H48" stroke="#EEF2FF" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  // 8. Award / AwardStar / Results (Golden ribbon medal)
  if (norm === 'award' || norm === 'awardstar' || norm === 'results' || norm === 'result') {
    return (
      <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 36L16 60L32 50L48 60L40 36" fill="#F59E0B" />
        <path d="M28 36L22 54L32 46L42 54L36 36" fill="#D97706" />
        <circle cx="32" cy="24" r="18" fill="#F59E0B" />
        <circle cx="32" cy="24" r="14" fill="#FEF3C7" />
        <polygon points="32,15 35,21 42,22 37,27 38,34 32,30 26,34 27,27 22,22 29,21" fill="#F59E0B" />
      </svg>
    );
  }

  // 9. Briefcase / Jobs / LatestJobs (Vibrant blue corporate case)
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="48" height="36" rx="6" fill="#2563EB" />
      <rect x="8" y="20" width="48" height="12" fill="#1D4ED8" />
      <path d="M22 20V12C22 9.79086 23.7909 8 26 8H38C40.2091 8 42 9.79086 42 12V20" stroke="#1E3A8A" strokeWidth="4" />
      <rect x="27" y="28" width="10" height="8" rx="2" fill="#E0F2FE" />
      <circle cx="32" cy="32" r="2" fill="#0284C7" />
    </svg>
  );
}
