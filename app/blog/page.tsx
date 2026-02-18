import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/blog/posts";
import { BlogGrid } from "@/components/blog/blog-card";
import { NewsletterSignup } from "@/components/blog/newsletter-signup";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog - MCP Apps",
  description:
    "Tutorials, showcases, and updates about MCP Apps and the AI ecosystem.",
};

export default async function BlogPage() {
  const [posts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
  ]);

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
            <span className="text-[#888]">Blog</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Header */}
        <header className="mb-16 pb-8 border-b border-[#333]">
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] block mb-4">
            Latest Updates
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] uppercase mb-6">
            Blog
          </h1>
          <p className="text-xl text-[#888] max-w-2xl">
            Tutorials, showcases, and insights about MCP Apps, AI tooling, and
            the future of interactive components.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-3">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  className="px-4 py-2 text-xs font-medium border border-[#dc2626] bg-[#dc2626]/10 text-[#dc2626] uppercase tracking-wider transition-colors"
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category}`}
                    className="px-4 py-2 text-xs font-medium border border-[#333] text-[#888] uppercase tracking-wider hover:border-[#dc2626] hover:text-white transition-colors capitalize"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-3">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 8).map((tag) => (
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
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <BlogGrid posts={posts} />
        ) : (
          <div className="py-24 text-center border border-[#333]">
            <div className="w-16 h-16 border-2 border-[#333] mx-auto mb-4 flex items-center justify-center">
              <span className="text-[#444] font-black text-2xl">?</span>
            </div>
            <p className="text-[#666] text-lg">
              No posts yet. Check back soon!
            </p>
          </div>
        )}

        {/* Newsletter */}
        <section className="mt-24">
          <NewsletterSignup />
        </section>
      </main>

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
