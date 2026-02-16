import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Use getUser instead of getSession for more reliable auth check
  // getSession can return a session even if the user is not actually authenticated
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userData = {
    id: user.id,
    email: user.email || "",
    profile: profile || null,
  };

  return (
    <div className="min-h-screen bg-[#111] text-white">
      <div className="flex">
        <DashboardSidebar user={userData} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
