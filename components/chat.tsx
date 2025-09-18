"use client";

import { defaultModel, modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { toast } from "sonner";

export default function Chat() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<modelID>(defaultModel);
  const { sendMessage, messages, status, stop } = useChat({
    onError: (error) => {
      toast.error(
        error.message.length > 0
          ? error.message
          : "An error occured, please try again later.",
        { position: "top-center", richColors: true },
      );
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="h-dvh flex flex-col justify-between w-full">
      <Header />
      <div className="flex-1">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto w-full px-6">
            <ProjectOverview />
          </div>
        ) : (
          <Messages messages={messages} isLoading={isLoading} status={status} />
        )}
      </div>

      {messages.length === 0 && (
        <div className="w-full max-w-3xl mx-auto px-6 mb-3">
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
                className="w-full rounded-full border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 text-sm transition-colors text-left"
              >
                {text}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative pb-6 w-full max-w-3xl mx-auto px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage({ text: input }, { body: { selectedModel } });
            setInput("");
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
          />
        </form>
      </div>
    </div>
  );
};
