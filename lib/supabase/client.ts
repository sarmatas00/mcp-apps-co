import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type {
  App,
  Category,
  CategoryWithCount,
  Review,
  Profile,
  OAuthProvider,
} from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// ==================== AUTH FUNCTIONS (v1.1.0) ====================

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
}

export async function signInWithOAuth(provider: OAuthProvider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { data, error };
}

// ==================== PROFILE FUNCTIONS (v1.1.0) ====================

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as Profile;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }

    return { data: data as Profile, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

export async function uploadAvatar(userId: string, file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/avatar.${fileExt}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading avatar:", uploadError);
      return { data: null, error: uploadError };
    }

    // Update profile with avatar path
    const { data, error: updateError } = await updateProfile(userId, {
      avatar_url: filePath,
    });

    if (updateError) {
      return { data: null, error: updateError };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Supabase error:", err);
    return { data: null, error: err };
  }
}

export async function getAvatarUrl(filePath: string) {
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Supabase error:", err);
    return null;
  }
}

export async function deleteAvatar(userId: string, filePath: string) {
  try {
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from("avatars")
      .remove([filePath]);

    if (deleteError) {
      console.error("Error deleting avatar:", deleteError);
      return { error: deleteError };
    }

    // Update profile to remove avatar_url
    const { error: updateError } = await updateProfile(userId, {
      avatar_url: null,
    });

    return { error: updateError };
  } catch (err) {
    console.error("Supabase error:", err);
    return { error: err };
  }
}

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
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (!categoryData) return [];
    const category = categoryData as { id: string };

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
