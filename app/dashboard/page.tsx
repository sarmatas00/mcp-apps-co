import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Get user's apps count
  const { count: appsCount } = await supabase
    .from("apps")
    .select("*", { count: "exact", head: true })
    .eq("developer_id", session?.user.id);

  // Get total views (placeholder - would need analytics table)
  const totalViews = 0;

  // Get total installs (placeholder - would need analytics table)
  const totalInstalls = 0;

  return (
    <div>
      <h1 className="text-3xl font-black tracking-tight uppercase mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-[#0a0a0a] border-[#333]">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
            Your Apps
          </p>
          <p className="text-4xl font-black">{appsCount || 0}</p>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border-[#333]">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
            Total Views
          </p>
          <p className="text-4xl font-black">{totalViews}</p>
        </Card>

        <Card className="p-6 bg-[#0a0a0a] border-[#333]">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2">
            Total Installs
          </p>
          <p className="text-4xl font-black">{totalInstalls}</p>
        </Card>
      </div>

      <div className="border border-[#333] p-6">
        <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
        <ul className="space-y-3 text-[#666]">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            <a href="/submit" className="text-white hover:underline">
              Submit your first MCP App
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            <a
              href="/dashboard/settings"
              className="text-white hover:underline"
            >
              Complete your profile
            </a>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            <a
              href="/dashboard/analytics"
              className="text-white hover:underline"
            >
              View analytics
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
