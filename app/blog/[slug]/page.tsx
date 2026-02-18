import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { staticPosts } from "@/lib/blog/static-posts";
import { getRelatedPosts } from "@/lib/blog/posts";
import { getAuthorByName } from "@/lib/blog/authors";
import { CommentsSection } from "@/components/blog/comments";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";
import { BlogCard } from "@/components/blog/blog-card";

export async function generateStaticParams() {
  return staticPosts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = staticPosts.find((p) => p.slug === slug);

  if (!post) {
    return { title: "Post Not Found - MCP Apps" };
  }

  return {
    title: post.metaTitle || `${post.title} - MCP Apps Blog`,
    description: post.metaDescription || post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = staticPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#111] text-white">
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
              <Link
                href="/blog"
                className="text-[#888] hover:text-white transition-colors"
              >
                Blog
              </Link>
            </div>
          </div>
        </nav>
        <div className="mx-auto max-w-3xl px-6 sm:px-8 py-24 text-center">
          <h1 className="text-4xl font-black tracking-tight uppercase mb-4">
            Post Not Found
          </h1>
          <p className="text-[#888] mb-8">
            The article you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-6 py-3 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const author = getAuthorByName(post.author);
  const relatedPosts = getRelatedPosts(post.slug, post.category, post.tags);

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
            <Link
              href="/blog"
              className="text-[#888] hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 sm:px-8 py-16 sm:py-24">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#666] hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Blog</span>
        </Link>

        {/* Category */}
        <Link
          href={`/blog/category/${post.category}`}
          className="inline-block px-3 py-1 bg-[#dc2626]/10 border border-[#dc2626]/30 text-[#dc2626] text-xs font-medium uppercase tracking-wider mb-6 hover:bg-[#dc2626]/20 transition-colors"
        >
          {post.category}
        </Link>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] leading-[1.1] mb-8">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#666] mb-12 pb-12 border-b border-[#333]">
          {author ? (
            <Link
              href={`/blog/author/${author.slug}`}
              className="hover:text-white transition-colors"
            >
              {author.name}
            </Link>
          ) : (
            <span>{post.author}</span>
          )}
          <span className="text-[#333]">&middot;</span>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.date}>
              {format(new Date(post.date), "MMM d, yyyy")}
            </time>
          </div>
          <span className="text-[#333]">&middot;</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{post.readTime} min read</span>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
          prose-headings:font-bold prose-headings:tracking-tight
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[#ccc] prose-p:leading-relaxed
          prose-a:text-[#dc2626] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-[#dc2626] prose-code:bg-[#1a1a1a] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm
          prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#333]
          prose-blockquote:border-[#dc2626] prose-blockquote:text-[#888]
          prose-li:text-[#ccc]
          prose-hr:border-[#333]
          prose-th:text-white prose-th:border-[#333]
          prose-td:text-[#ccc] prose-td:border-[#333]
          prose-img:border prose-img:border-[#333]"
        >
          <MDXRemote
            source={post.content}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeHighlight],
              },
            }}
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#333]">
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

        {/* Author Box */}
        {author && (
          <div className="mt-12 p-6 border border-[#333] bg-[#0a0a0a]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {author.name.charAt(0)}
                </span>
              </div>
              <div>
                <Link
                  href={`/blog/author/${author.slug}`}
                  className="font-semibold text-white hover:text-[#dc2626] transition-colors"
                >
                  {author.name}
                </Link>
                <p className="text-[#888] text-sm mt-1">{author.bio}</p>
                {(author.twitter || author.github) && (
                  <div className="flex items-center gap-4 mt-3">
                    {author.twitter && (
                      <span className="text-xs text-[#666]">
                        {author.twitter}
                      </span>
                    )}
                    {author.github && (
                      <span className="text-xs text-[#666]">
                        github.com/{author.github}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentsSection postSlug={slug} />

        {/* Newsletter */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-[#333]">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
            <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
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
              &copy; 2026 MCP Apps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
