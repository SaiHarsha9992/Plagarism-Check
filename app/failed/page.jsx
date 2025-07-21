'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FailedPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4 text-red-500">❌ Test Failed</h1>
      <p className="text-lg max-w-md mb-6">
        You have violated the test rules (e.g., exited fullscreen, used copy/paste, or switched tabs) multiple times.
        As a result, your test has been auto-submitted and marked as failed.
      </p>
      <p className="text-sm text-gray-400">You will be redirected to the home page shortly...</p>
    </div>
  );
}
