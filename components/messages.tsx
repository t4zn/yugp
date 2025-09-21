import type { UIMessage } from "ai";
import { Message } from "./message";
import { useScrollToBottom } from "@/lib/hooks/use-scroll-to-bottom";

export const Messages = ({
  messages,
  isLoading,
  status,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  status: "error" | "submitted" | "streaming" | "ready";
}) => {
  const [containerRef, endRef] = useScrollToBottom();
  return (
    <div
      className="h-full overflow-y-auto pointer-events-auto scrollbar-hide touch-scroll scrollable-container"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        touchAction: 'pan-y',
        overscrollBehavior: 'contain'
      }}
      ref={containerRef}
    >
      <div className="max-w-xl mx-auto py-8 space-y-4 pointer-events-auto min-h-full">
        {messages.map((m, i) => (
          <Message
            key={i}
            isLatestMessage={i === messages.length - 1}
            isLoading={isLoading}
            message={m}
            status={status}
          />
        ))}
        <div className="h-1" ref={endRef} />
      </div>
    </div>
  );
};
