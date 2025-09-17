'use client';

import { motion } from 'framer-motion';

export function PulsingDot() {
  return (
    <motion.div
      className="h-2 w-2 rounded-full bg-zinc-500"
      animate={{ 
        opacity: [0.6, 1, 0.6],
        scale: [0.8, 1.2, 0.8]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}
