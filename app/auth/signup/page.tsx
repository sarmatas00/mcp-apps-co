"use client";

import { useState } from "react";
import Link from "next/link";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { signUpWithEmail } from "@/lib/supabase/client";

export default function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams?.error || null,
  );
  const [message, setMessage] = useState<string | null>(
    searchParams?.message || null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const { data, error: signUpError } = await signUpWithEmail(
      email,
      password,
      fullName,
    );

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (data?.user) {
      setMessage(
        `✓ Account created successfully!

📧 Check your email (${email}) for a confirmation link.
🔒 You must confirm your email before logging in.
⏱️ The confirmation link expires in 1 hour.`,
      );
      // Clear the form
      e.currentTarget.reset();
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 border border-[#333] bg-[#0a0a0a]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase mb-2">
            Create Account
          </h1>
          <p className="text-sm text-[#666]">
            Sign up to submit apps and view analytics
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm whitespace-pre-line">
            {message}
          </div>
        )}

        <div className="mb-6">
          <OAuthButtons mode="signup" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white placeholder:text-[#555] focus:border-[#dc2626] focus:outline-none transition-colors"
              placeholder="Your full name"
            />
          </div>

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
              minLength={8}
              className="w-full bg-[#1a1a1a] border border-[#333] px-4 py-3 text-white placeholder:text-[#555] focus:border-[#dc2626] focus:outline-none transition-colors"
              placeholder="•••••••• (min 8 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:bg-[#666] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#333] text-center">
          <p className="text-sm text-[#666]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
