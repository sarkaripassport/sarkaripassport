'use client';

import Link from "next/link";
import { Briefcase, FileText, CheckCircle2, TrendingUp, AlertTriangle, PenTool, Globe, Link as LinkIcon, HeartPulse } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [analytics, setAnalytics] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(data => setAnalytics(data))
      .catch(e => console.error(e));

    Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/categories').then(r => r.json())
    ]).then(([jobsData, categoriesData]) => {
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setLoadingStats(false);
    }).catch(e => {
      console.error(e);
      setLoadingStats(false);
    });
  }, []);

  const getISOWeek = (date: Date) => {
    const tdt = new Date(date.valueOf());
    const dayn = (date.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000);
  };

  const now = new Date();
  const dayKey = now.toISOString().split('T')[0];
  const weekKey = `${now.getFullYear()}-W${getISOWeek(now)}`;
  const monthKey = dayKey.substring(0, 7);

  const admitCardsCount = jobs.filter(j => j.category === 'Admit Card' || j.categories?.includes('Admit Card')).length;
  const resultsCount = jobs.filter(j => j.category === 'Results' || j.categories?.includes('Results')).length;

  return (
    <div className="p-4 sm:p-6 max-w-[1400px]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl text-[#1d2327] font-normal">Dashboard</h1>
        <Link href="/admin/editor" className="bg-[#0A58CA] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow flex items-center gap-2 transition-all hover:scale-105">
          <PenTool className="w-5 h-5" /> 
          Go to Advanced CMS Editor 
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* At a Glance Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm flex flex-col">
          <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="font-semibold text-[#1d2327]">At a Glance</h2>
          </div>
          <div className="p-4 flex-grow">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/jobs" className="flex items-center gap-2 text-[#2271b1] hover:underline hover:text-[#135e96]">
                <Briefcase className="w-4 h-4" /> {loadingStats ? '...' : jobs.length} Jobs
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-2 text-[#2271b1] hover:underline hover:text-[#135e96]">
                <FileText className="w-4 h-4" /> {loadingStats ? '...' : categories.length} Categories
              </Link>
              <Link href="/admin/jobs?category=Admit Card" className="flex items-center gap-2 text-[#2271b1] hover:underline hover:text-[#135e96]">
                <Globe className="w-4 h-4" /> {loadingStats ? '...' : admitCardsCount} Admit Cards
              </Link>
              <Link href="/admin/jobs?category=Results" className="flex items-center gap-2 text-[#2271b1] hover:underline hover:text-[#135e96]">
                <TrendingUp className="w-4 h-4" /> {loadingStats ? '...' : resultsCount} Results
              </Link>
            </div>
            <div className="mt-4 pt-4 border-t border-[#dcdcde] text-sm text-[#50575e]">
              GovJobWala v1.0 running on <strong>Next.js 15</strong>. Theme: <span className="text-[#2271b1]">WP-Sarkari</span>.
            </div>
          </div>
        </div>

        {/* Real-time Analytics Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm flex flex-col xl:col-span-3">
          <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
            <h2 className="font-semibold text-[#1d2327]">Real-time Traffic & Analytics</h2>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="p-6">
            {!analytics ? (
              <div className="text-sm text-gray-500">Loading metrics...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="text-sm text-blue-600 font-semibold mb-1">Today's Views</div>
                  <div className="text-4xl font-bold text-blue-900">{analytics.global.daily[dayKey] || 0}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                  <div className="text-sm text-green-600 font-semibold mb-1">This Week</div>
                  <div className="text-4xl font-bold text-green-900">{analytics.global.weekly[weekKey] || 0}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                  <div className="text-sm text-purple-600 font-semibold mb-1">This Month</div>
                  <div className="text-4xl font-bold text-purple-900">{analytics.global.monthly[monthKey] || 0}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-100">
                  <div className="text-sm text-orange-600 font-semibold mb-1">Top Performing Job (Today)</div>
                  <div className="text-lg font-bold text-orange-900 truncate mt-2">
                    {Object.entries(analytics.jobs).sort((a:any, b:any) => (b[1].daily[dayKey]||0) - (a[1].daily[dayKey]||0))[0]?.[0] || 'N/A'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Draft Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm flex flex-col">
          <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="font-semibold text-[#1d2327]">Quick Draft</h2>
          </div>
          <div className="p-4 flex-grow space-y-3">
            <input 
              type="text" 
              placeholder="Title (e.g. UPSC Prelims Admit Card)" 
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#8c8f94] text-[13px] text-[#3c434a] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none"
            />
            <textarea 
              rows={4}
              placeholder="What's on your mind?"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#8c8f94] text-[13px] text-[#3c434a] focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none resize-none"
            />
            <button className="px-3 py-1.5 border border-[#2271b1] bg-[#f6f7f7] text-[#2271b1] text-[13px] hover:bg-[#f0f0f1] font-semibold transition-colors">
              Save Draft
            </button>
          </div>
        </div>

        {/* SEO Health Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm flex flex-col">
          <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7] flex justify-between items-center">
            <h2 className="font-semibold text-[#1d2327]">SEO Health Status</h2>
            <HeartPulse className="w-4 h-4 text-green-600" />
          </div>
          <div className="p-4 flex-grow space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#3c434a]">Overall Score</span>
              <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded">Good (85/100)</span>
            </div>
            
            <ul className="space-y-2 text-[13px] text-[#3c434a]">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>12 posts missing Focus Keyword</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>5 posts with Meta Description too short</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>No broken links found</span>
              </li>
            </ul>
            <div className="mt-2 pt-3 border-t border-[#dcdcde]">
              <Link href="#" className="text-[#2271b1] hover:underline hover:text-[#135e96] text-[13px]">Run SEO Audit</Link>
            </div>
          </div>
        </div>

        {/* Activity Widget */}
        <div className="bg-white border border-[#c3c4c7] shadow-sm flex flex-col lg:col-span-2 xl:col-span-3">
          <div className="p-3 border-b border-[#c3c4c7] bg-[#f6f7f7]">
            <h2 className="font-semibold text-[#1d2327]">Activity</h2>
          </div>
          <div className="p-4 flex flex-col sm:flex-row gap-8">
            <div className="flex-1">
              <h3 className="font-bold text-[#1d2327] mb-3 text-[13px]">Recently Published</h3>
              <ul className="space-y-3">
                <li className="flex gap-4 text-[13px]">
                  <span className="text-[#50575e] w-24 shrink-0">Today, 8:42 am</span>
                  <Link href="#" className="text-[#2271b1] hover:underline hover:text-[#135e96]">SSC CGL 2026 Notification Released</Link>
                </li>
                <li className="flex gap-4 text-[13px]">
                  <span className="text-[#50575e] w-24 shrink-0">Yesterday, 4:15 pm</span>
                  <Link href="#" className="text-[#2271b1] hover:underline hover:text-[#135e96]">Railway RRB ALP Admit Card Download Link</Link>
                </li>
                <li className="flex gap-4 text-[13px]">
                  <span className="text-[#50575e] w-24 shrink-0">Jun 21, 10:00 am</span>
                  <Link href="#" className="text-[#2271b1] hover:underline hover:text-[#135e96]">UP Police Constable Result Declared</Link>
                </li>
              </ul>
            </div>
            
            <div className="w-px bg-[#dcdcde] hidden sm:block"></div>
            
            <div className="flex-1">
              <h3 className="font-bold text-[#1d2327] mb-3 text-[13px]">Recent Drafts</h3>
              <ul className="space-y-3">
                <li className="text-[13px]">
                  <Link href="#" className="font-semibold text-[#2271b1] hover:underline hover:text-[#135e96]">IB ACIO Tier 2 Syllabus 2026</Link>
                  <div className="text-[#50575e] text-xs mt-0.5">Last modified June 20, 2026</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
