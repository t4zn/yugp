"use client";

import { getToolName, type ReasoningUIPart, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useState } from "react";
import equal from "fast-deep-equal";
import Image from "next/image";

import { Markdown } from "./markdown";
import { MessageActions, ImageDownload } from "./message-actions";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2,
  PocketKnife,
  SparklesIcon,
  StopCircle,
} from "lucide-react";
import { SpinnerIcon } from "./icons";
import { PulsingDot } from "@/components/ui/pulsing-dot";

interface ReasoningMessagePartProps {
  part: ReasoningUIPart;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  const memoizedSetIsExpanded = useCallback((value: boolean) => {
    setIsExpanded(value);
  }, []);

  useEffect(() => {
    memoizedSetIsExpanded(isReasoning);
  }, [isReasoning, memoizedSetIsExpanded]);

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full hover:bg-zinc-800",
              {
                "bg-zinc-800": isExpanded,
              },
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronUpIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      )}

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="reasoning"
            className="text-sm text-zinc-400 flex flex-col gap-4 border-l pl-3 border-zinc-800"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={variants}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Markdown>{part.text}</Markdown>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TypingTextProps {
  text: string;
  isTyping: boolean;
  speed?: number;
}

function TypingText({ text, isTyping, speed = 20 }: TypingTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(text);
      return;
    }

    if (text.length === 0) {
      setDisplayedText("");
      return;
    }

    // Only reset if we're starting a new message
    if (displayedText.length === 0 || !text.startsWith(displayedText)) {
      setDisplayedText("");
    }

    // Calculate the new text to display
    const newText = text.substring(0, displayedText.length + 1);
    
    if (newText !== displayedText) {
      const timeout = setTimeout(() => {
        setDisplayedText(newText);
      }, speed);
      
      return () => clearTimeout(timeout);
    }
  }, [text, isTyping, speed, displayedText]);

  return <Markdown>{displayedText}</Markdown>;
}

const PurePreviewMessage = ({
  message,
  isLatestMessage,
  status,
}: {
  message: UIMessage;
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
  isLatestMessage: boolean;
}) => {
  return (
    <AnimatePresence key={message.id}>
      <motion.div
        className="w-full mx-auto px-4 group/message overflow-hidden"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        key={`message-${message.id}`}
        data-role={message.role}
      >
        <div
          className={cn(
            "flex gap-4 w-full overflow-hidden group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            "group-data-[role=user]/message:w-fit",
          )}
        >
          {message.role === "assistant" && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-white/30 bg-white/10 backdrop-blur-sm">
              <div className="">
                <SparklesIcon size={14} />
              </div>
            </div>
          )}

          <div className="flex flex-col w-full space-y-4 min-w-0 overflow-hidden">
            {message.parts?.map((part, i) => {
              // Handle file parts (images)
              if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
                return (
                  <div key={`message-${message.id}-file-${i}`} className="mb-2 group">
                    <Image
                      src={part.url}
                      alt={`Generated image ${i + 1}`}
                      className="max-w-xs max-h-64 object-cover rounded-lg border border-gray-200 shadow-sm"
                      width={300}
                      height={256}
                    />
                    <ImageDownload imageUrl={part.url} imageIndex={i} />
                  </div>
                );
              }
              
              // Handle text parts
              if (part.type === 'text') {
                  return (
                    <motion.div
                      initial={{ y: 5, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      key={`message-${message.id}-part-${i}`}
                      className="flex flex-row gap-2 items-start w-full pb-4 overflow-hidden"
                    >
                      <div
                        className={cn("flex flex-col gap-4 w-full min-w-0", {
                          "bg-white/60 backdrop-blur-sm text-black px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-lg":
                            message.role === "user",
                          "bg-gray-800/80 backdrop-blur-lg text-gray-300 px-3 py-2 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-lg":
                            message.role === "assistant",
                        })}
                      >
                        {message.role === "assistant" && isLatestMessage && status === "streaming" ? (
                          <>
                            {!part.text && (
                              <div className="flex gap-2 items-center mb-2">
                                <PulsingDot />
                                <PulsingDot />
                                <PulsingDot />
                              </div>
                            )}
                            <TypingText 
                              text={part.text} 
                              isTyping={status === "streaming"} 
                              speed={10} 
                            />
                          </>
                        ) : (
                          <Markdown>{part.text}</Markdown>
                        )}
                        
                        {message.role === "assistant" && part.text && (
                          <MessageActions 
                            messageContent={part.text}
                            hasImages={message.parts?.some(p => p.type === 'file' && p.mediaType?.startsWith('image/'))}
                            isStreaming={isLatestMessage && status === "streaming"}
                            isGeneratingImage={part.text.includes('Generating image') || part.text.includes('generating')} messageId={""}                          />
                        )}
                      </div>
                    </motion.div>
                  );
              }
              
              // Handle tool parts
              if (part.type?.startsWith('tool-')) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const toolPart = part as any; // Tool parts have complex union types from AI SDK
                const { state } = toolPart;

                return (
                  <motion.div
                    initial={{ y: 5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    key={`message-${message.id}-part-${i}`}
                    className="flex flex-col gap-2 p-2 mb-3 text-sm bg-black/40 backdrop-blur-sm rounded-md border border-white/20 text-black shadow-lg"
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full">
                        <PocketKnife className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium flex items-baseline gap-2">
                          {state === "input-streaming" ? "Calling" : "Called"}{" "}
                          <span className="font-mono bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-black">
                            {getToolName(toolPart)}
                          </span>
                        </div>
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center">
                        {state === "input-streaming" ? (
                          isLatestMessage && status !== "ready" ? (
                            <Loader2 className="animate-spin h-4 w-4 text-zinc-500" />
                          ) : (
                            <StopCircle className="h-4 w-4 text-red-500" />
                          )
                        ) : state === "output-available" ? (
                          <CheckCircle size={14} className="text-green-600" />
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                );
              }
              
              // Handle reasoning parts
              if (part.type === 'reasoning') {
                return (
                  <ReasoningMessagePart
                    key={`message-${message.id}-${i}`}
                    part={part}
                    isReasoning={
                      (message.parts &&
                        status === "streaming" &&
                        i === message.parts.length - 1) ??
                      false
                    }
                  />
                );
              }
              
              return null;
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const Message = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false;
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false;

  return true;
});
