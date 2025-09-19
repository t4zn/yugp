'use client';

import { useEffect, useRef } from 'react';

interface InteractionLayerProps {
  children: React.ReactNode;
}

/**
 * Component that ensures mouse events reach the background Spline animation
 * while allowing UI elements to have selective pointer events
 */
export function InteractionLayer({ children }: InteractionLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    // Ensure this layer allows events to pass through to the background
    // except for areas specifically marked with pointer-events-auto
    const handleMouseEvent = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the target or any parent has pointer-events-auto
      let currentElement = target;
      let hasPointerEvents = false;
      
      while (currentElement && currentElement !== layer) {
        const computedStyle = window.getComputedStyle(currentElement);
        if (computedStyle.pointerEvents === 'auto') {
          hasPointerEvents = true;
          break;
        }
        currentElement = currentElement.parentElement as HTMLElement;
      }
      
      // If no pointer-events-auto found, ensure the event can reach the background
      if (!hasPointerEvents) {
        // Allow the event to bubble through to the Spline canvas below
        const splineCanvas = document.querySelector('canvas');
        if (splineCanvas && splineCanvas !== target) {
          const canvasEvent = new MouseEvent(event.type, {
            clientX: event.clientX,
            clientY: event.clientY,
            screenX: event.screenX,
            screenY: event.screenY,
            button: event.button,
            buttons: event.buttons,
            bubbles: true,
            cancelable: true,
            view: window
          });
          splineCanvas.dispatchEvent(canvasEvent);
        }
      }
    };

    const handleTouchEvent = (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      
      // Allow touch events for scrollable elements
      let currentElement = target;
      while (currentElement && currentElement !== layer) {
        const computedStyle = window.getComputedStyle(currentElement);
        if (computedStyle.pointerEvents === 'auto' || 
            currentElement.classList.contains('scrollable-container') ||
            computedStyle.overflow === 'auto' || 
            computedStyle.overflow === 'scroll' ||
            computedStyle.overflowY === 'auto' ||
            computedStyle.overflowY === 'scroll') {
          return; // Allow the touch event to proceed normally
        }
        currentElement = currentElement.parentElement as HTMLElement;
      }
      
      // Prevent default to stop background scrolling
      if (event.type === 'touchmove') {
        event.preventDefault();
      }
    };

    // Add global mouse event listeners
    document.addEventListener('mousemove', handleMouseEvent, { passive: true });
    document.addEventListener('mousedown', handleMouseEvent);
    document.addEventListener('mouseup', handleMouseEvent);
    document.addEventListener('click', handleMouseEvent);
    
    // Add touch event listeners for mobile
    document.addEventListener('touchstart', handleTouchEvent, { passive: true });
    document.addEventListener('touchmove', handleTouchEvent, { passive: false });
    document.addEventListener('touchend', handleTouchEvent, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseEvent);
      document.removeEventListener('mousedown', handleMouseEvent);
      document.removeEventListener('mouseup', handleMouseEvent);
      document.removeEventListener('click', handleMouseEvent);
      document.removeEventListener('touchstart', handleTouchEvent);
      document.removeEventListener('touchmove', handleTouchEvent);
      document.removeEventListener('touchend', handleTouchEvent);
    };
  }, []);

  return (
    <div 
      ref={layerRef}
      className="absolute inset-0 z-10 pointer-events-none overflow-hidden"
    >
      {children}
    </div>
  );
}
