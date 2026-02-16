import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          console.log(`[Server] Getting cookie: ${name}, exists: ${!!cookie}`);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            console.log(`[Server] Setting cookie: ${name}`);
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error(`[Server] Error setting cookie ${name}:`, error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            console.log(`[Server] Removing cookie: ${name}`);
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            console.error(`[Server] Error removing cookie ${name}:`, error);
          }
        },
      },
    },
  );
}
