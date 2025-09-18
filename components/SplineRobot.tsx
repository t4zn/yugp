'use client';

import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';
import { useSplineMouseInteraction } from '@/lib/hooks/use-spline-mouse-interaction';

interface SplineRobotProps {
  className?: string;
}

export default function SplineRobot({ className = '' }: SplineRobotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const hasInitializedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use custom hook for mouse interaction
  useSplineMouseInteraction(canvasRef, appRef);

  useEffect(() => {
    if (!canvasRef.current || hasInitializedRef.current) return;

    hasInitializedRef.current = true;

    // Initialize Spline application
    const app = new Application(canvasRef.current);
    appRef.current = app;

    // Load the robot scene
    app.load('/nexbot_robot_character_concept.spline')
      .then(() => {
        console.log('Robot scene loaded successfully');
        console.log('Mouse interaction will be set up by custom hook');
      })
      .catch((error: unknown) => {
        console.error('Failed to load robot scene:', error);
      });

    // Cleanup on unmount
    return () => {
      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ 
        pointerEvents: 'auto',
        zIndex: 0
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          pointerEvents: 'auto',
          cursor: 'auto',
          touchAction: 'auto'
        }}
      />
    </div>
  );
}
