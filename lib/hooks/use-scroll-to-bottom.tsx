import { useEffect, useRef, type RefObject } from 'react';

export function useScrollToBottom(): [
  RefObject<HTMLDivElement>,
  RefObject<HTMLDivElement>,
] {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        // Always scroll to bottom when new content is added
        // This ensures the conversation stays at the bottom as messages arrive
        requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = container;
          const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
          
          // Auto-scroll if user is close to the bottom (within 150px) or if it's the first scroll
          if (distanceFromBottom < 150 || scrollTop === 0) {
            end.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: true // Also observe text changes for streaming content
      });

      // Initial scroll to bottom
      setTimeout(() => {
        end.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);

      return () => observer.disconnect();
    }
  }, []);

  // @ts-expect-error error
  return [containerRef, endRef];
}