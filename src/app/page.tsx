import Link from "next/link";
import { Search, Briefcase, FileText, Award, ChevronRight, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-brand-navy pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[80%] rounded-full bg-brand-blue/20 blur-3xl" />
          <div className="absolute top-[60%] -left-[10%] w-[40%] h-[60%] rounded-full bg-accent-orange/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-sm font-medium mb-6 border border-blue-500/20">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            India's Smartest Government Job Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Your Passport to a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent-green">
              Secure Government Career
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Get instant updates on Sarkari Jobs, Admit Cards, Results, and Answer Keys. 
            Detailed eligibility checking and smart application tracking.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-2">
            <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
              <Search className="h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search jobs by name, organization, or qualification..." 
                className="w-full bg-transparent border-none py-4 px-3 text-gray-900 focus:outline-none focus:ring-0"
              />
            </div>
            <button className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-colors hidden sm:block">
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Latest Jobs", icon: Briefcase, color: "bg-blue-500", href: "/jobs" },
            { title: "Admit Cards", icon: FileText, color: "bg-accent-orange", href: "/admit-cards" },
            { title: "Results", icon: Award, color: "bg-accent-green", href: "/results" },
            { title: "Syllabus", icon: TrendingUp, color: "bg-purple-500", href: "/syllabus" },
          ].map((cat, i) => (
            <Link key={i} href={cat.href} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center card-hover">
              <div className={`h-12 w-12 ${cat.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-md`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-brand-navy">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Latest Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span className="w-1.5 h-6 bg-brand-blue rounded-full"></span>
              Latest Job Openings
            </h2>
            <Link href="/jobs" className="text-sm font-medium text-brand-blue hover:underline flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Dummy Job Cards */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">New</span>
                    <span className="text-sm text-gray-500">SSC CGL 2026</span>
                  </div>
                  <h3 className="text-lg font-bold text-brand-navy hover:text-brand-blue transition-colors cursor-pointer">
                    Combined Graduate Level Examination 2026
                  </h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> 7,500+ Posts</span>
                    <span className="flex items-center gap-1"><Award className="h-4 w-4"/> Bachelor's Degree</span>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2 shrink-0">
                  <span className="text-sm font-medium text-red-600">Last Date: 15 July 2026</span>
                  <Link href={`/jobs/ssc-cgl-${item}`} className="px-6 py-2 bg-brand-light text-brand-navy hover:bg-brand-blue hover:text-white rounded-lg font-medium transition-colors border border-gray-200 hover:border-transparent">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Updates & Trending */}
        <div className="space-y-8">
          {/* Trending Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-brand-navy p-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent-orange" />
                Trending Updates
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { title: "UPSC Civil Services Prelims Result 2026 Declared", tag: "Result", color: "bg-green-100 text-green-700" },
                { title: "RRB NTPC Phase 2 Admit Card Released", tag: "Admit Card", color: "bg-orange-100 text-orange-700" },
                { title: "IBPS PO 2026 Notification Expected Next Week", tag: "Upcoming", color: "bg-blue-100 text-blue-700" },
              ].map((trend, i) => (
                <div key={i} className="group cursor-pointer">
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-sm mb-1 ${trend.color}`}>
                    {trend.tag}
                  </span>
                  <h4 className="text-sm font-medium text-brand-navy group-hover:text-brand-blue transition-colors">
                    {trend.title}
                  </h4>
                  {i !== 2 && <hr className="mt-3 border-gray-100" />}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links / Resources */}
          <div className="bg-brand-light rounded-2xl p-6 border border-blue-100 text-center">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-brand-blue">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-navy mb-2">Create Your Profile</h3>
            <p className="text-sm text-gray-600 mb-4">
              Save jobs, track applications, and check your eligibility automatically.
            </p>
            <Link href="/register" className="block w-full py-2.5 bg-brand-blue hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md shadow-blue-500/20">
              Sign Up Now
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
