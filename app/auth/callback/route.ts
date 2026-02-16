import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  console.log("[OAuth Callback] Code received:", !!code);
  console.log("[OAuth Callback] Origin:", requestUrl.origin);

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = cookieStore.get(name)?.value;
            console.log(`[OAuth Callback] Getting cookie: ${name}, exists: ${!!value}`);
            return value;
          },
          set(name: string, value: string, options: CookieOptions) {
            console.log(`[OAuth Callback] Setting cookie: ${name}`);
            // Ensure cookies are set with proper options
            cookieStore.set({
              name,
              value,
              ...options,
              path: "/",
              sameSite: "lax",
              // Don't set secure in development
              secure: process.env.NODE_ENV === "production",
            });
          },
          remove(name: string, options: CookieOptions) {
            console.log(`[OAuth Callback] Removing cookie: ${name}`);
            cookieStore.delete({
              name,
              ...options,
              path: "/",
            });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("[OAuth Callback] Exchange result:", {
      hasSession: !!data.session,
      error: error?.message,
    });

    if (error) {
      console.error("[OAuth Callback] Error:", error);
      return NextResponse.redirect(
        new URL(
          "/auth/login?error=" + encodeURIComponent(error.message),
          requestUrl.origin,
        ),
      );
    }
    
    if (data.session) {
      console.log("[OAuth Callback] Session created for user:", data.session.user.id);
    }
  }

  // URL to redirect to after sign in process completes
  console.log("[OAuth Callback] Redirecting to dashboard");
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
}
