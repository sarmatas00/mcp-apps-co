"use client";

import * as React from "react";
import Image from "next/image";
import {
  Download,
  Copy,
  Check,
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
import type { AppDetailData } from "./types";

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

export function HeroSection({ app }: { app: AppDetailData }) {
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

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-[0.1em] uppercase text-[#666]">
              <span className="text-[#dc2626]">
                {formatCategory(app.category)}
              </span>
              <span className="text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white">{app.rating.toFixed(1)}</span>
                <span>({app.reviewCount} reviews)</span>
              </div>
              <span className="text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <span>{formatInstallCount(app.installCount)} installs</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase">
              {app.name}
            </h1>

            <p className="text-lg sm:text-xl text-[#888] max-w-2xl">
              {app.tagline}
            </p>

            <div className="flex flex-wrap gap-2">
              {Object.entries(app.compatibility).map(([client, supported]) => (
                <ClientBadge
                  key={client}
                  client={client}
                  supported={supported}
                />
              ))}
            </div>
          </div>

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
  );
}
