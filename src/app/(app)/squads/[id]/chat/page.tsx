import { SquadChat } from "@/components/chat/SquadChat";
import { allSquads } from "@/data/mockSquadsFull";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

type Props = { params: Promise<{ id: string }> | { id: string } };

export default async function SquadChatPage({ params }: Props) {
  const { id } = await Promise.resolve(params);

  // Check if this is a mock squad
  const mockSquad = allSquads.find((s) => s.id === id);

  if (mockSquad) {
    // Show demo message for mock squads
    return (
      <div className="h-[calc(100vh-200px)] rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
            <MessageCircle className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">
            {mockSquad.emoji} {mockSquad.name} Chat
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            This is a demo squad. Join the squad to access the real-time chat with {mockSquad.memberCount.toLocaleString()} members!
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              href={`/squads/${id}/join`}
              className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Join for ${mockSquad.entryStake}
            </Link>
            <Link
              href={`/squads/${id}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] rounded-2xl border border-slate-200 bg-white">
      <SquadChat squadId={id} />
    </div>
  );
}


