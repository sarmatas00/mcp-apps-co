"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { signInWithEmail } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error: signInError } = await signInWithEmail(email, password);

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    // Success - use window.location for full page redirect to ensure cookies are set
    window.location.href = redirectTo;
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 border border-[#333] bg-[#0a0a0a]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase mb-2">
            Sign In
          </h1>
          <p className="text-sm text-[#666]">
            Sign in to submit apps and view analytics
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <OAuthButtons mode="signin" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/auth/forgot-password"
              className="text-[#666] hover:text-[#dc2626] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#666] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#333] text-center">
          <p className="text-sm text-[#666]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
          <div className="w-full max-w-md p-8 border border-[#333] bg-[#0a0a0a]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
