"use client";

import { useState, useRef } from "react";
import { User, Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "@/lib/supabase/client";
import type { Profile } from "@/lib/supabase/types";

interface ProfileFormProps {
  userId: string;
  profile: Profile | null;
  email: string;
}

export function ProfileForm({ userId, profile, email }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    githubUsername: profile?.github_username || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = await updateProfile(userId, {
      full_name: formData.fullName,
      bio: formData.bio,
      website: formData.website,
      github_username: formData.githubUsername,
    });

    if (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully" });
    }

    setIsLoading(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "File size must be less than 2MB" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "File must be an image" });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const { error } = await uploadAvatar(userId, file);

    if (error) {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } else {
      setMessage({ type: "success", text: "Avatar updated successfully" });
      // Reload page to show new avatar
      window.location.reload();
    }

    setIsUploading(false);
  };

  const handleDeleteAvatar = async () => {
    if (!profile?.avatar_url) return;

    setIsUploading(true);
    setMessage(null);

    const { error } = await deleteAvatar(userId, profile.avatar_url);

    if (error) {
      setMessage({ type: "error", text: "Failed to delete avatar" });
    } else {
      setMessage({ type: "success", text: "Avatar deleted successfully" });
      window.location.reload();
    }

    setIsUploading(false);
  };

  return (
    <Card className="p-6 bg-[#0a0a0a] border-[#333]">
      {message && (
        <div
          className={`mb-6 p-4 border text-sm ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Avatar Section */}
      <div className="mb-8">
        <Label className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-4 block">
          Profile Picture
        </Label>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="relative w-20 h-20 rounded bg-[#1a1a1a] border border-[#333] flex items-center justify-center overflow-hidden hover:border-[#dc2626] transition-colors group"
          >
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-[#666]" />
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div>
            <p className="text-sm text-[#666] mb-2">
              Click to upload a new avatar
            </p>
            {profile?.avatar_url && (
              <button
                onClick={handleDeleteAvatar}
                disabled={isUploading}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Remove avatar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label
            htmlFor="email"
            className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 block"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-[#1a1a1a] border-[#333] text-[#666] cursor-not-allowed"
          />
          <p className="text-xs text-[#666] mt-1">Email cannot be changed</p>
        </div>

        <div>
          <Label
            htmlFor="fullName"
            className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 block"
          >
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleInputChange}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555]"
            placeholder="Your full name"
          />
        </div>

        <div>
          <Label
            htmlFor="bio"
            className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 block"
          >
            Bio
          </Label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            rows={4}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555] resize-none"
            placeholder="Tell us about yourself"
          />
        </div>

        <div>
          <Label
            htmlFor="website"
            className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 block"
          >
            Website
          </Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleInputChange}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555]"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <Label
            htmlFor="githubUsername"
            className="text-[10px] tracking-[0.15em] uppercase text-[#666] mb-2 block"
          >
            GitHub Username
          </Label>
          <Input
            id="githubUsername"
            name="githubUsername"
            type="text"
            value={formData.githubUsername}
            onChange={handleInputChange}
            className="bg-[#1a1a1a] border-[#333] text-white placeholder:text-[#555]"
            placeholder="yourusername"
          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-4 text-sm font-semibold tracking-[0.05em] uppercase transition-colors h-auto"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Card>
  );
}
