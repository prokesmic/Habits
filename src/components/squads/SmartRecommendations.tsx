import Link from "next/link";
import type { Squad } from "@/data/mockSquadsFull";
import { Sparkles } from "lucide-react";
import { EnhancedSquadCard } from "./EnhancedSquadCard";

type SmartRecommendationsProps = {
  recommendedSquads: Squad[];
};

export function SmartRecommendations({ recommendedSquads }: SmartRecommendationsProps) {
  if (recommendedSquads.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-slate-900">
          Based on your habits, you might like:
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendedSquads.map((squad) => (
          <EnhancedSquadCard key={squad.id} squad={squad} />
        ))}
      </div>
    </section>
  );
}

