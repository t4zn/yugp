"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon, ThumbsUpIcon, ThumbsDownIcon } from "./icons";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageActionsProps {
  messageContent: string;
  messageId: string;
  hasImages?: boolean;
  isStreaming?: boolean;
  isGeneratingImage?: boolean;
}

interface ImageDownloadProps {
  imageUrl: string;
  imageIndex: number;
}

export function ImageDownload({ imageUrl, imageIndex }: ImageDownloadProps) {
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}-${imageIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
      // Removed toast notification per user request
    } catch (error) {
      console.error('Failed to download image:', error);
      toast.error('Failed to download image');
    }
  };

  const handleLike = () => {
    setLiked(liked === true ? null : true);
  };

  const handleDislike = () => {
    setLiked(liked === false ? null : false);
  };

  return (
    <div className={cn(
      "flex items-center justify-start gap-1 mt-2 p-1",
      "opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200"
    )}>
      <button
        onClick={handleDownload}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Download image"
      >
        <Download size={16} />
      </button>

      <button
        onClick={handleLike}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          liked === true
            ? "text-white"
            : "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Like image"
      >
        <ThumbsUpIcon size={16} />
      </button>

      <button
        onClick={handleDislike}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          liked === false
            ? "text-white"
            : "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Dislike image"
      >
        <ThumbsDownIcon size={16} />
      </button>
    </div>
  );
}

export function MessageActions({ messageContent, hasImages, isStreaming, isGeneratingImage }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  // Don't show copy/like/dislike actions if:
  // 1. The message contains images, OR
  // 2. The message is currently being streamed/generated, OR
  // 3. The message contains "Generating image..." text
  if (hasImages || isStreaming || isGeneratingImage || messageContent.includes('Generating image')) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 5000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleLike = () => {
    setLiked(liked === true ? null : true);
  };

  const handleDislike = () => {
    setLiked(liked === false ? null : false);
  };

  return (
    <div className="flex items-center gap-1 mt-2 opacity-100 md:opacity-0 md:group-hover/message:opacity-100 transition-opacity duration-200">
      <button
        onClick={handleCopy}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Copy message"
      >
        {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
      </button>

      <button
        onClick={handleLike}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          liked === true
            ? "text-white"
            : "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Like message"
      >
        <ThumbsUpIcon size={14} />
      </button>

      <button
        onClick={handleDislike}
        className={cn(
          "p-1.5 rounded-md hover:bg-gray-100/20 active:bg-gray-100/30 transition-colors duration-200",
          liked === false
            ? "text-white"
            : "text-gray-400 hover:text-gray-300 active:text-gray-200"
        )}
        title="Dislike message"
      >
        <ThumbsDownIcon size={14} />
      </button>
    </div>
  );
}
