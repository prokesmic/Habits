"use client";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function FriendSearchInput({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search friends..."
      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
    />
  );
}


