'use client';

import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export function useSplineMouseInteraction(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  appRef: React.RefObject<Application | null>
) {
  const mouseInteractionEnabledRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const app = appRef.current;
    
    if (!canvas || !app || mouseInteractionEnabledRef.current) return;

    // Enhanced mouse interaction setup
    const setupMouseInteraction = () => {
      try {
        // Multiple approaches to ensure mouse interaction works
        const methods: Array<() => void> = [
          () => app.enableMouseInteraction?.(),
          () => app.setMouseInteraction?.(true),
          () => { app.mouseInteraction = true; },
          () => { app.enableMouse = true; },
          () => { app.interactionEnabled = true; }
        ];

        methods.forEach((method, index) => {
          try {
            method();
            console.log(`Mouse interaction method ${index + 1} executed`);
          } catch {
            console.log(`Mouse interaction method ${index + 1} not available`);
          }
        });

        // Ensure canvas properties are set correctly
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = 'auto';
        canvas.style.touchAction = 'auto';

        mouseInteractionEnabledRef.current = true;
        console.log('Enhanced mouse interaction setup completed');
      } catch (error) {
        console.error('Error setting up mouse interaction:', error);
      }
    };

    // Set up mouse interaction immediately and with a delay
    setupMouseInteraction();
    
    // Retry after a short delay to ensure the scene is fully loaded
    const timeoutId = setTimeout(setupMouseInteraction, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [canvasRef, appRef]);

  // Enhanced mouse event forwarding
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const forwardMouseEvent = (originalEvent: MouseEvent, eventType: string) => {
      // Note: Canvas coordinates could be calculated if needed for custom event processing:
      // const rect = canvas.getBoundingClientRect();
      // const x = originalEvent.clientX - rect.left;
      // const y = originalEvent.clientY - rect.top;

      // Create and dispatch the forwarded event
      const forwardedEvent = new MouseEvent(eventType, {
        clientX: originalEvent.clientX,
        clientY: originalEvent.clientY,
        screenX: originalEvent.screenX,
        screenY: originalEvent.screenY,
        button: originalEvent.button,
        buttons: originalEvent.buttons,
        bubbles: true,
        cancelable: true,
        view: window
      });

      canvas.dispatchEvent(forwardedEvent);
    };

    const handleMouseMove = (event: MouseEvent) => {
      forwardMouseEvent(event, 'mousemove');
    };

    const handleMouseDown = (event: MouseEvent) => {
      forwardMouseEvent(event, 'mousedown');
    };

    const handleMouseUp = (event: MouseEvent) => {
      forwardMouseEvent(event, 'mouseup');
    };

    const handleClick = (event: MouseEvent) => {
      forwardMouseEvent(event, 'click');
    };

    const handleMouseEnter = (event: MouseEvent) => {
      canvas.style.cursor = 'auto';
      forwardMouseEvent(event, 'mouseenter');
    };

    const handleMouseLeave = (event: MouseEvent) => {
      forwardMouseEvent(event, 'mouseleave');
    };

    // Add event listeners to the document to catch all mouse events
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef]);
}
