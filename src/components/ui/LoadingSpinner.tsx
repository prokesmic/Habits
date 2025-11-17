export const LoadingSpinner = ({
  size = 'md',
  color = 'orange'
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: 'orange' | 'white' | 'gray';
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    orange: 'border-gray-200 border-t-orange-500',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-300 border-t-gray-600'
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const LoadingOverlay = ({ message }: { message?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
        <LoadingSpinner size="lg" />
        {message && <p className="text-gray-600 font-medium">{message}</p>}
      </div>
    </div>
  );
};

export const SkeletonLoader = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border rounded-xl p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
