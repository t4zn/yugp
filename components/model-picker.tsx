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
  "llama-3.1-8b-instant": {
    name: "Llama 3.1 8B",
    feature: "Fast responses, lightweight",
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor"/>
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
  
  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-2">
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
          <SelectGroup>
            {MODELS.map((modelId) => {
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
        </SelectContent>
      </Select>
    </div>
  );
};
