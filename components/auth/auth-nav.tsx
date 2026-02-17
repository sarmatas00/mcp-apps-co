"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

export function AuthNav() {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    profile: Profile | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile(userId: string, email: string) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      setUser({ id: userId, email, profile: data });
      setLoading(false);
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded bg-[#222] animate-pulse" />
      </div>
    );
  }

  if (user) {
    const displayName = user.profile?.full_name || user.email.split("@")[0];

    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative w-8 h-8 rounded bg-[#1a1a1a] border border-[#333] flex items-center justify-center overflow-hidden">
            {user.profile?.avatar_url ? (
              <Image
                src={user.profile.avatar_url}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-[#666]" />
            )}
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            {displayName}
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/login"
        className="text-xs font-medium tracking-[0.1em] uppercase text-[#666] hover:text-white transition-colors"
      >
        Sign In
      </Link>
      <Link
        href="/auth/signup"
        className="text-xs font-medium tracking-[0.05em] uppercase bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
