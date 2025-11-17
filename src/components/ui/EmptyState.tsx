export const EmptyState = ({
  icon,
  title,
  description,
  action
}: {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) => {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
