import { LayoutDashboard, Briefcase, FileText, Settings, LogOut, Bell } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F4F7FA] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1B3D] text-white flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 font-black text-xl tracking-tight">
          <span className="text-[#0A58CA]">Naukri</span>Passport <span className="ml-2 text-[10px] bg-red-500 px-1.5 py-0.5 rounded text-white font-bold uppercase tracking-wider">Admin</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0A58CA] text-white font-semibold transition shadow-md">
            <Briefcase className="w-5 h-5" /> Manage Jobs
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition">
            <FileText className="w-5 h-5" /> Content / Pages
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
          <h2 className="font-bold text-[#0B1B3D] text-lg">Smart Publisher</h2>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-[#0B1B3D]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="w-8 h-8 bg-blue-100 text-[#0A58CA] font-bold rounded-full flex items-center justify-center">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
    </div>
  );
}
