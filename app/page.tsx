"use client";

import { AppCard, AppGrid, type AppData } from "@/components/app-card";
import { SearchCommand } from "@/components/search-command";
import { CategoryFilter } from "@/components/category-filter";

// Sample MCP Apps data
const sampleApps: AppData[] = [
  {
    id: "1",
    name: "Interactive Charts",
    description:
      "Beautiful data visualizations and charts that render directly in your AI conversations. Supports line, bar, pie charts and more.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
    category: "data-visualization",
    rating: 4.8,
    installCount: 12500,
    author: { name: "datawiz" },
    compatibility: {
      claude: true,
      chatgpt: true,
      vscode: false,
      goose: true,
    },
  },
  {
    id: "2",
    name: "Code Review Assistant",
    description:
      "Get intelligent code reviews with inline comments, suggestions, and visual diff rendering.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.9,
    installCount: 8750,
    author: { name: "devtools" },
    compatibility: {
      claude: true,
      chatgpt: true,
      vscode: true,
      goose: true,
    },
  },
  {
    id: "3",
    name: "Mind Map Canvas",
    description:
      "Create and collaborate on mind maps, flowcharts, and diagrams with an intuitive drag-and-drop interface.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop",
    category: "productivity",
    rating: 4.6,
    installCount: 5400,
    author: { name: "mapmaster" },
    compatibility: {
      claude: true,
      chatgpt: false,
      vscode: false,
      goose: true,
    },
  },
  {
    id: "4",
    name: "SQL Query Builder",
    description:
      "Visual SQL query builder with schema exploration, query preview, and result rendering.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.7,
    installCount: 3200,
    author: { name: "sqlexpert" },
    compatibility: {
      claude: true,
      chatgpt: true,
      vscode: true,
      goose: false,
    },
  },
  {
    id: "5",
    name: "Markdown Preview Pro",
    description:
      "Advanced markdown renderer with support for diagrams, math equations, and custom themes.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
    category: "productivity",
    rating: 4.5,
    installCount: 8900,
    author: { name: "mdmaster" },
    compatibility: {
      claude: true,
      chatgpt: true,
      vscode: true,
      goose: true,
    },
  },
  {
    id: "6",
    name: "API Tester",
    description:
      "Test and debug APIs with a beautiful interface. Send requests, inspect responses, and save collections.",
    screenshotUrl:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
    category: "developer-tools",
    rating: 4.4,
    installCount: 2100,
    author: { name: "apiguru" },
    compatibility: {
      claude: true,
      chatgpt: false,
      vscode: true,
      goose: false,
    },
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Architectural Grid Lines - Top */}
      <div className="fixed top-0 left-0 right-0 h-px bg-[#333] z-50" />
      <div className="fixed top-0 bottom-0 left-[50%] w-px bg-[#333] z-40 hidden lg:block" />

      {/* Navigation - Minimal with Search */}
      <nav className="border-b border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#666]">
                MCP
              </span>
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
                    <button className="group inline-flex items-center gap-4 bg-[#dc2626] text-white px-8 py-4 text-sm font-semibold tracking-[0.05em] uppercase hover:bg-[#b91c1c] transition-colors">
                      <span>Browse Collection</span>
                      <span className="text-lg group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Architectural Stats */}
              <div className="flex flex-col justify-between py-16 lg:py-24 lg:pl-12 border-t lg:border-t-0 border-[#333]">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-[#333]">
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      {sampleApps.length}
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Featured Apps
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      4
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Platforms
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-[#dc2626] leading-none">
                      ∞
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Possibilities
                    </p>
                  </div>
                  <div className="bg-[#111] p-6 sm:p-8">
                    <span className="text-[clamp(2rem,5vw,4rem)] font-black text-white leading-none">
                      0
                    </span>
                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-[#666] mt-2">
                      Borders
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
            <CategoryFilter
              categories={[
                { id: "data-visualization", name: "Data Visualization", count: 12 },
                { id: "developer-tools", name: "Developer Tools", count: 24 },
                { id: "productivity", name: "Productivity", count: 18 },
                { id: "communication", name: "Communication", count: 8 },
                { id: "content-creation", name: "Content Creation", count: 15 },
              ]}
            />
          </div>
        </section>

        {/* Apps Section - Asymmetric Grid */}
        <section className="py-24 sm:py-32">
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
                  {sampleApps.length} Apps
                </span>
                <div className="w-12 h-px bg-[#333]" />
              </div>
            </div>

            {/* App Grid */}
            <AppGrid>
              {sampleApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onClick={() => console.log(`Clicked on ${app.name}`)}
                />
              ))}
            </AppGrid>
          </div>
        </section>

        {/* CTA Section - Full Width */}
        <section className="border-t border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="py-16 lg:py-24 lg:pr-12 border-r border-[#333]">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] block mb-4">
                  Submit Your App
                </span>
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] uppercase leading-[0.95] mb-6">
                  JOIN THE
                  <br />
                  DIRECTORY
                </h3>
                <p className="text-[#888] max-w-md mb-8">
                  Have you built an MCP App? Submit it to our curated directory
                  and reach thousands of developers.
                </p>
                <button className="inline-flex items-center gap-4 border border-[#333] text-white px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-white hover:text-black transition-colors">
                  <span>Get Started</span>
                  <span>→</span>
                </button>
              </div>
              <div className="py-16 lg:py-24 lg:pl-12 border-t lg:border-t-0 border-[#333] flex items-center">
                <div className="grid grid-cols-2 gap-8 w-full">
                  <div className="border-l-2 border-[#dc2626] pl-4">
                    <span className="text-2xl font-black">MIT</span>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">
                      License
                    </p>
                  </div>
                  <div className="border-l-2 border-[#333] pl-4">
                    <span className="text-2xl font-black">Open</span>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">
                      Source
                    </p>
                  </div>
                  <div className="border-l-2 border-[#333] pl-4">
                    <span className="text-2xl font-black">Curated</span>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">
                      Quality
                    </p>
                  </div>
                  <div className="border-l-2 border-[#333] pl-4">
                    <span className="text-2xl font-black">Global</span>
                    <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mt-1">
                      Community
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Architectural */}
        <footer className="border-t border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
            <div className="py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium tracking-[0.2em] uppercase text-[#444]">
                  MCP APPS
                </span>
                <div className="w-2 h-2 bg-[#333]" />
                <span className="text-[10px] tracking-[0.15em] uppercase text-[#333]">
                  Swiss Studio
                </span>
              </div>
              <div className="flex items-center gap-8">
                <a
                  href="#"
                  className="text-[10px] tracking-[0.15em] uppercase text-[#555] hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-[10px] tracking-[0.15em] uppercase text-[#555] hover:text-white transition-colors"
                >
                  Docs
                </a>
                <a
                  href="#"
                  className="text-[10px] tracking-[0.15em] uppercase text-[#555] hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
              <span className="text-[10px] tracking-[0.1em] text-[#333]">
                © 2026
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
