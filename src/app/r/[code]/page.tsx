"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReferralLandingPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const [referrer, setReferrer] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/referrals/info?code=${params.code}`);
      setReferrer(await res.json());
    };
    void load();
  }, [params.code]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          router.push(`/auth/sign-up?ref=${params.code}`);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [params.code, router]);

  if (!referrer) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-600 to-blue-600 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        <img src={referrer.avatar} alt={referrer.name} className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-violet-200" />
        <h1 className="mb-2 text-2xl font-bold">{referrer.name} invited you!</h1>
        <p className="mb-6 text-gray-600">
          Join Habitee and you'll both get <strong>$5</strong>
        </p>
        <div className="mb-6 rounded-lg border border-violet-200 bg-violet-50 p-4">
          <div className="mb-2 text-sm text-gray-600">What you'll get:</div>
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">$5 signup bonus</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Build habits that stick</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Real accountability with money</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span className="text-sm">Join {referrer.name}'s squad</span>
            </div>
          </div>
        </div>
        <button onClick={() => router.push(`/auth/sign-up?ref=${params.code}`)} className="mb-3 w-full rounded-lg bg-violet-600 py-3 font-semibold text-white">
          Join Now & Get $5
        </button>
        <div className="text-xs text-gray-500">Redirecting in {countdown}...</div>
        <div className="mt-6 border-t pt-6">
          <div className="mb-3 text-xs text-gray-600">
            Join {referrer.totalReferrals.toLocaleString()}+ others who signed up through referrals
          </div>
          <div className="flex justify-center gap-2">
            {referrer.recentSignups?.slice(0, 5).map((s: any, i: number) => (
              <img key={i} src={s.avatar} alt={s.name} className="h-8 w-8 rounded-full border-2 border-white" style={{ marginLeft: i > 0 ? "-8px" : 0 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


