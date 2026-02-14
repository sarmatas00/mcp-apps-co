// Strict TypeScript types for Supabase data

export interface Developer {
  id: string;
  name: string;
  email: string;
  github_username: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  twitter: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
}

export interface App {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  long_description: string | null;
  screenshot_urls: string[] | null;
  demo_video_url: string | null;
  github_url: string | null;
  npm_package: string | null;
  category_id: string | null;
  tags: string[] | null;
  compatibility_claude: boolean;
  compatibility_chatgpt: boolean;
  compatibility_vscode: boolean;
  compatibility_goose: boolean;
  rating: number;
  review_count: number;
  install_count: number;
  view_count: number;
  developer_id: string | null;
  config_template_claude: Record<string, unknown> | null;
  config_template_chatgpt: Record<string, unknown> | null;
  config_template_vscode: Record<string, unknown> | null;
  config_template_goose: Record<string, unknown> | null;
  is_featured: boolean;
  is_verified: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields
  developer?: Developer;
  category?: Category;
}

export interface Review {
  id: string;
  app_id: string;
  user_id: string | null;
  rating: number;
  comment: string | null;
  client_used: string | null;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithCount extends Category {
  count: number;
}

// For AppCard component
export interface AppCardData {
  id: string;
  name: string;
  description: string;
  screenshotUrl: string;
  category: string;
  rating: number;
  installCount: number;
  author: {
    name: string;
    avatarUrl?: string;
  };
  compatibility: {
    claude: boolean;
    chatgpt: boolean;
    vscode: boolean;
    goose: boolean;
  };
  slug: string;
}
