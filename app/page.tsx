import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppCard, AppGrid } from "@/components/app-card";
import { SearchCommand } from "@/components/search-command";
import { CategoryFilter } from "@/components/category-filter";
import { AuthNav } from "@/components/auth/auth-nav";
import { getApps, getCategories } from "@/lib/supabase/client";
import { getAllPosts } from "@/lib/blog/posts";
import type { App } from "@/lib/supabase/types";
import type { BlogPost } from "@/lib/blog/posts";

// Map database app to AppCard format
function mapAppToCardFormat(app: App) {
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

export default async function Home() {
  // Fetch data from Supabase
  const apps = await getApps();
  const categories = await getCategories();

  // Fetch latest blog post
  const blogPosts = getAllPosts();
  const latestPost = blogPosts[0] || null;

  // Map categories for the filter
  const categoryFilters = categories.map((cat) => ({
    id: cat.slug,
    name: cat.name,
    count: cat.count || 0,
  }));

  // Map apps for the cards
  const mappedApps = apps.map(mapAppToCardFormat);

  // Get featured apps (first 6)
  const featuredApps = mappedApps.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Architectural Grid Lines - Top */}
      <div className="fixed top-0 left-0 right-0 h-px bg-[#333] z-50" />
      <div className="fixed top-0 bottom-0 left-[50%] w-px bg-[#333] z-40 hidden lg:block" />

      {/* Navigation - Minimal with Search */}
      <nav className="border-b border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-[#dc2626] flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">
                  MCP
                </span>
                <span className="text-sm font-semibold tracking-tight">
                  APPS
                </span>
              </div>
            </Link>
            <div className="flex-1 max-w-md hidden sm:block">
              <SearchCommand />
            </div>
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link
                href="/blog"
                className="text-xs font-medium tracking-[0.1em] uppercase text-[#666] hover:text-white transition-colors hidden sm:inline"
              >
                Blog
              </Link>
              <AuthNav />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Search - Visible only on small screens */}
      <div className="sm:hidden border-b border-[#333] px-6 py-3">
        <SearchCommand />
      </div>

      <main>
        {/* Hero Section - Broken Grid, Massive Typography */}
        <section className="relative border-b border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
              {/* Left Column - Massive Type */}
              <div className="flex flex-col justify-center py-16 lg:py-24 lg:pr-12 border-r border-[#333]">
                <div className="space-y-8">
                  {/* Version Label */}
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666]">
                      v0.1.0
                    </span>
                    <div className="h-px flex-1 bg-[#333]" />
                  </div>

                  {/* Massive Headline */}
                  <h1 className="text-[clamp(3rem,12vw,9rem)] font-black leading-[0.85] tracking-[-0.04em] uppercase">
                    MCP
                    <br />
                    <span className="text-[#666]">APPS</span>
                  </h1>

                  {/* Subhead */}
                  <p className="text-lg sm:text-xl text-[#888] max-w-md leading-relaxed tracking-tight">
                    Curated interactive UI components for AI. Built for Claude,
                    ChatGPT, VS Code, and more.
                  </p>

                  {/* CTA - Red Accent */}
                  <div className="pt-4">
                    <Link
                      href="#collection"
                      className="group inline-flex items-center gap-4 bg-[#dc2626] text-white px-8 py-4 text-sm font-semibold tracking-[0.05em] uppercase hover:bg-[#b91c1c] transition-colors"
                    >
                      <span>Browse Collection</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Architectural Stats */}
              <div className="flex flex-col justify-between py-16 lg:py-24 lg:pl-12 border-t lg:border-t-0 border-[#333]">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-[#333]">
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      {mappedApps.length}
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Featured Apps
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-[#dc2626] leading-none">
                      {categories.length}
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Categories
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      4
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      AI Clients
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      100%
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Open Source
                    </p>
                  </div>
                </div>

                {/* Bottom Quote */}
                <div className="pt-12 lg:pt-0">
                  <p className="text-xs font-medium tracking-[0.1em] uppercase text-[#444] max-w-xs">
                    &quot;Good design is as little design as possible.&quot;
                  </p>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-[#333] mt-2">
                    — Dieter Rams
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter Bar */}
        <section className="border-y border-[#333] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-6">
            <CategoryFilter categories={categoryFilters} />
          </div>
        </section>

        {/* Apps Section - Asymmetric Grid */}
        <section id="collection" className="py-24 sm:py-32">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            {/* Section Header - Left Aligned */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 pb-8 border-b border-[#333]">
              <div>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] block mb-2">
                  Featured
                </span>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase">
                  COLLECTION
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium tracking-[0.1em] uppercase text-[#666]">
                  {mappedApps.length} Apps
                </span>
                <div className="w-12 h-px bg-[#333]" />
              </div>
            </div>

            {/* App Grid */}
            <AppGrid>
              {featuredApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </AppGrid>

            {/* View All Link */}
            {mappedApps.length > 6 && (
              <div className="mt-12 text-center">
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-[#dc2626] hover:text-[#b91c1c] transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  View All Apps
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Featured Blog Post */}
        <LatestBlogSection post={latestPost} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">
                MCP
              </span>
              <span className="text-sm font-semibold tracking-tight">APPS</span>
            </div>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#444]">
              Curated by Swiss Studio • Built with Next.js & Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Featured Blog Section Component
function LatestBlogSection({ post }: { post: BlogPost | null }) {
  if (!post) return null;

  return (
    <section className="border-t border-[#333] bg-[#0a0a0a]">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 pb-8 border-b border-[#333]">
          <div>
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] block mb-2">
              From the Blog
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] uppercase">
              LATEST
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#dc2626] hover:text-[#b91c1c] transition-colors text-sm font-medium tracking-wide uppercase"
          >
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Featured Post */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Content */}
          <div className="flex flex-col justify-center">
            {post.category && (
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] mb-4">
                {post.category}
              </span>
            )}
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              {post.title}
            </h3>
            <p className="text-[#888] text-lg mb-6 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-[#666] mb-8">
              <span>{post.author}</span>
              <span>·</span>
              <span>{post.readTime} min read</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 text-sm font-semibold tracking-[0.05em] uppercase transition-colors w-fit"
            >
              Read Article
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Visual */}
          <div className="bg-[#1a1a1a] border border-[#333] aspect-[4/3] lg:aspect-auto flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 border-2 border-[#dc2626] mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#dc2626] font-black text-2xl">B</span>
              </div>
              <p className="text-[#666] text-sm">Blog</p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
