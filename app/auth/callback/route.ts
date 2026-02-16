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
            // Ensure cookies are set with proper options
            cookieStore.set({
              name,
              value,
              ...options,
              path: "/",
              sameSite: "lax",
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

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
