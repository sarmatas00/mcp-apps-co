import { getApps } from "@/lib/supabase/client";
import AppDetailClient from "./client";

// Generate static paths for all apps
export async function generateStaticParams() {
  const apps = await getApps();
  return apps.map((app) => ({
    slug: app.slug,
  }));
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <AppDetailClient slug={slug} />;
}
