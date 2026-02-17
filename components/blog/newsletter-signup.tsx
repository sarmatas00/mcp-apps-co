"use client";

import { useState } from "react";
import { Mail, Loader2, Check, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email: email.trim(), source: "blog" }]);

      if (error) {
        if (error.code === "23505") {
          setError("You're already subscribed!");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setSuccess(true);
        setEmail("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="border border-green-500/30 bg-green-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-green-400 mb-1">
              You&apos;re subscribed!
            </h3>
            <p className="text-[#888] text-sm">
              Thanks for joining. You&apos;ll receive our latest updates in your
              inbox.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#333] bg-[#0a0a0a] p-6 sm:p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-[#dc2626]/20 flex items-center justify-center flex-shrink-0">
          <Mail className="w-5 h-5 text-[#dc2626]" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">
            Subscribe to our newsletter
          </h3>
          <p className="text-[#888] text-sm">
            Get the latest tutorials, showcases, and MCP Apps updates delivered
            to your inbox.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 bg-[#111] border border-[#333] px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-[#dc2626] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <p className="text-[10px] text-[#555]">
          No spam. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
}
