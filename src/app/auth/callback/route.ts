import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (!exchangeError) {
        // Check if this is a password recovery flow
        if (type === "recovery") {
          return NextResponse.redirect(new URL("/auth/reset-password", request.url));
        }

        // Ensure profile exists for the user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          try {
            const { data: existingProfile } = await supabase
              .from("profiles")
              .select("id")
              .eq("id", user.id)
              .single();

            if (!existingProfile) {
              // Create profile with a default username based on email
              const defaultUsername = user.email?.split("@")[0] ?? `user_${user.id.slice(0, 8)}`;
              const { error: insertError } = await supabase.from("profiles").insert({
                id: user.id,
                username: defaultUsername,
                onboarding_completed: false,
              });
              
              if (insertError) {
                console.error("Profile creation error:", insertError);
              }
            }
          } catch (profileError) {
            // Log error but continue - profile might not exist yet, will be created by trigger
            console.error("Profile check/create error:", profileError);
          }
        }

        // Redirect to the dashboard or the specified next URL
        return NextResponse.redirect(new URL(next, request.url));
      }
    } catch (error) {
      console.error("Auth callback error:", error);
      // If there's an error, redirect to sign-in
      return NextResponse.redirect(new URL("/auth/sign-in?error=auth_failed", request.url));
    }
  }

  // If there's an error or no code, redirect to sign-in
  return NextResponse.redirect(new URL("/auth/sign-in?error=auth_failed", request.url));
}

