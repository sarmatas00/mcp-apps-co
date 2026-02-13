"use client";

import { Sparkles, AppWindow, Code2, Zap } from "lucide-react";
import { AppCard, AppGrid, type AppData } from "@/components/app-card";

// Sample MCP Apps data for demonstration
const sampleApps: AppData[] = [
  {
    id: "1",
    name: "Interactive Charts",
    description: "Beautiful data visualizations and charts that render directly in your AI conversations. Supports line, bar, pie charts and more.",
    screenshotUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop",
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
    description: "Get intelligent code reviews with inline comments, suggestions, and visual diff rendering.",
    screenshotUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=500&fit=crop",
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
    description: "Create and collaborate on mind maps, flowcharts, and diagrams with an intuitive drag-and-drop interface.",
    screenshotUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&h=500&fit=crop",
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
    description: "Visual SQL query builder with schema exploration, query preview, and result rendering.",
    screenshotUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=500&fit=crop",
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
    description: "Advanced markdown renderer with support for diagrams, math equations, and custom themes.",
    screenshotUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
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
    description: "Test and debug APIs with a beautiful interface. Send requests, inspect responses, and save collections.",
    screenshotUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop",
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
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation */}
      <nav className="border-b border-neutral-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-700">
                <AppWindow className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-neutral-100">
                MCP Apps
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/modelcontextprotocol/ext-apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <Code2 className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <span className="text-sm text-violet-300">
              v0.1.0 - AppCard Component
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-neutral-100 sm:text-6xl">
            MCP Apps Directory
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-400">
            The curated marketplace for interactive UI components that bring your AI conversations to life. 
            Discover apps for Claude, ChatGPT, VS Code, and more.
          </p>

          {/* Feature Pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-400">
              <Zap className="h-4 w-4 text-cyan-400" />
              Interactive Components
            </div>
            <div className="flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-400">
              <AppWindow className="h-4 w-4 text-violet-400" />
              Multi-Platform
            </div>
            <div className="flex items-center gap-2 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm text-neutral-400">
              <Code2 className="h-4 w-4 text-emerald-400" />
              Open Source
            </div>
          </div>
        </div>

        {/* App Cards Grid */}
        <section className="pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-neutral-100">Featured Apps</h2>
            <span className="text-sm text-neutral-500">{sampleApps.length} apps</span>
          </div>
          
          <AppGrid>
            {sampleApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onClick={() => console.log(`Clicked on ${app.name}`)}
              />
            ))}
          </AppGrid>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">
              © 2026 MCP Apps Directory. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
