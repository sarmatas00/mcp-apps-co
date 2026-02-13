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
  showLabel?: boolean;
}

function ClientBadge({
  name,
  icon,
  supported,
  showLabel = false,
}: ClientBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium tracking-[0.05em] uppercase",
        "border transition-all duration-200",
        supported
          ? "bg-[#111] border-[#444] text-white"
          : "bg-[#111]/50 border-[#222] text-[#444] grayscale"
      )}
      title={`${name}: ${supported ? "Supported" : "Not supported"}`}
    >
      {icon}
      {showLabel && <span>{name}</span>}
      {supported ? (
        <Check className="w-2.5 h-2.5" />
      ) : (
        <X className="w-2.5 h-2.5" />
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
      icon: <Sparkles className="w-3 h-3" />,
    },
    {
      name: "ChatGPT",
      key: "chatgpt" as const,
      icon: <MessageCircle className="w-3 h-3" />,
    },
    {
      name: "VS Code",
      key: "vscode" as const,
      icon: <Code className="w-3 h-3" />,
    },
    {
      name: "Goose",
      key: "goose" as const,
      icon: <Bird className="w-3 h-3" />,
    },
  ];

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {clients.map((client) => (
        <ClientBadge
          key={client.key}
          name={client.name}
          icon={client.icon}
          supported={compatibility[client.key]}
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
      icon: <Sparkles className="w-2.5 h-2.5" />,
    },
    {
      name: "ChatGPT",
      key: "chatgpt" as const,
      icon: <MessageCircle className="w-2.5 h-2.5" />,
    },
    {
      name: "VS Code",
      key: "vscode" as const,
      icon: <Code className="w-2.5 h-2.5" />,
    },
    {
      name: "Goose",
      key: "goose" as const,
      icon: <Bird className="w-2.5 h-2.5" />,
    },
  ];

  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 flex flex-wrap gap-1 p-3",
        className
      )}
    >
      {clients.map((client) => {
        const supported = compatibility[client.key];
        return (
          <div
            key={client.key}
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium tracking-[0.05em] uppercase",
              "border transition-all duration-200",
              supported
                ? "bg-[#111] border-[#444] text-white"
                : "bg-[#111]/60 border-[#222] text-[#444] grayscale opacity-70"
            )}
            title={`${client.name}: ${supported ? "Supported" : "Not supported"}`}
          >
            {client.icon}
            <span className="hidden sm:inline">{client.name}</span>
            {supported ? (
              <Check className="w-2 h-2" />
            ) : (
              <X className="w-2 h-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
