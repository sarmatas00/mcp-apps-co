import Link from "next/link";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: number;
  category: string;
  tags: string[];
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <article className="group relative">
        <Link href={`/blog/${post.slug}`} className="block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border border-[#333] bg-[#0a0a0a] overflow-hidden">
            {/* Image Placeholder */}
            <div className="aspect-[16/10] lg:aspect-auto bg-[#1a1a1a] flex items-center justify-center relative">
              <div className="w-20 h-20 border-2 border-[#dc2626] flex items-center justify-center">
                <span className="text-[#dc2626] font-black text-3xl">
                  {post.title.charAt(0)}
                </span>
              </div>
              {/* Category Badge */}
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#dc2626] text-white text-xs font-medium uppercase tracking-wider">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 text-sm text-[#666] mb-4">
                <span>{post.author}</span>
                <span>·</span>
                <time dateTime={post.date}>
                  {format(new Date(post.date), "MMM d, yyyy")}
                </time>
                <span>·</span>
                <span>{post.readTime} min read</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-[#dc2626] transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="text-[#888] text-lg mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-2 text-[#dc2626] font-medium">
                <span>Read Article</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="border border-[#333] bg-[#0a0a0a] overflow-hidden hover:border-[#dc2626] transition-colors">
          {/* Image Placeholder */}
          <div className="aspect-[16/10] bg-[#1a1a1a] flex items-center justify-center relative">
            <div className="w-14 h-14 border-2 border-[#333] group-hover:border-[#dc2626] flex items-center justify-center transition-colors">
              <span className="text-[#666] group-hover:text-[#dc2626] font-black text-xl transition-colors">
                {post.title.charAt(0)}
              </span>
            </div>
            {/* Category Badge */}
            <span className="absolute top-3 left-3 px-2 py-1 bg-[#111] border border-[#333] text-[#888] text-[10px] font-medium uppercase tracking-wider group-hover:border-[#dc2626] group-hover:text-white transition-colors">
              {post.category}
            </span>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-xs text-[#666] mb-3">
              <time dateTime={post.date}>
                {format(new Date(post.date), "MMM d")}
              </time>
              <span>·</span>
              <span>{post.readTime} min</span>
            </div>

            <h2 className="text-xl font-bold mb-3 group-hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h2>

            <p className="text-[#666] text-sm line-clamp-2 mb-4">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-[#555]">{post.author}</span>
              <ArrowUpRight className="w-4 h-4 text-[#444] group-hover:text-[#dc2626] transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

interface BlogGridProps {
  posts: BlogPost[];
}

export function BlogGrid({ posts }: BlogGridProps) {
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      {featuredPost && <BlogCard post={featuredPost} featured />}

      {/* Regular Posts Grid */}
      {remainingPosts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remainingPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
