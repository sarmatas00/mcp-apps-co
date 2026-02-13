"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Download,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Github,
  Globe,
  ExternalLink,
  Sparkles,
  Code,
  Bird,
  MessageCircle,
  Terminal,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface AppAuthor {
  name: string;
  avatarUrl?: string;
  github?: string;
  website?: string;
  bio?: string;
}

interface ClientCompatibility {
  claude: boolean;
  chatgpt: boolean;
  vscode: boolean;
  goose: boolean;
}

interface Review {
  id: string;
  author: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  content: string;
  clientUsed: keyof ClientCompatibility;
}

interface RelatedApp {
  id: string;
  slug: string;
  name: string;
  screenshotUrl: string;
  category: string;
  rating: number;
}

interface AppDetailData {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fullDescription: string;
  features: string[];
  useCases: string[];
  screenshots: string[];
  category: string;
  rating: number;
  reviewCount: number;
  installCount: number;
  author: AppAuthor;
  compatibility: ClientCompatibility;
  githubUrl?: string;
  websiteUrl?: string;
  reviews: Review[];
  relatedApps: RelatedApp[];
}

// Sample data
const sampleApp: AppDetailData = {
  id: "1",
  slug: "interactive-charts",
  name: "Interactive Charts",
  tagline: "Beautiful data visualizations that render directly in AI conversations",
  description: "Beautiful data visualizations and charts that render directly in your AI conversations.",
  fullDescription: `Interactive Charts brings the power of data visualization to your AI assistant. Create stunning, interactive charts directly within your conversations without leaving the chat interface.

Whether you're analyzing sales data, tracking project metrics, or presenting research findings, Interactive Charts makes it effortless to transform raw data into compelling visual stories.

The component supports a wide range of chart types including line charts for trends, bar charts for comparisons, pie charts for distributions, and scatter plots for correlations.`,
  features: [
    "Line, bar, pie, and scatter chart types",
    "Real-time data updates",
    "Interactive tooltips and legends",
    "Responsive design for all screen sizes",
    "Export charts as PNG or SVG",
    "Dark mode support",
    "Animation transitions",
  ],
  useCases: [
    "Sales performance dashboards",
    "Project timeline visualizations",
    "Financial data analysis",
    "Scientific research presentations",
    "Social media analytics",
  ],
  screenshots: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=750&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=750&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=750&fit=crop",
  ],
  category: "data-visualization",
  rating: 4.8,
  reviewCount: 324,
  installCount: 12500,
  author: {
    name: "datawiz",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    github: "https://github.com/datawiz",
    website: "https://datawiz.io",
    bio: "Data visualization enthusiast",
  },
  compatibility: {
    claude: true,
    chatgpt: true,
    vscode: false,
    goose: true,
  },
  githubUrl: "https://github.com/datawiz/interactive-charts",
  websiteUrl: "https://interactive-charts.dev",
  reviews: [
    {
      id: "1",
      author: "sarah_dev",
      rating: 5,
      date: "2026-02-10",
      content: "Absolutely game-changing for my data analysis workflow. The charts are beautiful and the integration with Claude is seamless.",
      clientUsed: "claude",
    },
    {
      id: "2",
      author: "metrics_guru",
      rating: 4,
      date: "2026-02-08",
      content: "Great component! Would love to see more chart types like heatmaps in future updates.",
      clientUsed: "chatgpt",
    },
    {
      id: "3",
      author: "analytics_pro",
      rating: 5,
      date: "2026-02-05",
      content: "The export functionality is a lifesaver. I use this daily for client presentations.",
      clientUsed: "claude",
    },
  ],
  relatedApps: [
    {
      id: "2",
      slug: "sql-query-builder",
      name: "SQL Query Builder",
      screenshotUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
      category: "developer-tools",
      rating: 4.7,
    },
    {
      id: "3",
      slug: "mind-map-canvas",
      name: "Mind Map Canvas",
      screenshotUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&h=250&fit=crop",
      category: "productivity",
      rating: 4.6,
    },
  ],
};

// Utilities
function formatInstallCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function formatCategory(category: string): string {
  return category.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function getClientName(client: string): string {
  const names: Record<string, string> = { claude: "Claude", chatgpt: "ChatGPT", vscode: "VS Code", goose: "Goose" };
  return names[client] || client;
}

function generateConfig(appSlug: string, client: string): string {
  const configs: Record<string, object> = {
    claude: {
      mcpServers: {
        [appSlug]: {
          command: "npx",
          args: [`@mcp-apps/${appSlug}`],
          env: { API_KEY: "your-api-key" },
        },
      },
    },
    chatgpt: {
      name: appSlug,
      description: `MCP App: ${appSlug}`,
    },
    vscode: {
      "mcp.servers": [{ name: appSlug, command: "npx", args: [`@mcp-apps/${appSlug}`] }],
    },
    goose: {
      extensions: {
        [appSlug]: { name: appSlug, cmd: "npx", args: [`@mcp-apps/${appSlug}`] },
      },
    },
  };
  return JSON.stringify(configs[client] || configs.claude, null, 2);
}

// Components
function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating) ? "text-white fill-white" : "text-[#444]"
          )}
        />
      ))}
    </div>
  );
}

function ClientBadge({ client, supported }: { client: string; supported: boolean }) {
  const icons: Record<string, React.ReactNode> = {
    claude: <Sparkles className="w-3.5 h-3.5" />,
    chatgpt: <MessageCircle className="w-3.5 h-3.5" />,
    vscode: <Code className="w-3.5 h-3.5" />,
    goose: <Bird className="w-3.5 h-3.5" />,
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium tracking-wide uppercase border",
        supported
          ? "bg-[#1a1a1a] border-[#444] text-white"
          : "bg-[#111] border-[#222] text-[#444]"
      )}
    >
      {icons[client]}
      <span>{getClientName(client)}</span>
      {supported ? <Check className="w-3 h-3" /> : <span className="text-[8px]">—</span>}
    </div>
  );
}

// Hero Section
function HeroSection({ app }: { app: AppDetailData }) {
  const [selectedClient, setSelectedClient] = React.useState<string>("claude");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generateConfig(app.slug, selectedClient));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const supportedClients = Object.entries(app.compatibility)
    .filter(([, supported]) => supported)
    .map(([client]) => client);

  return (
    <section className="border-b border-[#333]">
      {/* Screenshot */}
      <div className="relative w-full aspect-[16/10] bg-[#0a0a0a]">
        <Image
          src={app.screenshots[0]}
          alt={`${app.name} screenshot`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          {/* Left */}
          <div className="space-y-6">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-[#666]">
              <span className="text-[#dc2626]">{formatCategory(app.category)}</span>
              <span className="text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-white fill-white" />
                <span className="text-white">{app.rating.toFixed(1)}</span>
                <span>({app.reviewCount} reviews)</span>
              </div>
              <span className="text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <Download className="w-3 h-3" />
                <span>{formatInstallCount(app.installCount)} installs</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
              {app.name}
            </h1>

            {/* Tagline */}
            <p className="text-lg sm:text-xl text-[#888] max-w-2xl">
              {app.tagline}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(app.compatibility).map(([client, supported]) => (
                <ClientBadge key={client} client={client} supported={supported} />
              ))}
            </div>
          </div>

          {/* Right - Install */}
          <div className="flex flex-col gap-3 lg:min-w-[260px]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white border-0 h-12 px-8 text-sm font-semibold tracking-wide uppercase">
                  <Download className="w-4 h-4 mr-2" />
                  Install
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] bg-[#1a1a1a] border-[#333] p-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-wide uppercase text-[#666] block mb-2">
                      Select Client
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {supportedClients.map((client) => (
                        <button
                          key={client}
                          onClick={() => setSelectedClient(client)}
                          className={cn(
                            "px-3 py-1.5 text-[10px] font-medium tracking-wide uppercase border transition-colors",
                            selectedClient === client
                              ? "bg-[#dc2626] border-[#dc2626] text-white"
                              : "bg-[#111] border-[#333] text-[#888] hover:border-[#555]"
                          )}
                        >
                          {getClientName(client)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] tracking-wide uppercase text-[#666]">
                        Configuration
                      </label>
                      <button
                        onClick={handleCopy}
                        className="text-[10px] text-[#888] hover:text-white flex items-center gap-1"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="bg-[#0a0a0a] border border-[#333] p-3 text-[10px] text-[#888] font-mono overflow-x-auto max-h-[100px]">
                      {generateConfig(app.slug, selectedClient)}
                    </pre>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-center">
              <span className="text-[10px] tracking-wide uppercase text-[#555]">
                Free • Open Source
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AppDetailPage() {
  const params = useParams();
  const app = sampleApp;

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-4">
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">
              MCP Apps
            </Link>
            <span className="text-[#333]">/</span>
            <Link href="/" className="text-[#666] hover:text-white transition-colors">
              Apps
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-white">{app.name}</span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <HeroSection app={app} />

      {/* Main Content */}
      <main>
        {/* Description */}
        <section className="py-12 lg:py-16 border-b border-[#333]">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-4">
                  About
                </span>
                <div className="space-y-4 text-[#aaa] leading-relaxed">
                  {app.fullDescription.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-4">
                    Features
                  </span>
                  <ul className="space-y-3">
                    {app.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 bg-[#dc2626] mt-2" />
                        <span className="text-sm text-[#aaa]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-4">
                    Use Cases
                  </span>
                  <ul className="space-y-3">
                    {app.useCases.map((useCase, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Terminal className="w-3.5 h-3.5 text-[#555] mt-0.5" />
                        <span className="text-sm text-[#aaa]">{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-12 lg:py-16 border-b border-[#333]">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-2">
                  Reviews
                </span>
                <div className="flex items-center gap-3">
                  <StarRating rating={app.rating} size="lg" />
                  <span className="text-2xl font-bold">{app.rating.toFixed(1)}</span>
                  <span className="text-[#666]">({app.reviewCount} reviews)</span>
                </div>
              </div>
              <Button className="bg-transparent border border-[#333] hover:border-[#dc2626] text-white h-10 px-6 text-sm">
                Write a Review
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {app.reviews.map((review) => (
                <div key={review.id} className="border border-[#333] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={review.rating} size="sm" />
                    <ClientBadge client={review.clientUsed} supported={true} />
                  </div>
                  <p className="text-sm text-[#aaa] mb-4 leading-relaxed">{review.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#666]">
                    <span>@{review.author}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer */}
        <section className="py-12 lg:py-16 border-b border-[#333]">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-8">
              Developer
            </span>
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-[#1a1a1a] border border-[#333] overflow-hidden">
                {app.author.avatarUrl && (
                  <Image
                    src={app.author.avatarUrl}
                    alt={app.author.name}
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{app.author.name}</h3>
                {app.author.bio && (
                  <p className="text-sm text-[#888] mb-4">{app.author.bio}</p>
                )}
                <div className="flex items-center gap-4">
                  {app.author.github && (
                    <a
                      href={app.author.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {app.author.website && (
                    <a
                      href={app.author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-[#888] hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Apps */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-8">
              Related Apps
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {app.relatedApps.map((relatedApp) => (
                <Link
                  key={relatedApp.id}
                  href={`/app/${relatedApp.slug}`}
                  className="group border border-[#333] hover:border-[#dc2626] transition-colors"
                >
                  <div className="relative aspect-[16/10] bg-[#0a0a0a] overflow-hidden">
                    <Image
                      src={relatedApp.screenshotUrl}
                      alt={relatedApp.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-wide uppercase text-[#dc2626]">
                        {formatCategory(relatedApp.category)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-white fill-white" />
                        <span className="text-xs">{relatedApp.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h4 className="font-semibold group-hover:text-[#dc2626] transition-colors">
                      {relatedApp.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
