import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppCard, AppGrid } from "@/components/app-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchCommand } from "@/components/search-command";
import {
  getAppsByCategory,
  getCategories,
  getCategoryBySlug,
} from "@/lib/supabase/client";
import { notFound } from "next/navigation";

// Generate static paths for all categories
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

// Map database app to AppCard format
function mapAppToCardFormat(app: {
  id: string;
  name: string;
  description: string | null;
  screenshot_urls: string[] | null;
  category: { name: string; slug: string } | null;
  rating: number;
  install_count: number;
  developer: { name: string; avatar_url: string | null } | null;
  compatibility_claude: boolean;
  compatibility_chatgpt: boolean;
  compatibility_vscode: boolean;
  compatibility_goose: boolean;
  slug: string;
}) {
  return {
    id: app.id,
    name: app.name,
    description: app.description || "",
    screenshotUrl:
      app.screenshot_urls?.[0] ||
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    category: app.category?.slug || "uncategorized",
    rating: app.rating,
    installCount: app.install_count,
    author: { name: app.developer?.name || "Unknown" },
    compatibility: {
      claude: app.compatibility_claude,
      chatgpt: app.compatibility_chatgpt,
      vscode: app.compatibility_vscode,
      goose: app.compatibility_goose,
    },
    slug: app.slug,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await Promise.resolve(params);

  // Fetch category and apps in parallel
  const [category, apps, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    getAppsByCategory(slug),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  const categoryApps = apps.map(mapAppToCardFormat);

  const categoryFilters = allCategories.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    count: cat.count || 0,
  }));

  const otherCategories = allCategories
    .filter((c) => c.slug !== slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Navigation with Search */}
      <nav className="border-b border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="/"
                className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]"
              >
                MCP
              </Link>
              <span className="text-sm font-semibold tracking-tight">APPS</span>
            </div>
            <div className="flex-1 max-w-md hidden sm:block">
              <SearchCommand />
            </div>
            <div className="flex items-center gap-8 flex-shrink-0">
              <span className="text-xs font-medium tracking-[0.1em] uppercase text-[#666] hidden lg:inline">
                Swiss Studio
              </span>
              <div className="w-2 h-2 bg-[#dc2626]" />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="sm:hidden border-b border-[#333] px-6 py-3">
        <SearchCommand />
      </div>

      <main>
        {/* Header Section */}
        <section className="border-b border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
            {/* Breadcrumb */}
            <div className="flex items-center gap-4 mb-8 text-[11px] tracking-[0.1em] uppercase text-[#666]">
              <Link
                href="/"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                All Apps
              </Link>
              <span className="text-[#333]">/</span>
              <span className="text-white">{category.name}</span>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] block mb-4">
                  Category
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
                  {category.name}
                </h1>
                <p className="mt-4 text-lg text-[#888] max-w-2xl">
                  {categoryApps.length} app
                  {categoryApps.length !== 1 ? "s" : ""} in this category.
                  {category.description ||
                    " Browse tools to enhance your AI workflow."}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 text-right">
                <div>
                  <span className="text-3xl font-black">
                    {categoryApps.length}
                  </span>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">
                    Apps
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="border-b border-[#333] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-6">
            <CategoryFilter
              categories={categoryFilters}
              activeCategory={slug}
            />
          </div>
        </section>

        {/* Apps Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            {categoryApps.length > 0 ? (
              <AppGrid>
                {categoryApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </AppGrid>
            ) : (
              <div className="text-center py-24">
                <p className="text-[#666] text-lg">
                  No apps found in this category yet.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 mt-6 text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse all apps
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Other Categories */}
        {otherCategories.length > 0 && (
          <section className="py-12 lg:py-16 border-t border-[#333]">
            <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-8">
                Browse Other Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="group border border-[#333] hover:border-[#dc2626] p-6 transition-colors"
                  >
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#666] group-hover:text-[#dc2626] transition-colors">
                      {cat.count || 0} Apps
                    </span>
                    <h3 className="font-semibold mt-2 group-hover:text-[#dc2626] transition-colors">
                      {cat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">
                MCP
              </span>
              <span className="text-sm font-semibold tracking-tight">APPS</span>
            </div>
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#444]">
              Curated by Swiss Studio
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
