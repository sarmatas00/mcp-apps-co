export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      apps: {
        Row: {
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
          config_template_claude: Json | null;
          config_template_chatgpt: Json | null;
          config_template_vscode: Json | null;
          config_template_goose: Json | null;
          is_featured: boolean;
          is_verified: boolean;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          color: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      developers: {
        Row: {
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
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
      reviews: {
        Row: {
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
        };
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
  };
};
