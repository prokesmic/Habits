"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { InviteMembersModal } from "./InviteMembersModal";

interface InviteMembersButtonProps {
  squadId: string;
  squadName: string;
}

export function InviteMembersButton({ squadId, squadName }: InviteMembersButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:shadow-lg hover:shadow-orange-500/40"
      >
        <Mail className="h-4 w-4" />
        Invite Members
      </button>

      <InviteMembersModal
        squadId={squadId}
        squadName={squadName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
