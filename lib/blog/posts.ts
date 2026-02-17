import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

// Try multiple possible paths for content directory
function getPostsDirectory(): string {
  const possiblePaths = [
    path.join(process.cwd(), "content/blog"),
    path.join(process.cwd(), "..", "content/blog"),
    path.join(__dirname, "../../../content/blog"),
    "/var/task/content/blog", // Vercel serverless
  ];

  for (const dir of possiblePaths) {
    if (fs.existsSync(dir)) {
      return dir;
    }
  }

  // Default fallback
  return path.join(process.cwd(), "content/blog");
}

const postsDirectory = getPostsDirectory();

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
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export function getAllPosts(): BlogPost[] {
  // Ensure directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      // Remove .mdx extension
      const slug = fileName.replace(/\.mdx$/, "");

      // Read file content
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Parse frontmatter
      const { data, content } = matter(fileContents);

      // Calculate reading time
      const stats = readingTime(content);

      return {
        slug: data.slug || slug,
        title: data.title,
        date: data.date,
        author: data.author,
        excerpt: data.excerpt,
        content,
        tags: data.tags || [],
        category: data.category,
        readTime: data.readTime || Math.ceil(stats.minutes),
        coverImage: data.coverImage,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      };
    })
    // Sort by date descending
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // Try to find file by slug in frontmatter or filename
    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === slug);

    if (post) {
      return post;
    }

    // Fallback: try direct file read
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    return {
      slug: data.slug || slug,
      title: data.title,
      date: data.date,
      author: data.author,
      excerpt: data.excerpt,
      content,
      tags: data.tags || [],
      category: data.category,
      readTime: data.readTime || Math.ceil(stats.minutes),
      coverImage: data.coverImage,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(
    posts.map((post) => post.category).filter(Boolean),
  );
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3,
): BlogPost[] {
  const posts = getAllPosts();

  // Score posts based on category and tag matches
  const scoredPosts = posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;

      // Category match is worth 2 points
      if (post.category === category) {
        score += 2;
      }

      // Each tag match is worth 1 point
      const matchingTags = post.tags.filter((tag) => tags.includes(tag));
      score += matchingTags.length;

      return { post, score };
    });

  // Sort by score (descending), then by date (newest first)
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
  });

  // Return top posts
  return scoredPosts.slice(0, limit).map((sp) => sp.post);
}
