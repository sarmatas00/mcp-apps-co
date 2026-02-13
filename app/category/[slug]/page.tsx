import Image from "next/image";
import Link from "next/link";
import { Star, Download, ArrowLeft } from "lucide-react";
import { AppCard, AppGrid, type AppData } from "@/components/app-card";
import { CategoryFilter } from "@/components/category-filter";
import { SearchCommand } from "@/components/search-command";

// Categories data
const categories = [
  { id: "data-visualization", name: "Data Visualization", count: 12 },
  { id: "developer-tools", name: "Developer Tools", count: 24 },
  { id: "productivity", name: "Productivity", count: 18 },
  { id: "communication", name: "Communication", count: 8 },
  { id: "content-creation", name: "Content Creation", count: 15 },
];

// Sample apps data
const allApps: AppData[] = [
  {
    id: "1",
    name: "Interactive Charts",
    description: "Beautiful data visualizations and charts that render directly in your AI conversations.",
    screenshotUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    category: "data-visualization",
    rating: 4.8,
    installCount: 12500,
    author: { name: "datawiz" },
    compatibility: { claude: true, chatgpt: true, vscode: false, goose: true },
  },
  {
    id: "2",
    name: "Code Review Assistant",
    description: "Get intelligent code reviews with inline comments, suggestions, and visual diff rendering.",
    screenshotUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.9,
    installCount: 8750,
    author: { name: "devtools" },
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: true },
  },
  {
    id: "3",
    name: "Mind Map Canvas",
    description: "Create and collaborate on mind maps, flowcharts, and diagrams with an intuitive drag-and-drop interface.",
    screenshotUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop",
    category: "productivity",
    rating: 4.6,
    installCount: 5400,
    author: { name: "mapmaster" },
    compatibility: { claude: true, chatgpt: false, vscode: false, goose: true },
  },
  {
    id: "4",
    name: "SQL Query Builder",
    description: "Visual SQL query builder with schema explorer and query optimization suggestions.",
    screenshotUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.7,
    installCount: 9200,
    author: { name: "sqlwizard" },
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: false },
  },
  {
    id: "5",
    name: "Markdown Preview Pro",
    description: "Advanced markdown renderer with syntax highlighting, math support, and custom themes.",
    screenshotUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
    category: "productivity",
    rating: 4.5,
    installCount: 6800,
    author: { name: "mdpro" },
    compatibility: { claude: true, chatgpt: true, vscode: true, goose: true },
  },
  {
    id: "6",
    name: "API Tester",
    description: "Test and debug APIs with request history, environment variables, and response visualization.",
    screenshotUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.4,
    installCount: 4300,
    author: { name: "apidev" },
    compatibility: { claude: true, chatgpt: false, vscode: true, goose: false },
  },
];

// Generate static paths for all categories
export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.id,
  }));
}

function formatCategoryName(slug: string): string {
  const category = categories.find((c) => c.id === slug);
  return category?.name || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = formatCategoryName(params.slug);
  const categoryApps = allApps.filter((app) => app.category === params.slug);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Navigation with Search */}
      <nav className="border-b border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/" className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">
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
              <Link href="/" className="flex items-center gap-2 hover:text-white transition-colors">
                <ArrowLeft className="w-3 h-3" />
                All Apps
              </Link>
              <span className="text-[#333]">/</span>
              <span className="text-white">{categoryName}</span>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
              <div>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] block mb-4">
                  Category
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
                  {categoryName}
                </h1>
                <p className="mt-4 text-lg text-[#888] max-w-2xl">
                  {categoryApps.length} app{categoryApps.length !== 1 ? "s" : ""} in this category.
                  Browse tools to enhance your AI workflow.
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8 text-right">
                <div>
                  <span className="text-3xl font-black">{categoryApps.length}</span>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">Apps</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="border-b border-[#333] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-6">
            <CategoryFilter categories={categories} activeCategory={params.slug} />
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
                <p className="text-[#666] text-lg">No apps found in this category yet.</p>
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
        <section className="py-12 lg:py-16 border-t border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-8">
              Browse Other Categories
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories
                .filter((c) => c.id !== params.slug)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group border border-[#333] hover:border-[#dc2626] p-6 transition-colors"
                  >
                    <span className="text-[10px] tracking-[0.15em] uppercase text-[#666] group-hover:text-[#dc2626] transition-colors">
                      {category.count} Apps
                    </span>
                    <h3 className="font-semibold mt-2 group-hover:text-[#dc2626] transition-colors">
                      {category.name}
                    </h3>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">MCP</span>
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
