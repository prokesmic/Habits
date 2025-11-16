import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const funnels: any = {
    signup: {
      name: "Signup Funnel",
      steps: [
        { name: "Visited Landing", users: 5000 },
        { name: "Started Signup", users: 2400 },
        { name: "Completed Profile", users: 1900 },
        { name: "Created First Habit", users: 1300 },
        { name: "First Check-in", users: 900 },
      ],
    },
    monetization: {
      name: "Monetization Funnel",
      steps: [
        { name: "Signed Up", users: 2000 },
        { name: "Viewed Stakes", users: 1200 },
        { name: "Added Payment Method", users: 800 },
        { name: "Created First Stake", users: 450 },
        { name: "Active Stake", users: 300 },
      ],
    },
  };
  const funnel = funnels[params.name] ?? funnels.signup;
  const steps = funnel.steps.map((s: any, idx: number) => {
    const first = funnel.steps[0].users;
    const prev = idx === 0 ? first : funnel.steps[idx - 1].users;
    return {
      name: s.name,
      users: s.users,
      dropoff: idx === 0 ? 0 : ((prev - s.users) / prev) * 100,
      conversionRate: (s.users / first) * 100,
    };
  });
  return NextResponse.json(
    { name: funnel.name, steps, overallConversion: (steps[steps.length - 1].users / steps[0].users) * 100 },
    { headers: { "Cache-Control": "public, s-maxage=300" } }
  );
}


