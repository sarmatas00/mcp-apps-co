import Link from "next/link";
import {
  getPostsByCategory,
  getAllCategories,
} from "@/lib/blog/posts";
import { format } from "date-fns";

// Generate static pages for all categories
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category,
  }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return {
    title: `${category} - MCP Apps Blog`,
    description: `Browse all blog posts in ${category}`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const posts = getPostsByCategory(category);
  const allCategories = getAllCategories();

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
            <span className="text-red-500 capitalize">{category}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 capitalize">
          {category}
        </h1>
        <p className="text-gray-400 mb-12">
          {posts.length} {posts.length === 1 ? "post" : "posts"} in this
          category
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
            <p className="text-gray-400">No posts found in this category.</p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-red-500 hover:text-red-400"
            >
              ← Back to Blog
            </Link>
          </div>
        )}

        {/* All Categories */}
        <div className="mt-16 pt-8 border-t border-[#333]">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
            All Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/category/${cat}`}
                className={`px-3 py-1 text-sm border rounded-sm transition-colors capitalize ${
                  cat === category
                    ? "border-red-500 text-red-500"
                    : "border-[#333] text-gray-400 hover:text-white hover:border-red-500"
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
