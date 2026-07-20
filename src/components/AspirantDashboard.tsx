"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Search, ChevronRight, Loader2, Sparkles, X } from "lucide-react";
import Image from "next/image";

export default function AspirantDashboard({ lang }: { lang: 'en' | 'hi' | 'mr' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<{ qualification: string; state: string } | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const qualifications = ["10th Pass", "12th Pass", "ITI", "Diploma", "Graduate", "Post Graduate", "B.Tech/B.E.", "Medical"];
  const states = ["Uttar Pradesh", "Maharashtra", "Bihar", "Madhya Pradesh", "Rajasthan", "Delhi", "All India"];

  useEffect(() => {
    // Load from local storage
    const saved = localStorage.getItem('aspirant_profile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile(p);
      fetchMatchingJobs(p.qualification, p.state);
    } else {
      // Auto open if first time
      setIsOpen(true);
    }
  }, []);

  const fetchMatchingJobs = async (qual: string, state: string) => {
    setLoading(true);
    try {
      // We do a client side filter on the public API for simplicity
      const res = await fetch(`/api/jobs`);
      const data = await res.json();
      if (!data.error) {
        // Filter jobs based on keyword match in title, quick_facts, or tags
        const matched = data.filter((job: any) => {
          if (!job.isLive) return false;
          const searchStr = `${job.title?.en} ${job.quick_facts?.qualifications?.en} ${job.quick_facts?.job_location?.en}`.toLowerCase();
          
          // Simple heuristic matching
          const matchQual = qual === "All India" ? true : searchStr.includes(qual.toLowerCase().replace(' pass', ''));
          const matchState = state === "All India" ? true : searchStr.includes(state.toLowerCase());
          
          return matchQual || matchState;
        }).slice(0, 3); // Top 3 matches
        setJobs(matched);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const saveProfile = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const p = {
      qualification: formData.get('qualification') as string,
      state: formData.get('state') as string
    };
    localStorage.setItem('aspirant_profile', JSON.stringify(p));
    setProfile(p);
    setIsOpen(false);
    fetchMatchingJobs(p.qualification, p.state);
  };

  const translations = {
    en: {
      title: "Your Personalized Job Board",
      subtitle: "Jobs matching your profile",
      setup: "Setup Your Profile",
      qual: "Highest Qualification",
      state: "Target State",
      save: "Find My Jobs",
      empty: "No exact matches found right now. Check Latest Jobs.",
      viewAll: "View All Matches"
    },
    hi: {
      title: "आपका व्यक्तिगत जॉब बोर्ड",
      subtitle: "आपकी प्रोफ़ाइल से मेल खाने वाली नौकरियां",
      setup: "अपनी प्रोफ़ाइल सेट करें",
      qual: "उच्चतम योग्यता",
      state: "लक्ष्य राज्य",
      save: "मेरी नौकरियां खोजें",
      empty: "अभी कोई सटीक मेल नहीं मिला। नवीनतम नौकरियां देखें।",
      viewAll: "सभी मेल देखें"
    },
    mr: {
      title: "तुमचा वैयक्तिकृत जॉब बोर्ड",
      subtitle: "तुमच्या प्रोफाईलशी जुळणाऱ्या नोकऱ्या",
      setup: "तुमचे प्रोफाईल सेट करा",
      qual: "उच्चतम पात्रता",
      state: "लक्ष्य राज्य",
      save: "माझ्या नोकऱ्या शोधा",
      empty: "सध्या कोणतेही अचूक जुळणारे आढळले नाहीत. नवीन नोकऱ्या तपासा.",
      viewAll: "सर्व जुळणारे पहा"
    }
  };

  const t = translations[lang] || translations.en;

  if (!profile && !isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="font-bold">{t.setup}</span>
        </div>
        <ChevronRight className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden relative">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-blue-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            {t.title}
          </h2>
          {profile && (
            <p className="text-xs text-blue-700 font-medium mt-1">
              {profile.qualification} • {profile.state}
            </p>
          )}
        </div>
        
        {profile && (
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs bg-white px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 font-bold hover:bg-blue-60 transition"
          >
            {isOpen ? "Close" : "Edit Profile"}
          </button>
        )}
      </div>

      {isOpen && (
        <form onSubmit={saveProfile} className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.qual}</label>
              <select name="qualification" defaultValue={profile?.qualification || "12th Pass"} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">{t.state}</label>
              <select name="state" defaultValue={profile?.state || "All India"} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#0A58CA] text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2">
            <Search className="w-4 h-4" /> {t.save}
          </button>
        </form>
      )}

      {profile && !isOpen && (
        <div className="p-4 bg-white">
          {loading ? (
            <div className="flex justify-center items-center py-6 text-blue-600">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : jobs.length > 0 ? (
            <div className="space-y-3">
              {jobs.map(job => (
                <Link key={job.id} href={`/${lang}/jobs/${job.slug}`} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition group">
                   {job.logo_url && job.logo_url.replace(/['"]/g, '').trim().startsWith("http") ? (
                      <div className="w-10 h-10 shrink-0 bg-white rounded border border-gray-100 p-0.5">
                        <Image src={job.logo_url.replace(/['"]/g, '').trim()} alt={job.organization?.[lang]} width={40} height={40} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 shrink-0 bg-blue-100 rounded text-blue-600 font-bold flex items-center justify-center">
                        {job.organization?.[lang]?.charAt(0) || 'G'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{job.title?.[lang]}</h3>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{job.organization?.[lang]}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 shrink-0" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-gray-500 font-medium">
              {t.empty}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
