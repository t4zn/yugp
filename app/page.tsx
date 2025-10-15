import Chat from "@/components/chat";
import dynamic from 'next/dynamic';
import { InteractionLayer } from '@/components/InteractionLayer';

// Dynamically import to avoid SSR issues
const SplineRobot = dynamic(() => import('@/components/SplineRobot'), {
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading robot animation...</p>
      </div>
    </div>
  )
});

export default function Page() {
  return (
    <div className="relative mobile-height w-full overflow-hidden fixed inset-0">
      {/* Spline Background - Full Screen with mouse events enabled */}
      <div className="absolute inset-0 z-0">
        <SplineRobot className="w-full h-full object-cover" />
      </div>

      {/* Chat Overlay with InteractionLayer - Selective pointer events */}
      <InteractionLayer>
        <Chat />
      </InteractionLayer>
    </div>
  );
}
