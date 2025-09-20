import { modelID } from "@/ai/providers";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { ArrowUp, Mic, MicOff } from "lucide-react";
import { ModelPicker } from "./model-picker";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Add image generation models to the existing types
type AllModelID = modelID | 'dalle-mini' | 'flux';

interface InputProps {
  input: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  status: string;
  stop: () => void;
  selectedModel: AllModelID;
  setSelectedModel: (model: AllModelID) => void;
  onImageUpload?: (imageData: string, fileName: string) => void;
  uploadedImage?: { data: string; name: string } | null;
  onClearImage?: () => void;
  onShowVisionError?: () => void;
}

export const Textarea = ({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
  selectedModel,
  setSelectedModel,
  onImageUpload,
  uploadedImage,
  onClearImage,
  onShowVisionError,
}: InputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as Window & {
        SpeechRecognition?: typeof window.SpeechRecognition;
        webkitSpeechRecognition?: typeof window.webkitSpeechRecognition;
      }).SpeechRecognition || (window as Window & {
        SpeechRecognition?: typeof window.SpeechRecognition;
        webkitSpeechRecognition?: typeof window.webkitSpeechRecognition;
      }).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
      }
      
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          // Create a synthetic event to match the expected type
          const syntheticEvent = {
            currentTarget: { value: transcript }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(syntheticEvent);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleInputChange]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Handle touch events for mobile browsers
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent click event from firing after touch
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only handle click if it's not a touch device or if touch events weren't handled
    if (e.detail === 0) return; // Ignore programmatic clicks
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  return (
    <div className="relative w-full pt-2">
      {/* Image preview section */}
      {uploadedImage && (
        <div className="mb-3 p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 shadow-sm">
          <div className="flex items-center gap-2">
            <Image 
              src={uploadedImage.data} 
              alt={uploadedImage.name}
              className="w-12 h-12 object-cover rounded-md border border-gray-200"
              width={48}
              height={48}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate max-w-full">{uploadedImage.name}</p>
              <p className="text-xs text-gray-500">Image attached</p>
            </div>
            <button
              type="button"
              onClick={onClearImage}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              title="Remove image"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      <ShadcnTextarea
        className="resize-none w-full rounded-2xl pr-12 pt-4 pb-16 bg-white/60 backdrop-blur-sm border-gray-300/80 focus-visible:border-gray-400/80 placeholder:text-gray-500/80 text-gray-900 shadow-lg max-h-32 overflow-y-auto"
        value={input}
        autoFocus
        placeholder={"Send a message..."}
        // @ts-expect-error err
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
              // @ts-expect-error err
              const form = e.target.closest("form");
              if (form) form.requestSubmit();
            }
          }
        }}
        style={{
          minHeight: '60px',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
        }}
      />
      <ModelPicker
        setSelectedModel={setSelectedModel}
        selectedModel={selectedModel}
        onImageUpload={onImageUpload}
        uploadedImage={uploadedImage}
        onShowVisionError={onShowVisionError}
      />

      {/* Microphone button - only show when input is empty and speech recognition is supported */}
      {isSupported && !input.trim() && status !== "streaming" && status !== "submitted" && (
        <button
          type="button"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={`icon-btn absolute right-14 bottom-2 rounded-full p-2 backdrop-blur-sm transition-colors shadow-lg touch-manipulation select-none ${
            isListening 
              ? 'bg-red-500/80 text-white hover:bg-red-600/80 active:bg-red-700/80' 
              : 'bg-white/60 text-gray-900 hover:bg-white/70 active:bg-white/80'
          }`}
        >
          {isListening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>
      )}

      {status === "streaming" || status === "submitted" ? (
        <button
          type="button"
          onClick={stop}
          className="icon-btn cursor-pointer absolute right-2 bottom-2 rounded-full p-2 bg-white/60 backdrop-blur-sm text-gray-900 hover:bg-white/70 disabled:bg-white/10 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <div className="animate-spin h-4 w-4">
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        </button>
      ) : (
        <button
          type="submit"
          disabled={isLoading || (!input.trim() && !uploadedImage)}
          className="icon-btn absolute right-2 bottom-2 rounded-full p-2 bg-white/60 backdrop-blur-sm text-gray-900 hover:bg-white/70 disabled:bg-white/10 disabled:text-gray-400/50 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
