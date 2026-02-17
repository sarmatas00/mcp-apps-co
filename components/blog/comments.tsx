"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  content: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

interface CommentsSectionProps {
  postSlug: string;
}

export function CommentsSection({ postSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Fetch user and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Get comments
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          *,
          profiles:user_id (full_name, avatar_url)
        `,
        )
        .eq("post_slug", postSlug)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching comments:", error);
      } else {
        setComments(data || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [postSlug, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_slug: postSlug,
          user_id: user.id,
          content: newComment.trim(),
        },
      ])
      .select(
        `
        *,
        profiles:user_id (full_name, avatar_url)
      `,
      )
      .single();

    if (error) {
      console.error("Error posting comment:", error);
    } else if (data) {
      setComments([data, ...comments]);
      setNewComment("");
    }

    setSubmitting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="mt-16 pt-12 border-t border-[#333]">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-[#666] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-12 border-t border-[#333]">
      <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-8">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-12">
          <div className="border border-[#333] bg-[#0a0a0a]">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-transparent p-4 text-white placeholder-[#555] resize-none focus:outline-none"
              rows={4}
              disabled={submitting}
            />
            <div className="border-t border-[#333] p-4 flex items-center justify-between">
              <span className="text-xs text-[#666]">
                Posting as {user.user_metadata?.full_name || "Anonymous"}
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Comment
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-12 p-6 border border-[#333] bg-[#0a0a0a] text-center">
          <MessageSquare className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[#888] mb-4">Sign in to join the discussion</p>
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <article
              key={comment.id}
              className="border border-[#333] bg-[#0a0a0a] p-6"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {(comment.profiles?.full_name || "A").charAt(0)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-white">
                      {comment.profiles?.full_name || "Anonymous"}
                    </span>
                    <span className="text-xs text-[#555]">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-[#888] whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-[#333]">
          <MessageSquare className="w-8 h-8 text-[#333] mx-auto mb-3" />
          <p className="text-[#666]">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </div>
  );
}
