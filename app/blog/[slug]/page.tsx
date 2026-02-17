import Link from "next/link";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog/posts";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#111] text-white">
        <div className="mx-auto max-w-3xl px-6 py-24">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <p className="mt-4 text-gray-400">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block text-red-500 hover:text-red-400"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related posts
  const relatedPosts = getRelatedPosts(post.slug, post.category, post.tags, 3);

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Navigation */}
      <nav className="border-b border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#dc2626] flex items-center justify-center">
                <span className="text-white font-black text-sm">M</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">
                MCP Apps
              </span>
            </Link>
            <span className="text-[#333]">/</span>
            <Link href="/blog" className="text-[#888] hover:text-white">
              Blog
            </Link>
            <span className="text-[#333]">/</span>
            <span className="text-[#666] truncate max-w-[200px]">
              {post.title}
            </span>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Meta */}
        <div className="mb-8">
          {post.category && (
            <Link
              href={`/blog/category/${post.category}`}
              className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] hover:text-white transition-colors"
            >
              {post.category}
            </Link>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] mb-8 leading-tight">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-12 pb-12 border-b border-[#333]">
          <span className="text-white">{post.author}</span>
          <span>·</span>
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-[#dc2626] prose-a:no-underline hover:prose-a:underline prose-code:text-[#dc2626] prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#333]">
          <MDXRemote source={post.content} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#333]">
            <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-4">
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-3 py-1.5 text-xs border border-[#222] text-[#666] hover:border-[#444] hover:text-[#888] transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#dc2626] hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[#333] bg-[#0a0a0a]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-8">
              Related Posts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.slug} className="group">
                  <Link href={`/blog/${relatedPost.slug}`} className="block">
                    <div className="border border-[#333] bg-[#111] overflow-hidden hover:border-[#dc2626] transition-colors">
                      {/* Image Placeholder */}
                      <div className="aspect-[16/10] bg-[#1a1a1a] flex items-center justify-center relative">
                        <div className="w-14 h-14 border-2 border-[#333] group-hover:border-[#dc2626] flex items-center justify-center transition-colors">
                          <span className="text-[#666] group-hover:text-[#dc2626] font-black text-xl transition-colors">
                            {relatedPost.title.charAt(0)}
                          </span>
                        </div>
                        <span className="absolute top-3 left-3 px-2 py-1 bg-[#111] border border-[#333] text-[#888] text-[10px] font-medium uppercase tracking-wider group-hover:border-[#dc2626] group-hover:text-white transition-colors">
                          {relatedPost.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-[#666] mb-3">
                          <time dateTime={relatedPost.date}>
                            {new Date(relatedPost.date).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" },
                            )}
                          </time>
                          <span>·</span>
                          <span>{relatedPost.readTime} min</span>
                        </div>

                        <h3 className="text-lg font-bold mb-3 group-hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
                          {relatedPost.title}
                        </h3>

                        <p className="text-[#666] text-sm line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#555]">
                            {relatedPost.author}
                          </span>
                          <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-[#dc2626] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-[#333]">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#dc2626] flex items-center justify-center">
                <span className="text-white font-black text-xs">M</span>
              </div>
              <span className="text-sm font-semibold tracking-tight">
                MCP Apps
              </span>
            </Link>
            <p className="text-[10px] tracking-[0.1em] uppercase text-[#444]">
              © 2026 MCP Apps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
