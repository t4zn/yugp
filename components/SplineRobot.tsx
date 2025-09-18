'use client';

import { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';

interface SplineRobotProps {
  className?: string;
}

export default function SplineRobot({ className = '' }: SplineRobotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const hasInitializedRef = useRef(false);

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
        // Enable mouse interactions
        try {
          (app as Application & { enableMouseInteraction?: () => void }).enableMouseInteraction?.();
        } catch (_) {
          console.log('Mouse interaction method not available');
        }
      })
      .catch((error: unknown) => {
        console.error('Failed to load robot scene:', error);
      });

    // Cleanup on unmount
    return () => {
      if (appRef.current) {
        appRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
}
