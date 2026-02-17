export interface Author {
  name: string;
  slug: string;
  bio: string;
  avatar?: string;
  twitter?: string;
  github?: string;
  website?: string;
}

export const authors: Record<string, Author> = {
  "spyros-arm": {
    name: "Spyros Arm",
    slug: "spyros-arm",
    bio: "Software engineer building AI tools and MCP Apps. Passionate about developer experience and open source.",
    twitter: "@spyrosarm",
    github: "sarmatas00",
    website: "https://mcp-apps.co",
  },
  "mcp-apps-team": {
    name: "MCP Apps Team",
    slug: "mcp-apps-team",
    bio: "The team behind MCP Apps, curating the best interactive components for AI assistants.",
    twitter: "@mcpapps",
    github: "mcp-apps",
    website: "https://mcp-apps.co",
  },
};

export function getAuthorBySlug(slug: string): Author | null {
  return authors[slug] || null;
}

export function getAuthorByName(name: string): Author | null {
  return (
    Object.values(authors).find(
      (author) => author.name.toLowerCase() === name.toLowerCase(),
    ) || null
  );
}

export function getAllAuthors(): Author[] {
  return Object.values(authors);
}
