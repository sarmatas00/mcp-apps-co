import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  async function resetPassword(formData: FormData) {
    "use server";

    const email = formData.get("email") as string;

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
    });

    if (error) {
      return redirect(
        "/auth/forgot-password?error=" + encodeURIComponent(error.message),
      );
    }

    return redirect(
      "/auth/forgot-password?message=" +
        encodeURIComponent("Check your email for the reset link"),
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 border border-[#333] bg-[#0a0a0a]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-[#666]">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {searchParams?.error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {searchParams.error}
          </div>
        )}

        {searchParams?.message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
            {searchParams.message}
          </div>
        )}

        <form action={resetPassword} className="space-y-6">
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

          <button
            type="submit"
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#333] text-center">
          <p className="text-sm text-[#666]">
            Remember your password?{" "}
            <a
              href="/auth/login"
              className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
