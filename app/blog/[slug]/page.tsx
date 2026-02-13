import {
  getAllPosts,
  getPostBySlug,
  getAllCategories,
  getAllTags,
} from "@/lib/blog/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { format } from "date-fns";
import type { Metadata } from "next";

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

  return (
    <div className="min-h-screen bg-[#111] text-white">
      {/* Header */}
      <header className="border-b border-[#333]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              MCP Apps
            </Link>
            <span className="text-gray-600">/</span>
            <Link href="/blog" className="text-gray-400 hover:text-white">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Meta */}
        <div className="mb-8">
          {post.category && (
            <span className="text-sm font-medium text-red-500 uppercase tracking-wider">
              {post.category}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 text-gray-400 mb-12 pb-12 border-b border-[#333]">
          <span>{post.author}</span>
          <span>·</span>
          <time dateTime={post.date}>
            {format(new Date(post.date), "MMMM d, yyyy")}
          </time>
          <span>·</span>
          <span>{post.readTime} min read</span>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={post.content} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-12 border-t border-[#333]">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag}`}
                  className="px-3 py-1 text-sm border border-[#333] rounded-sm text-gray-400 hover:text-white hover:border-red-500 transition-colors"
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
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-400"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
