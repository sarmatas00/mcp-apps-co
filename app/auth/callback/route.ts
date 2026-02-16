import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            // Set cookie with proper options for cross-page access
            cookieStore.set({
              name,
              value,
              ...options,
              path: "/",
              sameSite: "lax",
              secure: process.env.NODE_ENV === "production",
              // 7 days
              maxAge: 60 * 60 * 24 * 7,
            });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({
              name,
              ...options,
              path: "/",
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth callback error:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" + encodeURIComponent(error.message),
          requestUrl.origin,
        ),
      );
    }
  }

  // Redirect to dashboard after successful OAuth
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
