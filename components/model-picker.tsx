"use client";
import React from "react";
import Image from "next/image";
import { modelID, MODELS } from "@/ai/providers";
import { useRef, ReactNode, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Add image generation models to the existing types
type AllModelID = modelID | 'flux' | 'dalle-mini' | 'veo-3' | 'heygen';

// Combined list of all models (text, vision, image, and video)
const ALL_MODELS: AllModelID[] = [
  ...MODELS as AllModelID[],
  'dalle-mini',
  'flux',
  'veo-3',
  'heygen'
];

// Model features and icons mapping
const MODEL_FEATURES: Record<AllModelID, { name: string; feature: string; icon: React.ReactElement; type: 'text' | 'vision' | 'image' | 'video' }> = {
  "openai/gpt-oss-120b": {
    name: "GPT OSS 120B",
    feature: "Advanced reasoning, large context",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    )
  },
  "kimi-k2": {
    name: "Kimi K2",
    feature: "Large context window, multilingual",
    type: "text",
    icon: (
      <div className="w-3 h-3 bg-black rounded flex items-center justify-center">
        <span className="text-[6px] font-bold text-white">K</span>
      </div>
    )
  },
  "meta-llama/llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout",
    feature: "Latest Llama model, efficient reasoning",
    type: "vision",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11" />
      </svg>
    )
  },
  "meta-llama/llama-4-maverick-17b-128e-instruct": {
    name: "Llama 4 Maverick",
    feature: "Vision support, multimodal capabilities",
    type: "vision",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11" />
      </svg>
    )
  },
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1",
    feature: "Advanced reasoning, step-by-step thinking",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 512 509.64" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path fill="#000000" fillRule="nonzero" d="M440.898 139.167c-4.001-1.961-5.723 1.776-8.062 3.673-.801.612-1.479 1.407-2.154 2.141-5.848 6.246-12.681 10.349-21.607 9.859-13.048-.734-24.192 3.368-34.04 13.348-2.093-12.307-9.048-19.658-19.635-24.37-5.54-2.449-11.141-4.9-15.02-10.227-2.708-3.795-3.447-8.021-4.801-12.185-.861-2.509-1.725-5.082-4.618-5.512-3.139-.49-4.372 2.142-5.601 4.349-4.925 9.002-6.833 18.921-6.647 28.962.432 22.597 9.972 40.597 28.932 53.397 2.154 1.47 2.707 2.939 2.032 5.082-1.293 4.41-2.832 8.695-4.186 13.105-.862 2.817-2.157 3.429-5.172 2.205-10.402-4.346-19.391-10.778-27.332-18.553-13.481-13.044-25.668-27.434-40.873-38.702a177.614 177.614 0 00-10.834-7.409c-15.512-15.063 2.032-27.434 6.094-28.902 4.247-1.532 1.478-6.797-12.251-6.736-13.727.061-26.285 4.653-42.288 10.777-2.34.92-4.801 1.593-7.326 2.142-14.527-2.756-29.608-3.368-45.367-1.593-29.671 3.305-53.368 17.329-70.788 41.272-20.928 28.785-25.854 61.482-19.821 95.59 6.34 35.943 24.683 65.704 52.876 88.974 29.239 24.123 62.911 35.943 101.32 33.677 23.329-1.346 49.307-4.468 78.607-29.27 7.387 3.673 15.142 5.144 28.008 6.246 9.911.92 19.452-.49 26.839-2.019 11.573-2.449 10.773-13.166 6.586-15.124-33.915-15.797-26.47-9.368-33.24-14.573 17.235-20.39 43.213-41.577 53.369-110.222.8-5.448.121-8.877 0-13.287-.061-2.692.553-3.734 3.632-4.041 8.494-.981 16.742-3.305 24.314-7.471 21.975-12.002 30.84-31.719 32.933-55.355.307-3.612-.061-7.348-3.879-9.245v-.003zM249.4 351.89c-32.872-25.838-48.814-34.352-55.4-33.984-6.155.368-5.048 7.41-3.694 12.002 1.415 4.532 3.264 7.654 5.848 11.634 1.785 2.634 3.017 6.551-1.784 9.493-10.587 6.55-28.993-2.205-29.856-2.635-21.421-12.614-39.334-29.269-51.954-52.047-12.187-21.924-19.267-45.435-20.435-70.542-.308-6.061 1.478-8.207 7.509-9.307 7.94-1.471 16.127-1.778 24.068-.615 33.547 4.9 62.108 19.902 86.054 43.66 13.666 13.531 24.007 29.699 34.658 45.496 11.326 16.778 23.514 32.761 39.026 45.865 5.479 4.592 9.848 8.083 14.035 10.656-12.62 1.407-33.673 1.714-48.075-9.676zm15.899-102.519c.521-2.111 2.421-3.658 4.722-3.658a4.74 4.74 0 011.661.305c.678.246 1.293.614 1.786 1.163.861.859 1.354 2.083 1.354 3.368 0 2.695-2.154 4.837-4.862 4.837a4.748 4.748 0 01-4.738-4.034 5.01 5.01 0 01.077-1.981zm47.208 26.915c-2.606.996-5.2 1.778-7.707 1.88-4.679.244-9.787-1.654-12.556-3.981-4.308-3.612-7.386-5.631-8.679-11.941-.554-2.695-.247-6.858.246-9.246 1.108-5.144-.124-8.451-3.754-11.451-2.954-2.449-6.711-3.122-10.834-3.122-1.539 0-2.954-.673-4.001-1.224-1.724-.856-3.139-3-1.785-5.634.432-.856 2.525-2.939 3.018-3.305 5.6-3.185 12.065-2.144 18.034.244 5.54 2.266 9.727 6.429 15.759 12.307 6.155 7.102 7.263 9.063 10.773 14.39 2.771 4.163 5.294 8.451 7.018 13.348.877 2.561.071 4.74-2.341 6.277-.981.625-2.109 1.044-3.191 1.458z" />
      </svg>
    )
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    feature: "Versatile, high-quality responses",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11" />
      </svg>
    )
  },
  // Image Generation Models
  "dalle-mini": {
    name: "DALL-E",
    feature: "High quality, detailed images",
    type: "image",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>
    )
  },
  "flux": {
    name: "Flux 1.1",
    feature: "Fast generation with aesthetic quality",
    type: "image",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M3 12L9 6L15 12L21 6M3 18L9 12L15 18L21 12" 
          stroke="#000000" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="6" cy="9" r="1.5" fill="#000000" />
        <circle cx="12" cy="15" r="1.5" fill="#000000" />
        <circle cx="18" cy="9" r="1.5" fill="#000000" />
      </svg>
    )
  },
  // Video Generation Models
  "veo-3": {
    name: "VEO 3",
    feature: "Advanced video generation with realistic motion",
    type: "video",
    icon: (
      // Use Google Gemini brand SVG for Veo 3 as requested
      <Image
        src="https://cdn.jsdelivr.net/npm/simple-icons/icons/googlegemini.svg"
        alt="Gemini"
        width={12}
        height={12}
        className="w-3 h-3 object-contain"
        loading="lazy"
      />
    )
  },
  "heygen": {
    name: "Heygen",
    feature: "AI avatar and personalized video creation",
    type: "video",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Avatar head */}
        <circle cx="12" cy="8" r="3" fill="#000000" />
        {/* Video camera body */}
        <rect x="6" y="12" width="8" height="5" rx="1" fill="#000000" />
        {/* Camera lens */}
        <circle cx="10" cy="14.5" r="1.5" fill="white" />
        <circle cx="10" cy="14.5" r="0.8" fill="#000000" />
        {/* Recording indicator */}
        <circle cx="16" cy="13" r="1" fill="#ff4444" />
        {/* Speech lines */}
        <path d="M15 8.5L17 7.5M15 9.5L18 8.5M15 10.5L17 9.5" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        {/* Tripod legs */}
        <path d="M8 17L6 20M12 17V20M16 17L18 20" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  }
};

interface ModelPickerProps {
  selectedModel: AllModelID;
  setSelectedModel: (model: AllModelID) => void;
  onImageUpload?: (imageData: string, fileName: string) => void;
  uploadedImage?: { data: string; name: string } | null;
  onShowVisionError?: () => void;
}

// Email notification popup component
const ImageModelPopup = ({
  isOpen,
  onClose,
  onAccessGranted
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccessGranted: () => void;
}) => {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);

    // Check if code is valid
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      if (code.trim() === 'csc12') {
        setIsValidCode(true);
        // Auto close after showing success and grant access
        setTimeout(() => {
          setIsSubmitted(false);
          setCode('');
          setIsValidCode(false);
          onAccessGranted(); // Grant access instead of just closing
        }, 2000);
      } else {
        setIsValidCode(false);
        // Auto reset after showing error
        setTimeout(() => {
          setIsSubmitted(false);
          setCode('');
        }, 2000);
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white/85 backdrop-blur-xl rounded-lg p-4 w-[85%] max-w-xs mx-4 shadow-lg border border-white/25 relative"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.90) 100%)',
          backdropFilter: 'blur(12px) saturate(120%)',
          WebkitBackdropFilter: 'blur(12px) saturate(120%)',
          boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100/50 rounded-full transition-colors"
          disabled={isSubmitting}
        >
          <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 pr-6 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 70 L25 30 L40 50 L50 20 L60 50 L75 30 L90 70 Z" />
                <rect x="5" y="70" width="90" height="15" />
              </svg>
              Premium Feature
            </h3>
            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
              Image and video generation require premium access. Subscribe to premium or enter your access code to unlock these providers.
            </p>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Need an access code? Contact{' '}
              <a
                href="mailto:taizun8@gmail.com?subject=Premium Access Code Request"
                className="font-bold text-black hover:underline cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=taizun8@gmail.com&su=Premium%20Access%20Code%20Request', '_blank');
                }}
              >
                taizun8@gmail.com
              </a>
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Enter access code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !code.trim()}
                  className="px-4 py-1.5 bg-black text-white text-xs rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">
            {isValidCode ? (
              <>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Access Granted!</h3>
                <p className="text-xs text-gray-600">
                  You now have access to image providers.
                </p>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Invalid Code</h3>
                <p className="text-xs text-gray-600">
                  Please subscribe to premium for access.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
  onImageUpload,
  uploadedImage,
  onShowVisionError,
}: ModelPickerProps) => {
  const [showImageModelPopup, setShowImageModelPopup] = useState(false);
  const [hasImageAccess, setHasImageAccess] = useState(false);
  // Single title component that changes alignment based on screen size
  const SectionTitle = ({ children }: { children: ReactNode }) => (
    <div className="w-full px-1 py-0.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide border-b border-gray-200/50 mb-1 text-left sm:text-center">
      {children}
    </div>
  );
  const selectedModelInfo = MODEL_FEATURES[selectedModel];
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle model selection with image model restriction
  const handleModelChange = (newModel: AllModelID) => {
    const isImageModel = imageModels.includes(newModel);
    const isVideoModel = videoModels.includes(newModel);

    if ((isImageModel || isVideoModel) && !hasImageAccess) {
      // Show popup only if user doesn't have access
      setShowImageModelPopup(true);
      return;
    }

    setSelectedModel(newModel);
  };

  // Handle popup close
  const handlePopupClose = () => {
    setShowImageModelPopup(false);
  };

  // Handle successful access code verification
  const handleAccessGranted = () => {
    setHasImageAccess(true);
    setShowImageModelPopup(false);
  };

  // Separate models by type
  const textModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'text');
  const visionModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'vision');
  const imageModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'image');
  const videoModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'video');

  const isVisionModel = visionModels.includes(selectedModel);

  const handleFileUpload = () => {
    if (!isVisionModel) {
      onShowVisionError?.();
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        showMessage('Please select a valid image file', 'error');
        return;
      }

      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        showMessage('Image file size must be less than 10MB', 'error');
        return;
      }

      console.log('Image selected:', file.name, 'Size:', Math.round(file.size / 1024) + 'KB');

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        onImageUpload?.(base64String, file.name);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      reader.onerror = () => {
        showMessage('Error reading the image file', 'error');
      };

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error processing file:', error);
      showMessage('Error processing the selected file', 'error');
    }
  };

  const showMessage = (text: string, type: 'success' | 'error') => {
    try {
      const existingMessages = document.querySelectorAll('.upload-message');
      existingMessages.forEach(msg => msg.remove());

      const message = document.createElement('div');
      message.className = `upload-message fixed top-4 right-4 px-3 py-2 rounded-lg text-sm font-medium z-50 shadow-lg transition-all duration-300 ${type === 'error'
        ? 'bg-red-100 border border-red-300 text-red-700'
        : 'bg-green-100 border border-green-300 text-green-700'
        }`;
      message.textContent = text;

      document.body.appendChild(message);

      setTimeout(() => {
        if (message.parentNode) {
          message.style.opacity = '0';
          message.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            if (message.parentNode) {
              message.parentNode.removeChild(message);
            }
          }, 300);
        }
      }, 3000);

    } catch (error) {
      console.error('Error showing message:', error);
    }
  };

  return (
    <div className="absolute bottom-2 left-2 flex items-center gap-2 model-picker model-picker-select">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          left: '-9999px',
          opacity: 0,
          pointerEvents: 'none',
          width: '1px',
          height: '1px'
        }}
      />

      {/* File Upload Pin Icon */}
      <div className="relative">
        <button
          onClick={handleFileUpload}
          className={`icon-btn p-1 sm:p-1.5 rounded-full transition-all duration-200 touch-manipulation select-none ${isVisionModel
            ? uploadedImage
              ? 'bg-green-100 hover:bg-green-200 text-green-700 cursor-pointer'
              : 'hover:bg-gray-100 text-black cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
            }`}
          style={{
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'manipulation'
          }}
          title={isVisionModel
            ? uploadedImage
              ? `Image uploaded: ${uploadedImage.name}. Click to change.`
              : 'Upload image'
            : 'Select a vision model to upload images'
          }
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {uploadedImage && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
        )}
      </div>

      <Select value={selectedModel} onValueChange={handleModelChange}>
        <SelectTrigger className="min-w-[100px] sm:min-w-[140px] h-6 sm:h-8 text-xs">
          <SelectValue placeholder="Select a model">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {selectedModelInfo?.icon}
              <span className="font-bold text-[9px] sm:text-[11px] truncate max-w-[60px] sm:max-w-none">{selectedModelInfo?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="w-[280px] sm:w-[480px] max-h-[300px] backdrop-blur-md bg-white/80 border border-white/20 overflow-visible">
          <div className="w-full p-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Text Models Section */}
            <div className="space-y-1">
              <SectionTitle>Text Models</SectionTitle>
              {textModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 cursor-pointer hover:bg-gray-50/50">
                    <div className="flex items-start gap-1.5 w-full">
                      <div className="mt-0.5 flex-shrink-0">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <span className="font-medium text-[9px] truncate">{modelInfo.name}</span>
                        <span className="text-[8px] text-muted-foreground leading-tight line-clamp-1">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </div>

            {/* Vision Models Section */}
            <div className="space-y-1">
              <SectionTitle>Vision & Image</SectionTitle>
              {/* Vision Models */}
              {visionModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 cursor-pointer hover:bg-gray-50/50">
                    <div className="flex items-start gap-1.5 w-full">
                      <div className="mt-0.5 flex-shrink-0">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-[9px] truncate">{modelInfo.name}</span>
                          <span className="text-[6px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full font-medium flex-shrink-0">
                            VISION
                          </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground leading-tight line-clamp-1">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}

              {/* Image Generation Models */}
              {imageModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 cursor-pointer hover:bg-gray-50/50">
                    <div className="flex items-start gap-1.5 w-full">
                      <div className="mt-0.5 flex-shrink-0">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-[9px] truncate">{modelInfo.name}</span>
                          {/* Yellow Crown Icon */}
                          <svg className="w-2.5 h-2.5 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6L9 9L5 8L7 12L4 16H20L17 12L19 8L15 9L12 6Z" />
                            <path d="M6 16H18V18C18 19.1 17.1 20 16 20H8C6.9 20 6 19.1 6 18V16Z" />
                            <circle cx="12" cy="8" r="1" />
                            <circle cx="9" cy="10" r="0.5" />
                            <circle cx="15" cy="10" r="0.5" />
                          </svg>
                          <span className="text-[6px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full font-medium flex-shrink-0">
                            IMAGE
                          </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground leading-tight line-clamp-1">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}

              {/* Video Generation Models */}
              {videoModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 cursor-pointer hover:bg-gray-50/50">
                    <div className="flex items-start gap-1.5 w-full">
                      <div className="mt-0.5 flex-shrink-0">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0 min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-[9px] truncate">{modelInfo.name}</span>
                          {/* Yellow Crown Icon */}
                          <svg className="w-2.5 h-2.5 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6L9 9L5 8L7 12L4 16H20L17 12L19 8L15 9L12 6Z" />
                            <path d="M6 16H18V18C18 19.1 17.1 20 16 20H8C6.9 20 6 19.1 6 18V16Z" />
                            <circle cx="12" cy="8" r="1" />
                            <circle cx="9" cy="10" r="0.5" />
                            <circle cx="15" cy="10" r="0.5" />
                          </svg>
                          <span className="text-[6px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full font-medium flex-shrink-0">
                            VIDEO
                          </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground leading-tight line-clamp-1">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </div>
          </div>
        </SelectContent>
      </Select>

      {/* Image Model Restriction Popup */}
      <ImageModelPopup
        isOpen={showImageModelPopup}
        onClose={handlePopupClose}
        onAccessGranted={handleAccessGranted}
      />
    </div>
  );
};
