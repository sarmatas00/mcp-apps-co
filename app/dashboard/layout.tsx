import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("[Dashboard] Loading layout...");
  
  const supabase = await createClient();
  
  // Get session - this will refresh if needed
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log("[Dashboard] Session exists:", !!session);
  console.log("[Dashboard] Session error:", sessionError?.message);
  console.log("[Dashboard] User ID:", session?.user?.id);

  if (sessionError) {
    console.error("[Dashboard] Session error:", sessionError);
  }

  if (!session) {
    console.log("[Dashboard] No session, redirecting to login");
    redirect("/auth/login?redirect=/dashboard");
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (profileError) {
    console.error("[Dashboard] Profile fetch error:", profileError);
  }

  const user = {
    id: session.user.id,
    email: session.user.email || "",
    profile: profile || null,
  };

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="flex">
        <DashboardSidebar user={user} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
