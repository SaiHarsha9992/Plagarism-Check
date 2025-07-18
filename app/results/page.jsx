'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from '../components/NavBar';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeId = searchParams.get('codeId');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      const codeIdLocal = localStorage.getItem('codeId');
      const name = localStorage.getItem('name');
      const email = localStorage.getItem('email');

      if (!name || !email) {
        router.push('/submit');
      } else {
        setIsLoading(false);
      }
    });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700 dark:text-white">
        Checking authentication...
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-extrabold mb-4 text-white bg-black p-2 rounded">CloneCatcher Results</h1>
        <h2 className="text-3xl font-bold mb-4 text-blue-700 dark:text-blue-300">
          ✅ Submission Successful
        </h2>
        <p className="text-green-600 font-medium">
          📬 Results will be sent to your registered email shortly.
        </p>
      </div>
    </div>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700 dark:text-white">
        Loading...
      </div>
    }>
    <>
      <ResultsContent />
      </>
    </Suspense>
  );
}
