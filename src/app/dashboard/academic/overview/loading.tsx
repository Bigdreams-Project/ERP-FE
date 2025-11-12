export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-4 md:py-8 md:px-3">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-32 rounded-xl mb-6"></div>

        {/* Date selector skeleton */}
        <div className="bg-gray-200 h-10 w-32 rounded-md mb-4 ml-auto"></div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-gray-200 h-80 rounded-xl"></div>
          <div className="bg-gray-200 h-80 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
