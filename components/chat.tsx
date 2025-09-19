"use client";

import { defaultModel, modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { VisionErrorToast } from "./vision-error-toast";
import { QueueErrorToast } from "./queue-error-toast";
import { toast } from "sonner";

export default function Chat() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<modelID>(defaultModel);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string } | null>(null);
  const [showVisionError, setShowVisionError] = useState(false);
  const [showQueueError, setShowQueueError] = useState(false);
  
  const { sendMessage, messages, status, stop } = useChat({
    onError: () => {
      // Show custom queue error toast instead of generic toast
      setShowQueueError(true);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const handleImageUpload = (imageData: string, fileName: string) => {
    setUploadedImage({ data: imageData, name: fileName });
    
    // Auto-switch to a vision model if current model doesn't support vision
    const visionModels = ['meta-llama/llama-4-maverick-17b-128e-instruct', 'meta-llama/llama-4-scout-17b-16e-instruct'];
    if (!visionModels.includes(selectedModel)) {
      setSelectedModel('meta-llama/llama-4-maverick-17b-128e-instruct'); // Default to Maverick for vision
      toast.success(
        "Switched to Llama 4 Maverick for image analysis",
        { position: "top-center", richColors: true }
      );
    }
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="mobile-height flex flex-col justify-between w-full p-6 pointer-events-none max-h-full overflow-hidden">
      <div className="pointer-events-auto flex-shrink-0">
        <Header />
      </div>
      <div className="flex-1 min-h-0 pointer-events-none overflow-hidden relative">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto w-full px-6 pointer-events-auto">
            <ProjectOverview />
          </div>
        ) : (
          <div className="pointer-events-auto h-full touch-scroll">
            <Messages messages={messages} isLoading={isLoading} status={status} />
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="hidden md:block w-full max-w-3xl mx-auto px-6 mb-3 pointer-events-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "What are the advantages of using Next.js?",
              "Write code to demonstrate Dijkstra's algorithm",
              "Help me write an essay about Silicon Valley",
              "What is the weather in San Francisco?",
            ].map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => setInput(text)}
                className="w-full rounded-full border border-white text-black bg-white hover:bg-gray-100 hover:text-gray-900 px-4 py-2 text-sm transition-colors text-left shadow-lg"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative pb-6 w-full max-w-3xl mx-auto px-6 pointer-events-auto flex-shrink-0">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim() && !uploadedImage) return;
            
            // Create message parts array
            const parts: { type: 'text' | 'file'; text?: string; mediaType?: string; url?: string }[] = [];
            
            // Add text part if exists
            if (input.trim()) {
              parts.push({ type: 'text', text: input });
            }
            
            // Add image part if exists
            if (uploadedImage) {
              parts.push({
                type: 'file',
                mediaType: 'image/*',
                url: uploadedImage.data,
              });
            }
            
            // Send message with parts
            sendMessage({
              role: 'user',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              parts: parts as any, // Type assertion for message parts - AI SDK has complex union types
            }, { body: { selectedModel } });
            
            setInput("");
            clearUploadedImage();
          }}
          className="relative"
        >
          <Textarea
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            handleInputChange={(e) => setInput(e.currentTarget.value)}
            input={input}
            isLoading={isLoading}
            status={status}
            stop={stop}
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage}
            onClearImage={clearUploadedImage}
            onShowVisionError={() => setShowVisionError(true)}
          />
        </form>
      </div>
      
      {/* Vision Error Toast */}
      <VisionErrorToast
        isVisible={showVisionError}
        onClose={() => setShowVisionError(false)}
      />
      
      {/* Queue Error Toast */}
      <QueueErrorToast
        isVisible={showQueueError}
        onClose={() => setShowQueueError(false)}
      />
    </div>
  );
};
