import { NextResponse } from "next/server";

// Loosen typings to satisfy Next.js RouteHandlerConfig expectations in production
export async function GET(request: Request, context: any) {
  const { name } = await context.params;

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
  const key = name && funnels[name] ? name : "signup";
  const funnel = funnels[key];

  const steps = funnel.steps.map((s: any, idx: number) => {
    const first = funnel.steps[0].users;
    const prev = idx === 0 ? first : funnel.steps[idx - 1].users;
    const users = s.users;
    return {
      name: s.name,
      users,
      dropoff: idx === 0 || !prev ? 0 : ((prev - users) / prev) * 100,
      conversionRate: first ? (users / first) * 100 : 0,
    };
  });

  const overallConversion = steps.length && steps[0].users ? (steps[steps.length - 1].users / steps[0].users) * 100 : 0;

  return NextResponse.json(
    { name: funnel.name, steps, overallConversion },
    { headers: { "Cache-Control": "public, s-maxage=300" } }
  );
}


