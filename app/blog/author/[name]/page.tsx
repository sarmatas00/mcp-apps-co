import Link from "next/link";
import { notFound } from "next/navigation";
import { Twitter, Github, Globe, ArrowUpRight } from "lucide-react";
import { getAllAuthors, getAuthorBySlug } from "@/lib/blog/authors";
import { getAllPosts } from "@/lib/blog/posts";

export async function generateStaticParams() {
  const authors = getAllAuthors();
  return authors.map((author) => ({
    name: author.slug,
  }));
}

export function generateMetadata({ params }: { params: { name: string } }) {
  const author = getAuthorBySlug(params.name);

  if (!author) {
    return {
      title: "Author Not Found",
    };
  }

  return {
    title: `${author.name} - MCP Apps Blog`,
    description: author.bio,
  };
}

export default function AuthorPage({ params }: { params: { name: string } }) {
  const author = getAuthorBySlug(params.name);

  if (!author) {
    notFound();
  }

  // Get posts by this author
  const allPosts = getAllPosts();
  const authorPosts = allPosts.filter(
    (post) => post.author.toLowerCase() === author.name.toLowerCase(),
  );

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
            <span className="text-[#666]">Author</span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
        {/* Author Header */}
        <header className="mb-16 pb-12 border-b border-[#333]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#dc2626] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-4xl md:text-5xl">
                {author.name.charAt(0)}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#dc2626] block mb-2">
                Author
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.03em] mb-4">
                {author.name}
              </h1>
              <p className="text-[#888] text-lg max-w-2xl mb-6">{author.bio}</p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {author.twitter && (
                  <a
                    href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-[#333] flex items-center justify-center hover:border-[#1da1f2] hover:bg-[#1da1f2] hover:text-white transition-all"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.github && (
                  <a
                    href={`https://github.com/${author.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-[#333] flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all"
                    aria-label="GitHub"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-[#333] flex items-center justify-center hover:border-[#dc2626] hover:text-[#dc2626] transition-all"
                    aria-label="Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Posts */}
        <section>
          <h2 className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#666] mb-8">
            {authorPosts.length} {authorPosts.length === 1 ? "Post" : "Posts"}
          </h2>

          {authorPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorPosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="border border-[#333] bg-[#0a0a0a] overflow-hidden hover:border-[#dc2626] transition-colors">
                      {/* Image Placeholder */}
                      <div className="aspect-[16/10] bg-[#1a1a1a] flex items-center justify-center relative">
                        <div className="w-14 h-14 border-2 border-[#333] group-hover:border-[#dc2626] flex items-center justify-center transition-colors">
                          <span className="text-[#666] group-hover:text-[#dc2626] font-black text-xl transition-colors">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                        <span className="absolute top-3 left-3 px-2 py-1 bg-[#111] border border-[#333] text-[#888] text-[10px] font-medium uppercase tracking-wider group-hover:border-[#dc2626] group-hover:text-white transition-colors">
                          {post.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-[#666] mb-3">
                          <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                          <span>·</span>
                          <span>{post.readTime} min</span>
                        </div>

                        <h3 className="text-lg font-bold mb-3 group-hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-[#666] text-sm line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#555]">Read more</span>
                          <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-[#dc2626] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center border border-[#333]">
              <div className="w-16 h-16 border-2 border-[#333] mx-auto mb-4 flex items-center justify-center">
                <span className="text-[#444] font-black text-2xl">0</span>
              </div>
              <p className="text-[#666] text-lg">
                No posts yet from this author.
              </p>
            </div>
          )}
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
              © 2026 MCP Apps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
