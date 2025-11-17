import { toast as sonnerToast } from 'sonner';

export const toast = {
  success: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      className: 'bg-green-50 border-green-500'
    });
  },

  error: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      className: 'bg-red-50 border-red-500'
    });
  },

  info: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      className: 'bg-blue-50 border-blue-500'
    });
  },

  warning: (message: string, options?: { description?: string; duration?: number }) => {
    sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 3000,
      className: 'bg-yellow-50 border-yellow-500'
    });
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return sonnerToast.promise(promise, messages);
  },

  custom: (component: React.ReactElement, duration?: number) => {
    sonnerToast.custom(() => component, { duration });
  }
};

// Custom toast components for specific actions
export const CheckInToast = ({ habitName, streak }: { habitName: string; streak: number }) => (
  <div className="flex items-center gap-3 p-2">
    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
      ✓
    </div>
    <div className="flex-1">
      <div className="font-semibold">{habitName} checked in!</div>
      <div className="text-sm text-gray-600">🔥 {streak} day streak</div>
    </div>
  </div>
);

export const StreakLostToast = ({ habitName }: { habitName: string }) => (
  <div className="flex items-center gap-3 p-2">
    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white text-xl">
      💔
    </div>
    <div className="flex-1">
      <div className="font-semibold">Streak lost</div>
      <div className="text-sm text-gray-600">{habitName}</div>
    </div>
  </div>
);
