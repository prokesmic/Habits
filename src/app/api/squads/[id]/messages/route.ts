import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/squads/[id]/messages - Fetch messages for a squad
export async function GET(request: NextRequest, context: RouteContext) {
  const { id: squadId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a member of the squad
  console.log("[GET messages] Checking membership for user:", user.id, "squad:", squadId);

  // Use limit(1) instead of single() to avoid PGRST116 error
  const { data: memberships, error: membershipError } = await supabase
    .from("squad_members")
    .select("user_id, squad_id, role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .limit(1);

  console.log("[GET messages] Membership result:", {
    memberships,
    count: memberships?.length ?? 0,
    error: membershipError
  });

  if (membershipError) {
    console.error("[GET messages] Membership query error:", membershipError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!memberships || memberships.length === 0) {
    console.log("[GET messages] No membership found, returning 403");
    return NextResponse.json({ error: "Not a squad member" }, { status: 403 });
  }

  // Get cursor for pagination (fetch messages after this timestamp)
  const url = new URL(request.url);
  const after = url.searchParams.get("after");

  let query = supabase
    .from("squad_messages")
    .select(`
      id,
      content,
      message_type,
      created_at,
      user_id,
      profile:profiles(username, avatar_url)
    `)
    .eq("squad_id", squadId)
    .order("created_at", { ascending: true });

  if (after) {
    query = query.gt("created_at", after);
  } else {
    // Limit to last 50 messages if no cursor
    query = query.limit(50);
  }

  const { data: messages, error } = await query;

  if (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }

  // Transform messages to include user info
  const transformedMessages = (messages || []).map((m) => ({
    id: m.id,
    content: m.content,
    type: m.message_type,
    timestamp: m.created_at,
    user: {
      id: m.user_id,
      name: (m as any).profile?.username || "Anonymous",
      avatar: (m as any).profile?.avatar_url || null,
    },
  }));

  return NextResponse.json({ messages: transformedMessages });
}

// POST /api/squads/[id]/messages - Send a message to a squad
export async function POST(request: NextRequest, context: RouteContext) {
  const { id: squadId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a member of the squad
  console.log("[POST messages] Checking membership for user:", user.id, "squad:", squadId);

  // Use limit(1) instead of single() to avoid PGRST116 error
  const { data: memberships, error: membershipError } = await supabase
    .from("squad_members")
    .select("user_id, squad_id, role")
    .eq("squad_id", squadId)
    .eq("user_id", user.id)
    .limit(1);

  console.log("[POST messages] Membership result:", {
    memberships,
    count: memberships?.length ?? 0,
    error: membershipError
  });

  if (membershipError) {
    console.error("[POST messages] Membership query error:", membershipError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!memberships || memberships.length === 0) {
    console.log("[POST messages] No membership found, returning 403");
    return NextResponse.json({ error: "Not a squad member" }, { status: 403 });
  }

  const body = await request.json();
  const { content, message_type = "text" } = body;

  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Message content required" }, { status: 400 });
  }

  if (content.length > 1000) {
    return NextResponse.json({ error: "Message too long (max 1000 characters)" }, { status: 400 });
  }

  // Insert message
  const { data: message, error } = await supabase
    .from("squad_messages")
    .insert({
      squad_id: squadId,
      user_id: user.id,
      content: content.trim(),
      message_type,
    })
    .select(`
      id,
      content,
      message_type,
      created_at,
      user_id
    `)
    .single();

  if (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  // Get user profile for response
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    message: {
      id: message.id,
      content: message.content,
      type: message.message_type,
      timestamp: message.created_at,
      user: {
        id: message.user_id,
        name: profile?.username || "Anonymous",
        avatar: profile?.avatar_url || null,
      },
    },
  });
}
