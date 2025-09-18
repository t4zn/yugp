"use client";
import { modelID, MODELS } from "@/ai/providers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Model features and icons mapping
const MODEL_FEATURES: Record<modelID, { name: string; feature: string; icon: React.ReactElement }> = {
  "openai/gpt-oss-120b": {
    name: "GPT OSS 120B",
    feature: "Advanced reasoning, large context",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" fill="#10A37F" stroke="#10A37F" strokeWidth="2"/>
        <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="2" fill="white"/>
      </svg>
    )
  },
  "kimi-k2": {
    name: "Kimi K2",
    feature: "Large context window, multilingual",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24M8.76 8.76l-4.24-4.24m12.73 12.73l-4.24-4.24M8.76 15.24l-4.24 4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  "meta-llama/llama-4-scout-17b-16e-instruct": {
    name: "Llama 4 Scout",
    feature: "Latest Llama model, efficient reasoning",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="currentColor"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  "meta-llama/llama-4-maverick-8b-instruct": {
    name: "Llama 4 Maverick",
    feature: "Vision support, multimodal capabilities",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="2"/>
        <path d="M8 12l2-2 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="8" r="1" fill="white"/>
        <path d="M9 16h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  },
  "deepseek-r1-distill-llama-70b": {
    name: "DeepSeek R1",
    feature: "Advanced reasoning, step-by-step thinking",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
  "llama-3.3-70b-versatile": {
    name: "Llama 3.3 70B",
    feature: "Versatile, high-quality responses",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
      </svg>
    )
  }
};

interface ModelPickerProps {
  selectedModel: modelID;
  setSelectedModel: (model: modelID) => void;
}

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
}: ModelPickerProps) => {
  const selectedModelInfo = MODEL_FEATURES[selectedModel];
  
  // Separate models into regular and vision-capable
  const regularModels = MODELS.filter(modelId => 
    !['meta-llama/llama-4-maverick-8b-instruct', 'meta-llama/llama-4-scout-17b-16e-instruct'].includes(modelId)
  );
  const visionModels = MODELS.filter(modelId => 
    ['meta-llama/llama-4-maverick-8b-instruct', 'meta-llama/llama-4-scout-17b-16e-instruct'].includes(modelId)
  );
  
  const isVisionModel = visionModels.includes(selectedModel);
  
  const handleFileUpload = () => {
    if (!isVisionModel) {
      // Show warning for non-vision models
      showMessage('Please select a vision model to upload images', 'error');
      return;
    }
    
    try {
      // Create file input for vision models
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = false;
      
      input.onchange = async (e) => {
        try {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            return;
          }
          
          // Validate file type
          if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file', 'error');
            return;
          }
          
          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            showMessage('Image file size must be less than 10MB', 'error');
            return;
          }
          
          console.log('Image selected:', file.name, 'Size:', Math.round(file.size / 1024) + 'KB');
          showMessage(`Image "${file.name}" selected successfully`, 'success');
          
          // TODO: Implement actual image upload/processing logic here
          // For now, we just validate and show success message
          
        } catch (error) {
          console.error('Error processing file:', error);
          showMessage('Error processing the selected file', 'error');
        }
      };
      
      input.onerror = () => {
        showMessage('Error accessing file system', 'error');
      };
      
      input.click();
      
    } catch (error) {
      console.error('Error creating file input:', error);
      showMessage('Error opening file selector', 'error');
    }
  };
  
  const showMessage = (text: string, type: 'success' | 'error') => {
    try {
      // Remove any existing messages
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
      
      // Auto-remove after 3 seconds
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
    <div className="absolute bottom-2 left-2 flex items-center gap-2">
      {/* File Upload Pin Icon */}
      <button
        onClick={handleFileUpload}
        className={`p-1.5 rounded-full transition-all duration-200 ${
          isVisionModel 
            ? 'bg-purple-100 hover:bg-purple-200 text-purple-700 cursor-pointer' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
        }`}
        title={isVisionModel ? 'Upload image' : 'Select a vision model to upload images'}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.49-8.49" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="min-w-[140px] h-8">
          <SelectValue placeholder="Select a model">
            <div className="flex items-center gap-1.5">
              {selectedModelInfo?.icon}
              <span className="font-bold text-[10px]">{selectedModelInfo?.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[200px] backdrop-blur-md bg-white/80 border border-white/20">
          {/* Regular Models Section */}
          <SelectGroup>
            <div className="px-2 py-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
              Text Models
            </div>
            {regularModels.map((modelId) => {
              const modelInfo = MODEL_FEATURES[modelId as modelID];
              return (
                <SelectItem key={modelId} value={modelId} className="py-1.5">
                  <div className="flex items-start gap-1.5">
                    <div className="mt-0.5">{modelInfo.icon}</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[10px]">{modelInfo.name}</span>
                      <span className="text-[8px] text-muted-foreground leading-tight">
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
                const modelInfo = MODEL_FEATURES[modelId as modelID];
                return (
                  <SelectItem key={modelId} value={modelId} className="py-1.5">
                    <div className="flex items-start gap-1.5">
                      <div className="mt-0.5">{modelInfo.icon}</div>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-[10px]">{modelInfo.name}</span>
                          <span className="text-[7px] bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full font-medium">
                            VISION
                          </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground leading-tight">
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
