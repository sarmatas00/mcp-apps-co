"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: { id: string; name: string; count?: number }[];
  activeCategory?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={cn(
          "px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase border transition-colors",
          !activeCategory
            ? "bg-[#dc2626] border-[#dc2626] text-white"
            : "bg-transparent border-[#333] text-[#888] hover:border-[#555] hover:text-white",
        )}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.id}`}
          className={cn(
            "px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase border transition-colors",
            activeCategory === category.id
              ? "bg-[#dc2626] border-[#dc2626] text-white"
              : "bg-transparent border-[#333] text-[#888] hover:border-[#555] hover:text-white",
          )}
        >
          {category.name}
          {category.count !== undefined && (
            <span className="ml-2 text-[#666]">({category.count})</span>
          )}
        </Link>
      ))}
    </div>
  );
}
