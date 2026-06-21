import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Users", val: "12,450", icon: Users, color: "text-blue-600 bg-blue-100" },
          { title: "Active Vacancies", val: "342", icon: FileText, color: "text-orange-600 bg-orange-100" },
          { title: "Applications Submitted", val: "8,920", icon: CheckCircle, color: "text-green-600 bg-green-100" },
          { title: "Daily Traffic", val: "45K", icon: TrendingUp, color: "text-purple-600 bg-purple-100" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity (Placeholder) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-gray-800">New Vacancy Posted: SSC CHSL 2026</p>
                <p className="text-xs text-gray-500">by Content Editor • 2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">Published</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
