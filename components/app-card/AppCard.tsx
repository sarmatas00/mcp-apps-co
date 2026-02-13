"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientBadgeOverlay } from "./ClientBadges";

interface AppAuthor {
  name: string;
  avatarUrl?: string;
}

interface ClientCompatibility {
  claude: boolean;
  chatgpt: boolean;
  vscode: boolean;
  goose: boolean;
}

export interface AppData {
  id: string;
  name: string;
  description: string;
  screenshotUrl: string;
  category: string;
  rating: number;
  installCount: number;
  author: AppAuthor;
  compatibility: ClientCompatibility;
}

interface AppCardProps {
  app: AppData;
  onClick?: () => void;
  className?: string;
}

function formatInstallCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AppCard({ app, onClick, className }: AppCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border bg-neutral-900/50",
        "border-neutral-800 overflow-hidden cursor-pointer",
        "transition-all duration-300 ease-out",
        "hover:border-violet-500/50 hover:bg-neutral-900/80",
        "hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
        "hover:-translate-y-1",
        className
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {/* Screenshot Container - 16:10 Aspect Ratio */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-800">
        {!imageError ? (
          <Image
            src={app.screenshotUrl}
            alt={`${app.name} screenshot`}
            fill
            className={cn(
              "object-cover transition-transform duration-300 ease-out",
              isHovered && "scale-105"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-violet-900/20 to-cyan-900/20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-400">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-neutral-500">Preview unavailable</span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

        {/* Client Badges Overlay */}
        <ClientBadgeOverlay
          compatibility={app.compatibility}
          className="opacity-90 group-hover:opacity-100 transition-opacity duration-200"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-neutral-950/70 backdrop-blur-md border border-neutral-700/50 text-neutral-300">
            {formatCategory(app.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4 gap-3">
        {/* Header - Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-neutral-200">
              {app.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-100 leading-tight line-clamp-1 group-hover:text-violet-300 transition-colors duration-200">
          {app.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 flex-grow">
          {app.description}
        </p>

        {/* Footer - Author & Install Count */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50 mt-auto">
          <div className="flex items-center gap-2">
            {app.author.avatarUrl ? (
              <Image
                src={app.author.avatarUrl}
                alt={app.author.name}
                width={20}
                height={20}
                className="rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/40 to-cyan-500/40 flex items-center justify-center">
                <span className="text-[10px] font-medium text-neutral-300">
                  {app.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-neutral-500 truncate max-w-[100px]">
              @{app.author.name}
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-500">
            <Download className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {formatInstallCount(app.installCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
