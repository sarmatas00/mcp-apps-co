import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

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
