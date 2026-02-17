import Link from "next/link";
import { staticPosts } from "@/lib/blog/static-posts";

// Generate static pages for all known blog posts at build time
export async function generateStaticParams() {
  const slugs = staticPosts.map((post) => ({
    slug: post.slug,
  }));
  console.log("Generating static params for slugs:", slugs);
  return slugs;
}

// Allow dynamic rendering for paths not generated at build time
export const dynamicParams = true;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = staticPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#111] text-white p-8">
        <h1 className="text-2xl font-bold">Post Not Found</h1>
        <p className="mt-4 text-gray-400">Slug received: {slug}</p>
        <p className="mt-2 text-gray-400">
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
