import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog/posts';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - MCP Apps',
  description: 'Tutorials, showcases, and updates about MCP Apps and the AI ecosystem.',
};

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

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
            <span className="text-white">Blog</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Page Title */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Tutorials, showcases, and updates about MCP Apps and the AI ecosystem.
          </p>
          <div className="mt-8 h-px bg-[#333] w-full" />
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-4 py-2 text-sm border border-red-500 bg-red-500/10 text-red-500 rounded-sm"
              >
                All
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category}`}
                  className="px-4 py-2 text-sm border border-[#333] rounded-sm text-gray-400 hover:text-white hover:border-red-500 transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-0">
          {posts.map((post, index) => (
            <article
              key={post.slug}
              className="group border-b border-[#333] py-8 first:pt-0"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    {/* Category */}
                    {post.category && (
                      <span className="text-sm font-medium text-red-500 uppercase tracking-wider mb-2 block">
                        {post.category}
                      </span>
                    )}
                    
                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-red-500 transition-colors">
                      {post.title}
                    </h2>
                    
                    {/* Excerpt */}
                    <p className="text-gray-400 text-lg mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{post.author}</span>
                      <span>·</span>
                      <time dateTime={post.date}>
                        {format(new Date(post.date), 'MMM d, yyyy')}
                      </time>
                      <span>·</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <div className="hidden md:flex items-center">
                    <span className="text-2xl text-gray-600 group-hover:text-red-500 group-hover:translate-x-1 transition-all">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-400 text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
