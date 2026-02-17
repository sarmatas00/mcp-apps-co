import type { BlogPost } from "./static-posts";
import { staticPosts } from "./static-posts";

// Use static posts for production reliability
// This ensures blog posts work even when filesystem access fails

export type { BlogPost } from "./static-posts";

export function getAllPosts(): BlogPost[] {
  return staticPosts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  return staticPosts.find((post) => post.slug === slug) || null;
}

export function getAllCategories(): string[] {
  const categories = new Set(
    staticPosts.map((post) => post.category).filter(Boolean),
  );
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const tags = new Set(staticPosts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return staticPosts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
  return staticPosts.filter((post) => post.tags.includes(tag));
}

export function getRelatedPosts(
  currentSlug: string,
  category: string,
  tags: string[],
  limit = 3,
): BlogPost[] {
  // Score posts based on category and tag matches
  const scoredPosts = staticPosts
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
