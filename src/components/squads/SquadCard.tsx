import Link from 'next/link';

interface Squad {
  id: string;
  name: string;
  description: string;
  emoji: string;
  memberCount: number;
  activeMembers: number;
  totalStreaks: number;
  members: {
    id: string;
    name: string;
    avatar: string;
    currentStreak: number;
  }[];
}

export const SquadCard = ({ squad }: { squad: Squad }) => {
  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center text-3xl">
            {squad.emoji}
          </div>
          <div>
            <h3 className="font-bold text-xl">{squad.name}</h3>
            <p className="text-gray-600 text-sm">{squad.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{squad.memberCount}</div>
          <div className="text-xs text-gray-600">Members</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{squad.activeMembers}</div>
          <div className="text-xs text-gray-600">Active Today</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{squad.totalStreaks}</div>
          <div className="text-xs text-gray-600">Total Streaks</div>
        </div>
      </div>

      <div className="flex -space-x-2 mb-4">
        {squad.members.slice(0, 5).map((member) => (
          <img
            key={member.id}
            src={member.avatar}
            alt={member.name}
            className="w-10 h-10 rounded-full border-2 border-white"
            title={member.name}
          />
        ))}
        {squad.memberCount > 5 && (
          <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-semibold">
            +{squad.memberCount - 5}
          </div>
        )}
      </div>

      <Link
        href={`/squads/${squad.id}`}
        className="block w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all"
      >
        View Squad
      </Link>
    </div>
  );
};
