'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function InfoOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  const openOverlay = () => setIsOpen(true);
  const closeOverlay = () => setIsOpen(false);

  return (
    <>
      {/* Info Button - Desktop Only */}
      <button
        onClick={openOverlay}
        className="hidden md:block fixed bottom-6 left-6 z-50 p-3 hover:bg-white/20 transition-all duration-300 group"
        aria-label="About creator"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-black group-hover:text-gray-700 transition-colors"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 17h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-start"
          onClick={closeOverlay}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Bottom Left Overlay Content */}
          <div
            className="relative bg-white/30 backdrop-blur-3xl rounded-tr-2xl rounded-tl-2xl shadow-2xl border border-white/50 p-4 w-full max-w-xs ml-3 mb-0 animate-in slide-in-from-bottom-4 duration-300"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.35) 100%)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeOverlay}
              className="absolute top-2 right-2 p-1.5 hover:bg-white/30 rounded-full transition-colors"
              aria-label="Close"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-700"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Content */}
            <div className="space-y-3">
              {/* Header with Photo */}
              <div className="flex items-center space-x-3">
                {/* Creator Photo */}
                <div className="flex-shrink-0">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-lg">
                    <Image
                      src="/Taizun.PNG"
                      alt="Taizun - Creator"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Name and Title */}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800 mb-0.5">Taizun</h3>
                  <p className="text-xs text-gray-600 font-medium">AI Developer & Creator</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 text-gray-700">
                <p className="text-xs leading-tight">
                  Creator and lead developer of this advanced AI assistant platform, 
                  specializing in cutting-edge AI solutions.
                </p>
                <p className="text-xs leading-tight">
                  Passionate about building innovative technologies that enhance 
                  user experiences through intelligent automation and seamless interactions.
                </p>
                <p className="text-xs leading-tight">
                  Expert in machine learning, natural language processing, 
                  and modern web technologies.
                </p>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-white/30">
                <p className="text-xs text-gray-500 text-center">
                  Advanced AI Technology
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
