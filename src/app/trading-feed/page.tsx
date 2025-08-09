"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TradingFeedRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to profile page
    router.replace('/profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p>Redirecting to Profile...</p>
      </div>
    </div>
  );
} 