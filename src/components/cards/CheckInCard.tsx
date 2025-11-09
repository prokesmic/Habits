import { ReactionButton } from "@/components/cards/ReactionButton";

type HabitLog = {
  id: string;
  note?: string | null;
  streak_count?: number | null;
  habit: {
    title: string;
    emoji?: string | null;
  };
  user: {
    username: string;
  };
  reactions?: Array<{ reaction_type: string; count: number }>;
};

type CheckInCardProps = {
  log: HabitLog;
  onComment?: () => void;
};

export function CheckInCard({ log, onComment }: CheckInCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg">
          {log.habit.emoji ?? "✅"}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{log.user.username}</p>
          <p className="text-sm text-slate-500">
            completed {log.habit.emoji ?? "✅"} {log.habit.title}
          </p>
          {log.streak_count && log.streak_count >= 7 ? (
            <div className="mt-2 text-sm font-semibold text-orange-500">
              🔥 {log.streak_count}-day streak!
            </div>
          ) : null}
          {log.note ? <p className="mt-2 text-sm text-slate-600">{log.note}</p> : null}
          <div className="mt-3 flex items-center gap-4">
            <ReactionButton logId={log.id} />
            <button
              type="button"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
              onClick={onComment}
            >
              💬 Comment
            </button>
          </div>
          <ReactionsList reactions={log.reactions} />
        </div>
      </div>
    </div>
  );
}

type ReactionsListProps = {
  reactions?: Array<{ reaction_type: string; count: number }>;
};

function ReactionsList({ reactions }: ReactionsListProps) {
  if (!reactions?.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
      {reactions.map((reaction) => (
        <span
          key={reaction.reaction_type}
          className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold"
        >
          {reaction.reaction_type} × {reaction.count}
        </span>
      ))}
    </div>
  );
}

