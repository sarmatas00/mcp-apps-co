import * as React from "react";
import { cn } from "@/lib/utils";

interface AppGridProps {
  children: React.ReactNode;
  className?: string;
}

export function AppGrid({ children, className }: AppGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5 lg:gap-6",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3",
        "xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export default AppGrid;
