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

// Add image generation models to the existing types
type AllModelID = modelID | 'flux' | 'dalle-mini' | 'veo-3' | 'heygen';

export default function Chat() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<AllModelID>(defaultModel);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; name: string } | null>(null);
  const [showVisionError, setShowVisionError] = useState(false);
  const [showQueueError, setShowQueueError] = useState(false);
  
  const { sendMessage, messages, status, stop, setMessages } = useChat({
    onError: () => {
      // Show custom queue error toast instead of generic toast
      setShowQueueError(true);
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  const isImageModel = ['dalle-mini', 'flux'].includes(selectedModel);
  const isVideoModel = ['veo-3', 'heygen'].includes(selectedModel);
  const isVisionModel = ['meta-llama/llama-4-maverick-17b-128e-instruct', 'meta-llama/llama-4-scout-17b-16e-instruct'].includes(selectedModel);

  const handleImageUpload = (imageData: string, fileName: string) => {
    setUploadedImage({ data: imageData, name: fileName });
    
    // Auto-switch to a vision model if current model doesn't support vision
    if (!isVisionModel && !isImageModel && !isVideoModel) {
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

  // Function to handle image generation
  const handleImageGeneration = async (prompt: string, model: string) => {
    // Add user message first
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      parts: [{ type: 'text' as const, text: prompt }],
    };

    // Add loading message
    const loadingMessage = {
      id: `loading-${Date.now()}`,
      role: 'assistant' as const,
      parts: [{ type: 'text' as const, text: `Generating image...` }],
    };

    // Update messages to show user prompt and loading state
    setMessages(prevMessages => [...prevMessages, userMessage, loadingMessage]);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model,
          width: 512,
          height: 512,
        }),
      });

      const result = await response.json();

      if (result.success && result.imageUrl) {
        // Create assistant message with the generated image
        const imageMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant' as const,
          parts: [
            { type: 'text' as const, text: `Here's your generated image: "${prompt}"` },
            { 
              type: 'file' as const, 
              mediaType: 'image/png',
              url: result.imageUrl 
            }
          ],
        };
        
        // Replace loading message with the actual image message
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = imageMessage; // Replace the loading message
          return newMessages;
        });
        
        return result.imageUrl;
      } else {
        const errorMsg = result.error || 'Failed to generate image';
        console.error('Image generation failed:', errorMsg);
        
        // Replace loading message with error message
        const errorMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant' as const,
          parts: [{ type: 'text' as const, text: `Sorry, I couldn't generate the image. ${errorMsg}` }],
        };
        
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          newMessages[newMessages.length - 1] = errorMessage;
          return newMessages;
        });
        
        // Show user-friendly toast
        if (errorMsg.includes('not available on the free tier')) {
          toast.error(errorMsg, {
            position: "top-center",
            richColors: true,
            duration: 7000,
            action: {
              label: 'Switch to CompVis SD 1.4',
              onClick: () => setSelectedModel('dalle-mini')
            }
          });
        } else {
          toast.error(errorMsg, {
            position: "top-center",
            richColors: true,
            duration: 5000
          });
        }
        return null;
      }
    } catch (error: unknown) {
      console.error('Error generating image:', error);
      
      // Replace loading message with error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant' as const,
        parts: [{ type: 'text' as const, text: `Network error occurred while generating the image. Please try again.` }],
      };
      
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = errorMessage;
        return newMessages;
      });
      
      let networkErrorMessage = 'Network error. Please try again.';
      if (error instanceof Error && error.message) {
        networkErrorMessage = error.message;
      }
      
      toast.error(networkErrorMessage, {
        position: "top-center",
        richColors: true,
        duration: 5000
      });
      return null;
    }
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
            {(isImageModel ? [
              "A cute cat wearing a space helmet",
              "A peaceful mountain landscape at sunset",
              "A colorful abstract painting",
              "A robot reading a book in a library",
            ] : isVideoModel ? [
              "A person walking down a city street",
              "Ocean waves crashing on a beach",
              "A time-lapse of clouds moving across the sky",
              "A butterfly landing on a flower",
            ] : [
              "What are the advantages of using Next.js?",
              "Write code to demonstrate Dijkstra's algorithm",
              "Help me write an essay about Silicon Valley",
              "What is the weather in San Francisco?",
            ]).map((text) => (
              <button
                key={text}
                type="button"
                onClick={() => setInput(text)}
                className="w-full rounded-full border border-white/20 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 hover:text-white px-4 py-2 text-sm transition-colors text-left shadow-lg"
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
            
            // Handle image and video generation models
            if ((isImageModel || isVideoModel) && input.trim()) {
              const inputValue = input.trim();
              setInput(""); // Clear input immediately
              await handleImageGeneration(inputValue, selectedModel);
              return;
            }
            
            // Handle text/vision models
            if (!isImageModel && !isVideoModel) {
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
              }, { body: { selectedModel: selectedModel as modelID } });
              
              setInput("");
              clearUploadedImage();
            }
          }}
          className="relative"
        >
          <Textarea
            selectedModel={selectedModel as modelID}
            setSelectedModel={(model) => setSelectedModel(model)}
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
