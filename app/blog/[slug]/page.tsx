import Link from "next/link";
import { staticPosts } from "@/lib/blog/static-posts";

// Generate static pages for all known blog posts
export async function generateStaticParams() {
  return staticPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = staticPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-8">
        <h1 className="text-2xl font-bold">Post Not Found: {params.slug}</h1>
        <p className="mt-4">
          Available slugs: {staticPosts.map((p) => p.slug).join(", ")}
        </p>
        <Link href="/blog" className="mt-4 inline-block text-blue-500">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-400 mb-8">{post.excerpt}</p>
      <div className="prose prose-invert max-w-none">
        <pre className="whitespace-pre-wrap">
          {post.content.substring(0, 500)}...
        </pre>
      </div>
      <Link href="/blog" className="mt-8 inline-block text-blue-500">
        ← Back to Blog
      </Link>
    </div>
  );
}
