'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Briefcase, FileText, Settings, 
  LogOut, Bell, ChevronDown, Monitor, Search, Plus, User, Megaphone, 
  ShieldCheck, BarChart, PenTool, LayoutTemplate, Link as LinkIcon
} from "lucide-react";

export default function AdminClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditor = pathname === '/admin/editor';

  // Mock state for expandable menus
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    jobs: true,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f0f1] font-sans text-[13px] text-[#3c434a]">
      
      {/* 1. Global Admin Bar (Top Bar) - WP Style */}
      <div className="h-8 bg-[#040D21] text-gray-300 flex items-center justify-between px-4 shrink-0 z-50 sticky top-0">
        <div className="flex items-center h-full">
          {/* Logo & Site Link */}
          <Link href="/" className="flex items-center gap-2 h-full px-3 hover:text-white hover:bg-white/10 transition-colors">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold tracking-wide">Naukri Passport</span>
          </Link>
          
          {/* Quick Add Menu */}
          <div className="group relative h-full flex items-center">
            <Link href="/admin/editor" className="flex items-center gap-1 h-full px-3 hover:text-white hover:bg-white/10 transition-colors">
              <Plus className="w-4 h-4" />
              <span>New Post</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center h-full">
          <div className="flex items-center gap-2 h-full px-3 text-white">
            <span className="text-xs">Howdy, <strong>Super Admin</strong></span>
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-[10px]">
              A
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* 2. Sarkari-Specific WP Sidebar (Left) */}
        {!isEditor && (
        <aside className="w-40 sm:w-48 bg-[#0B1B3D] text-[#b3b9bf] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
          
          <div className="py-2">
            
            {/* Dashboard */}
            <Link href="/admin" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <LayoutDashboard className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Dashboard</span>
            </Link>

            <div className="my-2 border-t border-white/10"></div>

            
            {/* Breaking News Dedicated Link */}
            <Link href="/admin/announcements" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-red-600 transition-colors group">
              <Megaphone className="w-5 h-5 text-red-400 group-hover:text-white" /> 
              <span className="font-bold text-red-300 group-hover:text-white">Breaking News</span>
            </Link>

            <div className="my-2 border-t border-white/10"></div>

            {/* Jobs Menu (Expandable) */}
            <div>
              <button 
                onClick={() => toggleMenu('jobs')}
                className={`w-full flex items-center justify-between px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group ${openMenus.jobs ? 'text-white bg-[#0A58CA]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
                  <span className="font-medium">Job Postings</span>
                </div>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${openMenus.jobs ? 'rotate-180' : ''}`} />
              </button>
              {openMenus.jobs && (
                <div className="bg-[#061129] py-1 text-[12px]">
                  <Link href="/admin/jobs" className="block px-10 py-1.5 hover:text-white transition-colors">All Jobs</Link>
                  <Link href="/admin/editor" className="block px-10 py-1.5 hover:text-white transition-colors">Add New</Link>
                  <Link href="/admin/categories" className="block px-10 py-1.5 hover:text-white transition-colors">Categories</Link>
                </div>
              )}
            </div>

            {/* Updates Menu (Expandable) */}
            <div>
              <button 
                onClick={() => toggleMenu('updates')}
                className={`w-full flex items-center justify-between px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group ${openMenus.updates ? 'text-white bg-[#0A58CA]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
                  <span className="font-medium">Updates</span>
                </div>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${openMenus.updates ? 'rotate-180' : ''}`} />
              </button>
              {openMenus.updates && (
                <div className="bg-[#061129] py-1 text-[12px]">
                  <Link href="#" className="block px-10 py-1.5 hover:text-white transition-colors">Admit Cards</Link>
                  <Link href="#" className="block px-10 py-1.5 hover:text-white transition-colors">Results</Link>
                  <Link href="#" className="block px-10 py-1.5 hover:text-white transition-colors">Answer Keys</Link>
                  <Link href="#" className="block px-10 py-1.5 hover:text-white transition-colors">Syllabus</Link>
                </div>
              )}
            </div>

            <div className="my-2 border-t border-white/10"></div>

            {/* Pages */}
            <div>
              <button 
                onClick={() => toggleMenu('pages')}
                className={`w-full flex items-center justify-between px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group ${openMenus.pages ? 'text-white bg-[#0A58CA]' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
                  <span className="font-medium">Pages</span>
                </div>
                <ChevronDown className={`w-4 h-4 opacity-70 transition-transform ${openMenus.pages ? 'rotate-180' : ''}`} />
              </button>
              {openMenus.pages && (
                <div className="bg-[#061129] py-1 text-[12px]">
                  <Link href="#" className="block px-10 py-1.5 hover:text-white transition-colors">All Pages</Link>
                  <Link href="/admin/editor" className="block px-10 py-1.5 hover:text-white transition-colors">Add New</Link>
                </div>
              )}
            </div>

            {/* SEO & Tools */}
            <Link href="#" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <Search className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">SEO Configuration</span>
            </Link>

            <div className="my-2 border-t border-white/10"></div>

            {/* Advanced WP Items */}
            <Link href="/admin/homepage" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <LayoutTemplate className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Homepage Layout</span>
            </Link>

            <Link href="/admin/pages" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <FileText className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Landing Pages</span>
            </Link>
            
            <Link href="#" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <User className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Users</span>
            </Link>

            <Link href="#" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <PenTool className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Tools</span>
            </Link>

            <Link href="/admin/settings" className="flex items-center gap-2 px-3 py-2 hover:text-white hover:bg-[#0A58CA] transition-colors group">
              <Settings className="w-5 h-5 opacity-70 group-hover:opacity-100" /> 
              <span className="font-medium">Settings</span>
            </Link>

          </div>
          
          <div className="mt-auto p-3">
             <button className="flex items-center gap-2 w-full px-2 py-2 text-gray-500 hover:text-white hover:bg-[#0A58CA] rounded transition-colors text-xs font-bold">
               <LogOut className="w-4 h-4" /> Collapse Menu
             </button>
          </div>

        </aside>
        )}

        {/* 3. Main Content Workspace */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>

      </div>
    </div>
  );
}
