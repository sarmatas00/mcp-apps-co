import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BLOG_DIR = join(import.meta.dirname, "../../content/blog");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { metadata: {}, body: content };

  const frontmatter = match[1];
  const body = match[2].trim();
  const metadata = {};

  for (const line of frontmatter.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith("[")) {
      try {
        metadata[key] = JSON.parse(value);
      } catch {
        metadata[key] = value;
      }
    } else {
      metadata[key] = value;
    }
  }

  return { metadata, body };
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadTime(content) {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractExcerpt(body) {
  // Get first paragraph after any heading
  const lines = body.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  const firstPara = lines.slice(0, 3).join(" ").trim();
  return firstPara.length > 200 ? firstPara.slice(0, 197) + "..." : firstPara;
}

function extractTitle(body) {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "Untitled";
}

async function seedPosts() {
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md")).sort();
  console.log(`Found ${files.length} markdown files in ${BLOG_DIR}`);

  for (const file of files) {
    const raw = readFileSync(join(BLOG_DIR, file), "utf-8");
    const { metadata, body } = parseFrontmatter(raw);

    const title = metadata.title || extractTitle(body);
    const slug = metadata.slug || slugify(title);
    const date = metadata.date || file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || "2026-01-01";
    const author = metadata.author || "MCP Apps Team";
    const excerpt = metadata.excerpt || extractExcerpt(body);
    const category = metadata.category || "general";
    const readTime = estimateReadTime(body);

    let tags = metadata.tags || [];
    if (typeof tags === "string") {
      tags = tags.split(",").map((t) => t.trim());
    }

    // Check if post already exists
    const { data: existing } = await supabase
      .from("blog_posts")
      .select("slug")
      .eq("slug", slug)
      .single();

    if (existing) {
      console.log(`  SKIP: ${slug} (already exists)`);
      continue;
    }

    const { error } = await supabase.from("blog_posts").insert({
      slug,
      title,
      excerpt,
      content: body,
      author_name: author,
      tags,
      category,
      read_time: readTime,
      is_published: true,
      published_at: new Date(date).toISOString(),
    });

    if (error) {
      console.error(`  ERROR: ${slug}: ${error.message}`);
    } else {
      console.log(`  OK: ${slug}`);
    }
  }

  // Verify
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, title, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  console.log(`\nTotal published posts: ${data?.length || 0}`);
  data?.forEach((p) => console.log(`  - ${p.published_at?.split("T")[0]} ${p.slug}`));
}

seedPosts().catch(console.error);
