"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  label?: string;
  iconSize?: number;
}

export default function ShareButton({ title, text, url, className = "", label = "Share", iconSize = 16 }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
      title,
      text,
      url,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center justify-center transition-all ${className}`}
      title="Share this job"
      type="button"
    >
      {copied ? <Check size={iconSize} className="text-green-500 mr-1.5" /> : <Share2 size={iconSize} className="mr-1.5" />}
      {label && <span>{copied ? "Copied!" : label}</span>}
    </button>
  );
}
