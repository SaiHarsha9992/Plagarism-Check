'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Navbar from './components/NavBar';
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (user) router.push('/submit');
    else router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-600 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          🔍 Plagiarism Checker for Code
        </h1>
        <p className="text-gray-300 max-w-xl mb-8 text-lg">
          An intelligent system to detect code similarities and ensure academic integrity.
        </p>

        <button
          onClick={handleGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md transition"
        >
          Get Started
        </button>
      </main>

      <footer className="text-center text-sm text-gray-200 py-4 border-t border-gray-700">
        Built with ❤️ using Next.js, Firebase
      </footer>
    </div>
  );
}
