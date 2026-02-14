"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Star,
  Download,
  Copy,
  Check,
  Github,
  Sparkles,
  Code,
  Bird,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getAppBySlug,
  getRelatedApps,
  getReviewsByAppId,
} from "@/lib/supabase/client";
import type { App, Review } from "@/lib/supabase/types";

function getClientName(client: string): string {
  const names: Record<string, string> = {
    claude: "Claude",
    chatgpt: "ChatGPT",
    vscode: "VS Code",
    goose: "Goose",
  };
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
      "mcp.servers": [
        { name: appSlug, command: "npx", args: [`@mcp-apps/${appSlug}`] },
      ],
    },
    goose: {
      extensions: {
        [appSlug]: {
          name: appSlug,
          cmd: "npx",
          args: [`@mcp-apps/${appSlug}`],
        },
      },
    },
  };
  return JSON.stringify(configs[client] || configs.claude, null, 2);
}

function ClientBadge({
  client,
  supported,
}: {
  client: string;
  supported: boolean;
}) {
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
          : "bg-[#111] border-[#222] text-[#444]",
      )}
    >
      {icons[client]}
      <span>{getClientName(client)}</span>
      {supported ? (
        <Check className="w-3 h-3" />
      ) : (
        <span className="text-[8px]">—</span>
      )}
    </div>
  );
}

function StarRating({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizeClass,
            star <= Math.round(rating)
              ? "text-white fill-white"
              : "text-[#444]",
          )}
        />
      ))}
    </div>
  );
}

function formatInstallCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
}

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function AppDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [app, setApp] = React.useState<App | null>(null);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [relatedApps, setRelatedApps] = React.useState<App[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedClient, setSelectedClient] = React.useState<string>("claude");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      const appData = await getAppBySlug(slug);
      if (appData) {
        setApp(appData);

        // Fetch reviews and related apps in parallel
        const [reviewsData, relatedData] = await Promise.all([
          getReviewsByAppId(appData.id),
          getRelatedApps(appData.id, appData.category_id, 3),
        ]);

        setReviews(reviewsData);
        setRelatedApps(relatedData);
      }
      setLoading(false);
    }

    fetchData();
  }, [slug]);

  const handleCopy = () => {
    if (!app) return;
    navigator.clipboard.writeText(generateConfig(app.slug, selectedClient));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <div className="text-[#666]">Loading...</div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Not Found</h1>
          <Link href="/" className="text-[#dc2626] hover:underline">
            ← Back to all apps
          </Link>
        </div>
      </div>
    );
  }

  const supportedClients = [
    app.compatibility_claude && "claude",
    app.compatibility_chatgpt && "chatgpt",
    app.compatibility_vscode && "vscode",
    app.compatibility_goose && "goose",
  ].filter((c): c is string => Boolean(c));

  const screenshotUrl =
    app.screenshot_urls?.[0] ||
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=750&fit=crop";

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
            <Link
              href="/"
              className="text-[#666] hover:text-white transition-colors"
            >
              Apps
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-white">{app.name}</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-[#333]">
        {/* Screenshot */}
        <div className="relative w-full aspect-[16/10] bg-[#0a0a0a]">
          <Image
            src={screenshotUrl}
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
              <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-[#666]">
                <span className="text-[#dc2626]">
                  {formatCategory(app.category?.slug || "")}
                </span>
                <span className="text-[#333]">|</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white">{app.rating.toFixed(1)}</span>
                  <span>({app.review_count} reviews)</span>
                </div>
                <span className="text-[#333]">|</span>
                <div className="flex items-center gap-1.5">
                  <span>{formatInstallCount(app.install_count)} installs</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
                {app.name}
              </h1>

              <p className="text-lg sm:text-xl text-[#888] max-w-2xl">
                {app.tagline}
              </p>

              <div className="flex flex-wrap gap-2">
                <ClientBadge
                  client="claude"
                  supported={app.compatibility_claude}
                />
                <ClientBadge
                  client="chatgpt"
                  supported={app.compatibility_chatgpt}
                />
                <ClientBadge
                  client="vscode"
                  supported={app.compatibility_vscode}
                />
                <ClientBadge
                  client="goose"
                  supported={app.compatibility_goose}
                />
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
                <DropdownMenuContent
                  align="end"
                  className="w-[300px] bg-[#1a1a1a] border-[#333] p-4"
                >
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
                                : "bg-[#111] border-[#333] text-[#888] hover:border-[#555]",
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
                          {copied ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
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
                  <p>{app.long_description || app.description}</p>
                </div>
              </div>

              <div className="space-y-10">
                {app.github_url && (
                  <div>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-4">
                      Links
                    </span>
                    <div className="space-y-3">
                      <a
                        href={app.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-[#aaa] hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub Repository
                      </a>
                      {app.npm_package && (
                        <span className="flex items-center gap-3 text-sm text-[#aaa]">
                          <Code className="w-4 h-4" />
                          npm: {app.npm_package}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="py-12 lg:py-16 border-b border-[#333]">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-2">
                    Reviews
                  </span>
                  <div className="flex items-center gap-3">
                    <StarRating rating={app.rating} size="lg" />
                    <span className="text-2xl font-bold">
                      {app.rating.toFixed(1)}
                    </span>
                    <span className="text-[#666]">
                      ({app.review_count} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((review) => (
                  <div key={review.id} className="border border-[#333] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <StarRating rating={review.rating} size="sm" />
                      <ClientBadge
                        client={review.client_used || "claude"}
                        supported={true}
                      />
                    </div>
                    <p className="text-sm text-[#aaa] mb-4 leading-relaxed">
                      {review.comment}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#666]">
                      <span>@{review.author || "anonymous"}</span>
                      <span>
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Apps */}
        {relatedApps.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#666] block mb-8">
                Related Apps
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedApps.map((relatedApp) => (
                  <Link
                    key={relatedApp.id}
                    href={`/app/${relatedApp.slug}`}
                    className="group border border-[#333] hover:border-[#dc2626] transition-colors"
                  >
                    <div className="relative aspect-[16/10] bg-[#0a0a0a] overflow-hidden">
                      <Image
                        src={
                          relatedApp.screenshot_urls?.[0] ||
                          "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop"
                        }
                        alt={relatedApp.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] tracking-wide uppercase text-[#dc2626]">
                          {formatCategory(relatedApp.category?.slug || "")}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-white fill-white" />
                          <span className="text-xs">
                            {relatedApp.rating.toFixed(1)}
                          </span>
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
        )}
      </main>
    </div>
  );
}
