import { createClient } from "@supabase/supabase-js";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  readTime: number;
  metaTitle?: string;
  metaDescription?: string;
}

interface DbBlogPost {
  slug: string;
  title: string;
  published_at: string | null;
  created_at: string;
  author_name: string | null;
  excerpt: string | null;
  content?: string;
  tags: string[] | null;
  category: string | null;
  read_time: number | null;
  meta_title?: string | null;
  meta_description?: string | null;
}

// Public Supabase client (no cookies) so ISR caching works
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

function mapDbPost(db: DbBlogPost): BlogPost {
  return {
    slug: db.slug,
    title: db.title,
    date: (db.published_at || db.created_at).split("T")[0],
    author: db.author_name || "MCP Apps Team",
    excerpt: db.excerpt || "",
    content: db.content || "",
    tags: db.tags || [],
    category: db.category || "general",
    readTime: db.read_time || 5,
    metaTitle: db.meta_title || undefined,
    metaDescription: db.meta_description || undefined,
  };
}

const POST_FIELDS =
  "slug, title, published_at, created_at, author_name, excerpt, content, tags, category, read_time, meta_title, meta_description";

const LIST_FIELDS =
  "slug, title, published_at, created_at, author_name, excerpt, tags, category, read_time";

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select(LIST_FIELDS)
    .eq("is_published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data || []).map((d) => mapDbPost(d));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select(POST_FIELDS)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data ? mapDbPost(data) : null;
}

export async function getAllCategories(): Promise<string[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("is_published", true)
    .not("category", "is", null);
  const categories = new Set(
    (data || []).map((d: { category: string }) => d.category).filter(Boolean),
  );
  return Array.from(categories);
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export async function getPostsByCategory(
  category: string,
): Promise<BlogPost[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select(LIST_FIELDS)
    .eq("is_published", true)
    .ilike("category", category)
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data || []).map((d) => mapDbPost(d));
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select(LIST_FIELDS)
    .eq("is_published", true)
    .contains("tags", [tag])
    .order("published_at", { ascending: false, nullsFirst: false });
  return (data || []).map((d) => mapDbPost(d));
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("is_published", true);
  return (data || []).map((d: { slug: string }) => d.slug);
}

export async function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3,
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  const scoredPosts = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      if (post.category === category) score += 2;
      const matchingTags = post.tags.filter((t) => tags.includes(t));
      score += matchingTags.length;
      return { post, score };
    });

  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  return scoredPosts.slice(0, limit).map((sp) => sp.post);
}
