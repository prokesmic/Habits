'use client';

export const MobileLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-4 space-y-4 animate-pulse">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-3 bg-gray-200 rounded w-20 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-32" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gray-200 rounded-2xl h-48" />

        {/* Section Header */}
        <div className="h-5 bg-gray-200 rounded w-40" />

        {/* Habits */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border rounded-xl p-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ))}

        {/* Squad Activity Header */}
        <div className="h-5 bg-gray-200 rounded w-36" />

        {/* Activity Cards */}
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border rounded-xl p-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
