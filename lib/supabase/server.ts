import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Ensure cookies work across the entire domain
        flowType: "pkce",
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Important: Must match the cookie options used by Supabase Auth
            cookieStore.set({
              name,
              value,
              ...options,
              // Ensure cookies are accessible across the entire site
              path: "/",
              // Use lax for OAuth compatibility
              sameSite: "lax",
              // Secure in production
              secure: process.env.NODE_ENV === "production",
              // 7 days expiration for session
              maxAge: 60 * 60 * 24 * 7,
            });
          } catch (error) {
            // Handle error silently - cookies might be blocked
            console.error(`Error setting cookie ${name}:`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              path: "/",
              maxAge: 0,
            });
          } catch (error) {
            console.error(`Error removing cookie ${name}:`, error);
          }
        },
      },
    },
  );
}
