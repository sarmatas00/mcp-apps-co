import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function SettingsPage() {
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

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
        Settings
      </h1>

      <div className="max-w-2xl">
        <ProfileForm
          userId={session.user.id}
          profile={profile}
          email={session.user.email || ""}
        />
      </div>
    </div>
  );
}
