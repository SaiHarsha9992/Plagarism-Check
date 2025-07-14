'use client';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Login failed');
            });
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
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Google login failed');
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <div className="mb-4">
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        autoComplete="email"
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoComplete="current-password"
                    />
                </div>
                <button
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 disabled:opacity-50"
                    onClick={login}
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t" />
                    <span className="mx-2 text-gray-400">or</span>
                    <hr className="flex-grow border-t" />
                </div>
                <button
                    className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
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
    );
}
