import Link from "next/link";
import { LayoutDashboard, FilePlus, Users, Settings, LogOut, Bell } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-navy text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 text-white font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/vacancies/create" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <FilePlus className="h-5 w-5" /> Post Vacancy
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Users className="h-5 w-5" /> Manage Users
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
            <Settings className="h-5 w-5" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors">
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-lg font-medium text-gray-800">Welcome back, Admin</h2>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-brand-blue relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-accent-red rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
