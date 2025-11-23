"use client";

import Link from "next/link";
import { Plus, Building2, Users, ChevronRight } from "lucide-react";

export default function WorkspacesPage() {
  // Mock data - in real app this would come from API/database
  const workspaces = [
    {
      id: "1",
      name: "Acme Corp",
      slug: "acme-corp",
      memberCount: 15,
      plan: "team",
    },
    {
      id: "2",
      name: "Startup Hub",
      slug: "startup-hub",
      memberCount: 8,
      plan: "business",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>🏢</span>
              <span>Workspaces</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Your Workspaces</h1>
              <p className="mt-1 text-sm opacity-95">
                Manage team habits, challenges, and accountability
              </p>
            </div>
          </div>
          <Link
            href="/workspaces/new"
            className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
            data-testid="create-workspace-button"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Workspace</span>
          </Link>
        </div>
      </section>

      {/* Workspaces List */}
      <div className="space-y-4">
        {workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <Link
              key={workspace.id}
              href={`/workspaces/${workspace.id}`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md"
              data-testid={`workspace-card-${workspace.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100">
                  <Building2 className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{workspace.name}</h3>
                  <p className="text-sm text-slate-500">/{workspace.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  <span>{workspace.memberCount} members</span>
                </div>
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium capitalize text-violet-700">
                  {workspace.plan}
                </span>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <Building2 className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900">No workspaces yet</h3>
            <p className="mb-6 text-slate-500">
              Create a workspace to collaborate with your team on habits and challenges.
            </p>
            <Link
              href="/workspaces/new"
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus className="h-4 w-4" />
              Create Your First Workspace
            </Link>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-xl bg-violet-50 p-4 text-sm text-violet-900">
        <p className="font-semibold">What are workspaces?</p>
        <p className="mt-1 text-violet-700">
          Workspaces let teams track habits together, run company-wide challenges, and build accountability at scale.
        </p>
      </div>
    </div>
  );
}
