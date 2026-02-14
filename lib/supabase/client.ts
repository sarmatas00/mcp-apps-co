import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { App, Category, CategoryWithCount, Review } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Helper function for server components
export async function getApps(): Promise<App[]> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select(
        `
        *,
        developer:developer_id (name, avatar_url),
        category:category_id (name, slug)
      `,
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("install_count", { ascending: false });

    if (error) {
      console.error("Error fetching apps:", error);
      return [];
    }

    return (data as App[]) || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export async function getAppBySlug(slug: string): Promise<App | null> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select(
        `
        *,
        developer:developer_id (*),
        category:category_id (name, slug)
      `,
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error("Error fetching app:", error);
      return null;
    }

    return data as App;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function getAppsByCategory(categorySlug: string): Promise<App[]> {
  try {
    // First get the category ID
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!category) return [];

    const { data, error } = await supabase
      .from("apps")
      .select(
        `
        *,
        developer:developer_id (name, avatar_url),
        category:category_id (name, slug)
      `,
      )
      .eq("is_published", true)
      .eq("category_id", category.id)
      .order("install_count", { ascending: false });

    if (error) {
      console.error("Error fetching apps by category:", error);
      return [];
    }

    return (data as App[]) || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (error) {
      console.error("Error fetching categories:", error);
      return [];
    }

    // Get app counts for each category
    const categoriesWithCounts = await Promise.all(
      (data || []).map(async (category: Category) => {
        const { count, error: countError } = await supabase
          .from("apps")
          .select("*", { count: "exact", head: true })
          .eq("category_id", category.id)
          .eq("is_published", true);

        return {
          ...category,
          count: countError ? 0 : count || 0,
        };
      }),
    );

    return categoriesWithCounts;
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data as Category;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function getRelatedApps(
  appId: string,
  categoryId: string | null,
  limit: number = 3,
): Promise<App[]> {
  if (!categoryId) return [];

  try {
    const { data, error } = await supabase
      .from("apps")
      .select(
        `
        *,
        developer:developer_id (name, avatar_url),
        category:category_id (name, slug)
      `,
      )
      .eq("is_published", true)
      .eq("category_id", categoryId)
      .neq("id", appId)
      .limit(limit);

    if (error) {
      console.error("Error fetching related apps:", error);
      return [];
    }

    return (data as App[]) || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export async function getReviewsByAppId(appId: string): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("app_id", appId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return (data as Review[]) || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}

export async function searchApps(query: string): Promise<App[]> {
  try {
    const { data, error } = await supabase
      .from("apps")
      .select(
        `
        *,
        developer:developer_id (name, avatar_url),
        category:category_id (name, slug)
      `,
      )
      .eq("is_published", true)
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%,tagline.ilike.%${query}%`,
      )
      .limit(20);

    if (error) {
      console.error("Error searching apps:", error);
      return [];
    }

    return (data as App[]) || [];
  } catch (err) {
    console.error("Supabase error:", err);
    return [];
  }
}
