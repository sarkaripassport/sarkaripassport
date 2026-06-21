import Link from "next/link";
import { Search, Filter, MapPin, Building, Briefcase, Calendar } from "lucide-react";

export default function JobsListingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy tracking-tight mb-4">
          Latest Government Jobs
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Browse through the latest Sarkari jobs, recruitment notifications, and vacancies across India.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-brand-blue" />
              Smart Filters
            </h2>
            
            {/* Search Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. UPSC, SSC..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                />
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="space-y-2">
                {['Banking', 'Defense', 'Railways', 'SSC', 'UPSC', 'State Govt'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue" />
                    <span className="text-sm text-gray-600 group-hover:text-brand-navy">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Qualification Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
              <div className="space-y-2">
                {['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma'].map((qual) => (
                  <label key={qual} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 text-brand-blue border-gray-300 rounded focus:ring-brand-blue" />
                    <span className="text-sm text-gray-600 group-hover:text-brand-navy">{qual}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-2 bg-brand-navy text-white rounded-lg font-medium hover:bg-brand-blue transition-colors">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="w-full lg:w-3/4 space-y-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover flex flex-col md:flex-row gap-6">
              {/* Job Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-50 text-brand-blue text-xs font-bold rounded-full border border-blue-100">
                    Govt. of India
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Posted 2 days ago
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-brand-navy mb-2 cursor-pointer hover:text-brand-blue transition-colors">
                  Staff Selection Commission (SSC) CHSL Recruitment 2026
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Building className="h-4 w-4 text-gray-400" /> SSC Board</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> All India</div>
                  <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-400" /> 3,712 Vacancies</div>
                  <div className="flex items-center gap-2"><span className="font-semibold text-brand-navy">₹</span> 25,500 - 81,100 / month</div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col justify-center items-start md:items-end gap-3 md:w-48 shrink-0 md:border-l md:border-gray-100 md:pl-6">
                <div className="text-left md:text-right w-full">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Last Date</p>
                  <p className="text-sm font-bold text-accent-red">15 Aug 2026</p>
                </div>
                <Link href={`/jobs/ssc-chsl-2026`} className="w-full text-center py-2.5 px-4 bg-brand-light text-brand-navy border border-gray-200 rounded-lg font-medium hover:bg-brand-blue hover:text-white hover:border-transparent transition-all shadow-sm">
                  View Details
                </Link>
              </div>
            </div>
          ))}

          {/* Pagination Dummy */}
          <div className="flex justify-center pt-8">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">Previous</button>
              <button className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-bold">1</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
