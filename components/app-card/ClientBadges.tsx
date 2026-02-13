"use client";

import * as React from "react";
import { Sparkles, MessageCircle, Code, Bird, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientCompatibility {
  claude: boolean;
  chatgpt: boolean;
  vscode: boolean;
  goose: boolean;
}

interface ClientBadgesProps {
  compatibility: ClientCompatibility;
  className?: string;
  showLabels?: boolean;
}

interface ClientBadgeProps {
  name: string;
  icon: React.ReactNode;
  supported: boolean;
  colorClass: string;
  showLabel?: boolean;
}

function ClientBadge({
  name,
  icon,
  supported,
  colorClass,
  showLabel = false,
}: ClientBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200",
        "backdrop-blur-sm border",
        supported
          ? cn("bg-neutral-900/80 border-neutral-700/50", colorClass)
          : "bg-neutral-900/40 border-neutral-800/30 text-neutral-600 grayscale"
      )}
      title={`${name}: ${supported ? "Supported" : "Not supported"}`}
    >
      {icon}
      {showLabel && <span>{name}</span>}
      {supported ? (
        <Check className="w-3 h-3 ml-0.5" />
      ) : (
        <X className="w-3 h-3 ml-0.5" />
      )}
    </div>
  );
}

export function ClientBadges({
  compatibility,
  className,
  showLabels = false,
}: ClientBadgesProps) {
  const clients = [
    {
      name: "Claude",
      key: "claude" as const,
      icon: <Sparkles className="w-3.5 h-3.5" />,
      colorClass: "text-violet-400",
    },
    {
      name: "ChatGPT",
      key: "chatgpt" as const,
      icon: <MessageCircle className="w-3.5 h-3.5" />,
      colorClass: "text-green-400",
    },
    {
      name: "VS Code",
      key: "vscode" as const,
      icon: <Code className="w-3.5 h-3.5" />,
      colorClass: "text-blue-400",
    },
    {
      name: "Goose",
      key: "goose" as const,
      icon: <Bird className="w-3.5 h-3.5" />,
      colorClass: "text-orange-400",
    },
  ];

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {clients.map((client) => (
        <ClientBadge
          key={client.key}
          name={client.name}
          icon={client.icon}
          supported={compatibility[client.key]}
          colorClass={client.colorClass}
          showLabel={showLabels}
        />
      ))}
    </div>
  );
}

export function ClientBadgeOverlay({
  compatibility,
  className,
}: Omit<ClientBadgesProps, "showLabels">) {
  const clients = [
    {
      name: "Claude",
      key: "claude" as const,
      icon: <Sparkles className="w-3 h-3" />,
      colorClass: "text-violet-400",
      bgClass: "bg-violet-500/20",
    },
    {
      name: "ChatGPT",
      key: "chatgpt" as const,
      icon: <MessageCircle className="w-3 h-3" />,
      colorClass: "text-green-400",
      bgClass: "bg-green-500/20",
    },
    {
      name: "VS Code",
      key: "vscode" as const,
      icon: <Code className="w-3 h-3" />,
      colorClass: "text-blue-400",
      bgClass: "bg-blue-500/20",
    },
    {
      name: "Goose",
      key: "goose" as const,
      icon: <Bird className="w-3 h-3" />,
      colorClass: "text-orange-400",
      bgClass: "bg-orange-500/20",
    },
  ];

  return (
    <div
      className={cn(
        "absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5",
        className
      )}
    >
      {clients.map((client) => {
        const supported = compatibility[client.key];
        return (
          <div
            key={client.key}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium",
              "backdrop-blur-md border transition-all duration-200",
              supported
                ? cn(
                    "bg-neutral-950/70 border-neutral-700/50",
                    client.colorClass
                  )
                : "bg-neutral-950/40 border-neutral-800/30 text-neutral-600 grayscale opacity-60"
            )}
            title={`${client.name}: ${supported ? "Supported" : "Not supported"}`}
          >
            {client.icon}
            <span className="hidden sm:inline">{client.name}</span>
            {supported ? (
              <Check className="w-2.5 h-2.5" />
            ) : (
              <X className="w-2.5 h-2.5" />
            )}
          </div>
        );
      })}
    </div>
  );
}
