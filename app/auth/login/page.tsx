import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function signIn(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/auth/login?error=" + encodeURIComponent(error.message));
    }

    return redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-[#333]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase mb-2">
            Sign In
          </h1>
          <p className="text-sm text-[#666]">Sign in to submit your MCP apps</p>
        </div>

        <form action={signIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white placeholder:text-[#555] focus:border-[#dc2626] focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white placeholder:text-[#555] focus:border-[#dc2626] focus:outline-none transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#666]">
            Don&apos;t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
