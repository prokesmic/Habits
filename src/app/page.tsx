import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarketingPage from "./(marketing)/page";

export default async function Home() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect authenticated users to dashboard
    if (user) {
      redirect("/dashboard");
    }
  } catch (error) {
    // If auth check fails, show marketing page
    console.error("Auth check failed:", error);
  }

  // Show landing page for non-authenticated users
  return <MarketingPage />;
}
