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
        "group relative flex flex-col bg-[#111]",
        "border border-[#333]",
        "overflow-hidden cursor-pointer",
        "transition-all duration-200 ease-out",
        "hover:border-[#555] hover:-translate-y-0.5",
        className,
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
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#1a1a1a] border-b border-[#333]">
        {!imageError ? (
          <Image
            src={app.screenshotUrl}
            alt={`${app.name} screenshot`}
            fill
            className={cn(
              "object-cover transition-transform duration-300 ease-out",
              isHovered && "scale-[1.02]",
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 border border-[#333] flex items-center justify-center">
                <span className="text-2xl font-bold text-[#444]">
                  {app.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-[#555]">
                Preview unavailable
              </span>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

        {/* Client Badges Overlay */}
        <ClientBadgeOverlay
          compatibility={app.compatibility}
          className="opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />

        {/* Category Badge - Top Left */}
        <div className="absolute top-0 left-0">
          <span className="inline-flex items-center px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase bg-[#111] border-r border-b border-[#333] text-[#888]">
            {formatCategory(app.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 gap-4">
        {/* Header - Rating & Title Row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold text-white leading-tight tracking-tight line-clamp-1 group-hover:text-[#ccc] transition-colors duration-200">
            {app.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3 h-3 text-white fill-white" />
            <span className="text-xs font-semibold text-white">
              {app.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#777] leading-relaxed line-clamp-2 flex-grow tracking-tight">
          {app.description}
        </p>

        {/* Footer - Author & Install Count */}
        <div className="flex items-center justify-between pt-4 border-t border-[#222]">
          <div className="flex items-center gap-2">
            {app.author.avatarUrl ? (
              <Image
                src={app.author.avatarUrl}
                alt={app.author.name}
                width={20}
                height={20}
                className="border border-[#333]"
              />
            ) : (
              <div className="w-5 h-5 border border-[#333] bg-[#1a1a1a] flex items-center justify-center">
                <span className="text-[9px] font-semibold text-[#666]">
                  {app.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-[11px] font-medium text-[#555] tracking-tight truncate max-w-[100px]">
              @{app.author.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#555]">
            <Download className="w-3 h-3" />
            <span className="text-[11px] font-medium tracking-tight">
              {formatInstallCount(app.installCount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppCard;
