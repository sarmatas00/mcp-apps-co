"use client";

import { useState, useEffect } from "react";
import { getBlogImageUrl } from "@/lib/supabase/blog-storage";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * BlogImage component that handles signed URLs for images stored in Supabase
 *
 * Usage:
 * - For external URLs: <BlogImage src="https://example.com/image.jpg" alt="..." />
 * - For Supabase storage: <BlogImage src="storage:articles/post-slug/image.jpg" alt="..." />
 */
export function BlogImage({ src, alt, className = "" }: BlogImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      // Check if this is a Supabase storage path
      if (src.startsWith("storage:")) {
        const storagePath = src.replace("storage:", "");
        const signedUrl = await getBlogImageUrl(storagePath);
        if (signedUrl) {
          setImageUrl(signedUrl);
        } else {
          setError(true);
        }
      } else {
        // Regular URL
        setImageUrl(src);
      }
      setLoading(false);
    }

    loadImage();
  }, [src]);

  if (loading) {
    return (
      <div
        className={`bg-[#1a1a1a] animate-pulse ${className}`}
        style={{ aspectRatio: "16/9" }}
      />
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        className={`bg-[#1a1a1a] flex items-center justify-center text-[#666] text-sm ${className}`}
        style={{ aspectRatio: "16/9" }}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`w-full h-auto ${className}`}
      loading="lazy"
    />
  );
}
