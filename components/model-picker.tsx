"use client";
import { modelID, MODELS } from "@/ai/providers";
import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Add image generation models to the existing types
type AllModelID = modelID | 'flux' | 'dalle-mini';

// Combined list of all models (text, vision, and image)
const ALL_MODELS: AllModelID[] = [
  ...MODELS as AllModelID[],
  'dalle-mini',
  'flux'
];

// Model features and icons mapping
const MODEL_FEATURES: Record<AllModelID, { name: string; feature: string; icon: React.ReactElement; type: 'text' | 'vision' | 'image' }> = {
  "openai/gpt-oss-120b": {
    name: "GPT OSS 120B",
    feature: "Advanced reasoning, large context",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
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
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11"/>
      </svg>
    )
  },
  "meta-llama/llama-4-maverick-17b-128e-instruct": {
    name: "Llama 4 Maverick",
    feature: "Vision support, multimodal capabilities",
    type: "vision",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11"/>
      </svg>
    )
  },
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1",
    feature: "Advanced reasoning, step-by-step thinking",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7V17L12 22L22 17V7L12 2ZM12 4.15L19.55 8L12 11.85L4.45 8L12 4.15ZM4 9.43L11 13.14V19.57L4 15.86V9.43ZM13 19.57V13.14L20 9.43V15.86L13 19.57Z"/>
      </svg>
    )
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    feature: "Versatile, high-quality responses",
    type: "text",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 32 32" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M5,19.5c0-4.6,2.3-9.4,5-9.4c1.5,0,2.7,0.9,4.6,3.6c-1.8,2.8-2.9,4.5-2.9,4.5c-2.4,3.8-3.2,4.6-4.5,4.6  C5.9,22.9,5,21.7,5,19.5 M20.7,17.8L19,15c-0.4-0.7-0.9-1.4-1.3-2c1.5-2.3,2.7-3.5,4.2-3.5c3,0,5.4,4.5,5.4,10.1  c0,2.1-0.7,3.3-2.1,3.3S23.3,22,20.7,17.8 M16.4,11c-2.2-2.9-4.1-4-6.3-4C5.5,7,2,13.1,2,19.5c0,4,1.9,6.5,5.1,6.5  c2.3,0,3.9-1.1,6.9-6.3c0,0,1.2-2.2,2.1-3.7c0.3,0.5,0.6,1,0.9,1.6l1.4,2.4c2.7,4.6,4.2,6.1,6.9,6.1c3.1,0,4.8-2.6,4.8-6.7  C30,12.6,26.4,7,22.1,7C19.8,7,18,8.8,16.4,11"/>
      </svg>
    )
  },
  // Image Generation Models
  "dalle-mini": {
    name: "Stable Diffusion XL",
    feature: "High quality, detailed images",
    type: "image",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    )
  },
  "flux": {
    name: "Playground v2.5",
    feature: "Fast generation with aesthetic quality",
    type: "image",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 3v6h8l-1 1l-6.5 10l-1.5-1V13H4l1-1L11.5 2L13 3z"/>
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

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
  onImageUpload,
  uploadedImage,
  onShowVisionError,
}: ModelPickerProps) => {
  const selectedModelInfo = MODEL_FEATURES[selectedModel];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Separate models by type
  const textModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'text');
  const visionModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'vision');
  const imageModels = ALL_MODELS.filter(modelId => MODEL_FEATURES[modelId].type === 'image');
  
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
      message.className = `upload-message fixed top-4 right-4 px-3 py-2 rounded-lg text-sm font-medium z-50 shadow-lg transition-all duration-300 ${
        type === 'error' 
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
    <div className="absolute bottom-2 left-2 flex items-center gap-2 model-picker">
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
          className={`p-1 sm:p-1.5 rounded-full transition-all duration-200 touch-manipulation select-none ${
            isVisionModel 
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
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {uploadedImage && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
        )}
      </div>
      
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="min-w-[100px] sm:min-w-[140px] h-6 sm:h-8 text-xs">
          <SelectValue placeholder="Select a model">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {selectedModelInfo?.icon}
              <span className="font-bold text-[8px] sm:text-[10px] truncate max-w-[60px] sm:max-w-none">{selectedModelInfo?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[180px] sm:min-w-[200px] backdrop-blur-md bg-white/80 border border-white/20">
          {/* Text Models Section */}
          <SelectGroup>
            <div className="px-2 py-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
              Text Models
            </div>
            {textModels.map((modelId) => {
              const modelInfo = MODEL_FEATURES[modelId];
              return (
                <SelectItem key={modelId} value={modelId} className="py-1 sm:py-1.5">
                  <div className="flex items-start gap-1 sm:gap-1.5">
                    <div className="mt-0.5">{modelInfo.icon}</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[9px] sm:text-[10px]">{modelInfo.name}</span>
                      <span className="text-[7px] sm:text-[8px] text-muted-foreground leading-tight">
                        {modelInfo.feature}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
          
          {/* Vision Models Section */}
          {visionModels.length > 0 && (
            <SelectGroup>
              <div className="px-2 py-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide border-t border-gray-200/50 mt-1 pt-2">
                Vision Models
              </div>
              {visionModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 sm:py-1.5">
                    <div className="flex items-start gap-1 sm:gap-1.5">
                      <div className="mt-0.5">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[9px] sm:text-[10px]">{modelInfo.name}</span>
                          <span className="text-[6px] sm:text-[7px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full font-medium">
                            VISION
                          </span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] text-muted-foreground leading-tight">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}

          {/* Image Generation Models Section */}
          {imageModels.length > 0 && (
            <SelectGroup>
              <div className="px-2 py-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide border-t border-gray-200/50 mt-1 pt-2">
                Image Generation
              </div>
              {imageModels.map((modelId) => {
                const modelInfo = MODEL_FEATURES[modelId];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1 sm:py-1.5">
                    <div className="flex items-start gap-1 sm:gap-1.5">
                      <div className="mt-0.5">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[9px] sm:text-[10px]">{modelInfo.name}</span>
                          <span className="text-[6px] sm:text-[7px] bg-blue-100 text-blue-700 px-1 py-0.5 rounded-full font-medium">
                            IMAGE
                          </span>
                        </div>
                        <span className="text-[7px] sm:text-[8px] text-muted-foreground leading-tight">
                          {modelInfo.feature}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};