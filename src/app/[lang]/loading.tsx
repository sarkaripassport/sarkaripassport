export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-16 min-h-screen">
      {/* Hero Skeleton */}
      <div className="w-full md:w-3/4 space-y-4 mb-10 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-8 md:h-10 bg-gray-200 rounded w-full max-w-lg"></div>
        <div className="h-4 bg-gray-200 rounded w-full max-w-md"></div>
        <div className="h-10 bg-gray-200 rounded w-32 mt-4"></div>
      </div>

      {/* Categories Skeleton */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 mb-10">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded border border-gray-100 p-2 h-20 animate-pulse flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-12 h-2 rounded bg-gray-200"></div>
            <div className="w-6 h-2 rounded bg-gray-200"></div>
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-10 animate-pulse">
        <div className="h-12 bg-gray-200 w-full"></div>
        <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-100 border border-gray-100"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
