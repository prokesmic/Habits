import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode | string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  children?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  children
}: EmptyStateProps) => {
  return (
    <div className="text-center py-16 px-4">
      <div className="mb-6">
        {typeof icon === 'string' ? (
          <div className="text-7xl mb-4">{icon}</div>
        ) : (
          <div className="flex justify-center mb-4">{icon}</div>
        )}
      </div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            action.variant === 'secondary'
              ? 'border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg'
          }`}
        >
          {action.label}
        </button>
      )}

      {children}
    </div>
  );
};

// Pre-built empty states for common scenarios
export const NoHabitsEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon="🎯"
    title="No habits yet!"
    description="Start building better habits today. Choose from popular habits or create your own custom habit."
    action={{
      label: "Create Your First Habit",
      onClick: onCreate
    }}
  />
);

export const NoSquadsEmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <EmptyState
    icon="👥"
    title="No squads yet!"
    description="Create a squad and invite friends for accountability. Everything's better with friends!"
    action={{
      label: "Create a Squad",
      onClick: onCreate
    }}
  />
);

export const NoActivityEmptyState = () => (
  <EmptyState
    icon="📭"
    title="No activity yet"
    description="Check in to your habits and invite friends to see activity here!"
  />
);
