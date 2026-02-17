"use client";

import { useState } from "react";
import { Twitter, Linkedin, Facebook, Link2, Check } from "lucide-react";

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://mcp-apps.co${url}`;

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
      color: "hover:bg-[#1da1f2] hover:border-[#1da1f2]",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-[#0a66c2] hover:border-[#0a66c2]",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      color: "hover:bg-[#1877f2] hover:border-[#1877f2]",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-10 h-10 border border-[#333] flex items-center justify-center transition-all ${link.color} hover:text-white`}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}

      <button
        onClick={copyToClipboard}
        className={`w-10 h-10 border flex items-center justify-center transition-all ${
          copied
            ? "border-green-500 text-green-500"
            : "border-[#333] hover:border-[#dc2626] hover:text-[#dc2626]"
        }`}
        aria-label="Copy link"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
