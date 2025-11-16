import { SquadChat } from "@/components/chat/SquadChat";

type Props = { params: Promise<{ id: string }> | { id: string } };

export default async function SquadChatPage({ params }: Props) {
  const { id } = await Promise.resolve(params);
  return (
    <div className="h-[calc(100vh-200px)] rounded-2xl border border-slate-200 bg-white">
      <SquadChat squadId={id} />
    </div>
  );
}


