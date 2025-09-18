import Chat from "@/components/chat";
import dynamic from 'next/dynamic';

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
    <div className="flex flex-col md:flex-row h-screen w-full bg-white">
      {/* Robot Animation Section */}
      <div className="w-full md:w-1/2 bg-white">
        <SplineRobot className="" />
      </div>

      {/* Chat Section */}
      <div className="w-full md:w-1/2 bg-white">
        <Chat />
      </div>
    </div>
  );
}
