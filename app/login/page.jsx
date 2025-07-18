"use client";
// ParallaxBackground copied from landing page
const symbols = [
  '{', '}', '()', '<>', 'JS', 'Py', 'C++', 'Java', 'λ', '∑', '∫', 'ƒ', '→', '⇌', 'Σ', 'π', '∂', '≡', '≠', '&&', '||', '::', '=>', '/*', '*/', 'def', 'class', 'public', 'private', 'import', 'export', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'finally', 'new', 'const', 'let', 'var', 'true', 'false', 'null', 'undefined', 'NaN', 'async', 'await', 'static', 'void', 'main', 'print', 'cout', 'System.out.println', 'console.log', 'list', 'dict', 'map', 'set', 'tree', 'graph', 'node', 'edge', 'BFS', 'DFS', 'O(n)', 'O(1)', 'O(log n)', 'O(n^2)'
];

function ParallaxBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 20%, #222 60%, #000 100%)',
    }}>
      {[...Array(120)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          borderRadius: '50%',
          background: 'white',
          opacity: Math.random() * 0.7 + 0.3,
          filter: 'blur(0.5px)',
          animation: `starMove ${10 + Math.random() * 20}s linear infinite`,
        }} />
      ))}
      {symbols.slice(0, 40).map((sym, i) => (
        <span key={sym + i} style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          fontSize: `${Math.random() * 2 + 1.2}rem`,
          color: ['#fff', '#bbb', '#888'][i % 3],
          opacity: 0.15 + Math.random() * 0.25,
          fontWeight: 700,
          pointerEvents: 'none',
          animation: `floatSymbol ${12 + Math.random() * 18}s ease-in-out infinite`,
        }}>{sym}</span>
      ))}
      <style>{`
        @keyframes starMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        @keyframes floatSymbol {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
          100% { transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Navbar from '../components/NavBar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/submit');
    } catch (err) {
      const { toast } = await import('react-hot-toast');
      toast.error('Login failed');
    }
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/submit');
    } catch (err) {
      const { toast } = await import('react-hot-toast');
      toast.error('Google login failed');
    }
    setLoading(false);
  };
   useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/submit');
            }
        });
        return () => unsubscribe();
    }, [router]);

  return (
    <>
      <ParallaxBackground />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="bg-black text-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800" style={{ backdropFilter: 'blur(2px)' }}>
          <h2 className="text-3xl font-extrabold mb-6 text-center" style={{ letterSpacing: '-1px', textShadow: '0 2px 12px #000' }}>
            Login to <span style={{ color: 'grey', fontWeight: 900 }}>CloneCatcher</span>
          </h2>
          <div className="mb-4">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-black text-white border-gray-700 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="mb-6">
            <input
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 bg-black text-white border-gray-700 placeholder-gray-400"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
            />
          </div>
          <button
            className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition mb-4 disabled:opacity-50"
            onClick={login}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-t dark:border-gray-600" />
            <span className="mx-2 text-gray-500 dark:text-gray-400">or</span>
            <hr className="flex-grow border-t dark:border-gray-600" />
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-100 hover:text-black transition disabled:opacity-50"

            onClick={loginWithGoogle}
            disabled={loading}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.2 3.22l6.86-6.86C35.64 2.42 30.14 0 24 0 14.82 0 6.7 5.82 2.68 14.18l7.98 6.2C12.7 13.7 17.9 9.5 24 9.5z"/>
                <path fill="#34A853" d="M46.1 24.5c0-1.64-.14-3.22-.4-4.74H24v9.02h12.42c-.54 2.92-2.18 5.4-4.66 7.08l7.2 5.6C43.98 37.18 46.1 31.3 46.1 24.5z"/>
                <path fill="#FBBC05" d="M10.66 28.38A14.5 14.5 0 0 1 9.5 24c0-1.54.26-3.02.72-4.38l-7.98-6.2A23.97 23.97 0 0 0 0 24c0 3.82.92 7.44 2.54 10.62l8.12-6.24z"/>
                <path fill="#EA4335" d="M24 48c6.14 0 11.3-2.02 15.06-5.48l-7.2-5.6c-2.02 1.36-4.6 2.18-7.86 2.18-6.1 0-11.3-4.2-13.18-9.86l-8.12 6.24C6.7 42.18 14.82 48 24 48z"/>
              </g>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}
