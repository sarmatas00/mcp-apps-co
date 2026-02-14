import { getApps } from "@/lib/supabase/client";
import AppDetailClient from "./client";

// Generate static paths for all apps
export async function generateStaticParams() {
  const apps = await getApps();
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export default function AppDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <AppDetailClient slug={params.slug} />;
}
