"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
  slug?: string;
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

  const cardClassName = cn(
    "group relative flex flex-col bg-[#111]",
    "border border-[#333]",
    "overflow-hidden",
    "transition-all duration-200 ease-out",
    "hover:border-[#555] hover:-translate-y-0.5",
    className,
  );

  const cardContent = (
    <>
      {/* Screenshot Container */}
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

        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />

        <ClientBadgeOverlay
          compatibility={app.compatibility}
          className="opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />

        <div className="absolute top-0 left-0">
          <span className="inline-flex items-center px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] uppercase bg-[#111] border-r border-b border-[#333] text-[#888]">
            {formatCategory(app.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 gap-4">
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

        <p className="text-sm text-[#888] leading-relaxed line-clamp-2 flex-grow">
          {app.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[#333]">
          <div className="flex items-center gap-2">
            {app.author.avatarUrl ? (
              <Image
                src={app.author.avatarUrl}
                alt={app.author.name}
                width={20}
                height={20}
                className="object-cover"
              />
            ) : (
              <div className="w-5 h-5 bg-[#333] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#666]">
                  {app.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-xs text-[#666] truncate max-w-[100px]">
              {app.author.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[#666]">
            <Download className="w-3 h-3" />
            <span className="text-xs">
              {formatInstallCount(app.installCount)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  if (app.slug) {
    return (
      <Link
        href={`/app/${app.slug}`}
        className={cardClassName}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      className={cardClassName}
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
      {cardContent}
    </div>
  );
}

export default AppCard;
