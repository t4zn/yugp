"use client";

import { motion, AnimatePresence } from "motion/react";
import { Clock } from "lucide-react";
import { useEffect } from "react";

interface QueueErrorToastProps {
  isVisible: boolean;
  onClose: () => void;
}

export const QueueErrorToast = ({
  isVisible,
  onClose,
}: QueueErrorToastProps) => {
  // Auto-dismiss after 5 seconds (longer than vision error since it has more text)
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 mx-4"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-xl border border-white/30 shadow-lg px-3 py-2.5 max-w-xs sm:max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-600 stroke-2" />
              </div>
              <p className="text-xs sm:text-sm text-gray-700 font-medium truncate">
                In queue... try again later
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
