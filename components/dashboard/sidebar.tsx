"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  PlusCircle,
  BarChart3,
  LogOut,
  User,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

interface DashboardSidebarProps {
  user: {
    id: string;
    email: string;
    profile: Profile | null;
  };
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Apps",
    href: "/dashboard/apps",
    icon: PlusCircle,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const externalNavItems = [
  {
    label: "Browse Apps",
    href: "/",
    icon: Home,
  },
];

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const displayName = user.profile?.full_name || user.email.split("@")[0];
  const avatarUrl = user.profile?.avatar_url;

  return (
    <aside className="w-64 min-h-screen border-r border-[#333] bg-[#0a0a0a] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#333]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#dc2626] flex items-center justify-center">
            <span className="text-white font-black text-sm">M</span>
          </div>
          <span className="text-xl font-black tracking-tight uppercase">
            MCP Apps
          </span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-[#333]">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded bg-[#1a1a1a] border border-[#333] flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-[#666]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-[#666] truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                    isActive
                      ? "bg-[#1a1a1a] text-white border-l-2 border-[#dc2626]"
                      : "text-[#666] hover:text-white hover:bg-[#1a1a1a]",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* External Links */}
        <div className="mt-6 pt-6 border-t border-[#333]">
          <p className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 px-4">
            Directory
          </p>
          <ul className="space-y-1">
            {externalNavItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-[#333]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-sm text-[#666] hover:text-white transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
