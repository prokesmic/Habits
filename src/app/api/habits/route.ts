import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      emoji,
      description,
      frequency,
      target_days_per_week,
      requires_proof,
      has_stake,
      stake_amount,
    } = body as {
      title: string;
      emoji: string;
      description?: string;
      frequency: string;
      target_days_per_week?: number;
      requires_proof?: boolean;
      has_stake?: boolean;
      stake_amount?: number;
    };

    if (!title || !emoji || !frequency) {
      return NextResponse.json(
        { error: "Title, emoji, and frequency are required" },
        { status: 400 }
      );
    }

    // Create the habit
    const { data: habit, error: habitError } = await supabase
      .from("habits")
      .insert({
        user_id: user.id,
        title,
        emoji,
        description: description || null,
        frequency,
        target_days_per_week: target_days_per_week || (frequency === "daily" ? 7 : frequency === "weekdays" ? 5 : 7),
        requires_proof: requires_proof || false,
        has_stake: has_stake || false,
        stake_amount: stake_amount || null,
        current_streak: 0,
        longest_streak: 0,
        archived: false,
      })
      .select()
      .single();

    if (habitError) {
      console.error("Error creating habit:", habitError);
      return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      habit,
    });
  } catch (error) {
    console.error("Create habit error:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: habits, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching habits:", error);
      return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
    }

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("Fetch habits error:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}
