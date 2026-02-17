import Link from "next/link";
import { getAllPosts, getPostsByTag, getAllTags } from "@/lib/blog/posts";
import { format } from "date-fns";

// Generate static pages for all tags
export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag,
  }));
}

export const dynamicParams = true;

export function generateMetadata({ params }: { params: { tag: string } }) {
  return {
    title: `Posts tagged #${params.tag} - MCP Apps Blog`,
    description: `Browse all blog posts tagged with #${params.tag}`,
  };
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const posts = getPostsByTag(params.tag);
  const allTags = getAllTags();

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
            <span className="text-gray-600">/</span>
            <span className="text-red-500">#{params.tag}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4">
          Posts tagged <span className="text-red-500">#{params.tag}</span>
        </h1>
        <p className="text-gray-400 mb-12">
          {posts.length} {posts.length === 1 ? "post" : "posts"} found
        </p>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-[#333] pb-8 last:border-0"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold hover:text-red-500 transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>·</span>
                  <time dateTime={post.date}>
                    {format(new Date(post.date), "MMMM d, yyyy")}
                  </time>
                  <span>·</span>
                  <span>{post.readTime} min read</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400">No posts found with this tag.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-red-500 hover:text-red-400"
            >
              ← Back to Blog
            </Link>
          </div>
        )}

        {/* All Tags */}
        <div className="mt-16 pt-8 border-t border-[#333]">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            All Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className={`px-3 py-1 text-sm border rounded-sm transition-colors ${
                  tag === params.tag
                    ? "border-red-500 text-red-500"
                    : "border-[#333] text-gray-400 hover:text-white hover:border-red-500"
                }`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
