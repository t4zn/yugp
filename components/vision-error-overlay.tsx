"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

interface VisionErrorOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export const VisionErrorOverlay = ({
  isVisible,
  onClose,
}: VisionErrorOverlayProps) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 400,
            duration: 0.3
          }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 mx-4"
        >
          {/* Enhanced glassmorphism container */}
          <div className="relative">
            {/* Backdrop blur background */}
            <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl" />
            
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
            
            {/* Content container */}
            <div className="relative px-4 py-3 max-w-xs sm:max-w-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Red error icon */}
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-white stroke-2" />
                </div>
                
                {/* Compact text for mobile */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight truncate">
                    Need vision model for images
                  </p>
                </div>
              </div>
              
              {/* Subtle animation indicator */}
              <div className="absolute -bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-60 rounded-full" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};