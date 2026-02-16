import { supabase } from "./client";

const BUCKET_NAME = "articles";

/**
 * Upload a blog image to the articles bucket
 * @param file - The image file to upload
 * @param postSlug - The slug of the blog post (for organizing)
 * @returns The file path in storage
 */
export async function uploadBlogImage(file: File, postSlug: string) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${postSlug}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      console.error("Error uploading blog image:", uploadError);
      return { path: null, error: uploadError };
    }

    return { path: filePath, error: null };
  } catch (err) {
    console.error("Storage error:", err);
    return { path: null, error: err };
  }
}

/**
 * Get a signed URL for a blog image
 * @param filePath - The path to the image in storage
 * @param expiresIn - How long the URL is valid (default: 1 hour)
 * @returns The signed URL
 */
export async function getBlogImageUrl(filePath: string, expiresIn = 3600) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Storage error:", err);
    return null;
  }
}

/**
 * Delete a blog image
 * @param filePath - The path to the image in storage
 */
export async function deleteBlogImage(filePath: string) {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting blog image:", error);
      return { error };
    }

    return { error: null };
  } catch (err) {
    console.error("Storage error:", err);
    return { error: err };
  }
}

/**
 * List all images for a blog post
 * @param postSlug - The slug of the blog post
 */
export async function listBlogImages(postSlug: string) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(postSlug);

    if (error) {
      console.error("Error listing blog images:", error);
      return { images: [], error };
    }

    return { images: data || [], error: null };
  } catch (err) {
    console.error("Storage error:", err);
    return { images: [], error: err };
  }
}
