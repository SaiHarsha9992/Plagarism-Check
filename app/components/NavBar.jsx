'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname(); // ✅ Detect current route
    const user = useAuth();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <header className="w-full px-6 py-3 flex justify-between items-center bg-black text-white shadow-md border-b border-gray-800">
            <h1
                className="text-2xl font-extrabold tracking-tight cursor-pointer"
                style={{ fontFamily: 'Inter, Roboto, Montserrat, Arial, sans-serif', letterSpacing: '-1px' }}
                onClick={() => router.push('/')}
            >
                CloneCatcher
            </h1>

            {!user ? (
                <button
                    onClick={() => router.push('/login')}
                    className="bg-white text-black px-4 py-2 rounded font-semibold border border-gray-700 hover:bg-gray-100 transition"
                >
                    Login
                </button>
            ) : (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <Image
                            src={user.photoURL || '/default-profile.png'}
                            alt="User Profile"
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-300"
                            unoptimized
                        />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white rounded shadow-md z-50 border border-gray-800">
                            <div className="p-4 border-b border-gray-800 text-center">
                                <Image
                                    src={user.photoURL || '/default-profile.png'}
                                    alt="User Avatar"
                                    width={64}
                                    height={64}
                                    className="mx-auto rounded-full mb-2"
                                    unoptimized
                                />
                                <p className="font-semibold">
                                    {user.displayName || 'Anonymous User'}
                                </p>
                                <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                            <div className="p-2">
                                {isAdminRoute && (
                                    <button
                                    className="w-full px-4 py-2 mb-2 bg-white text-black rounded border border-gray-700 hover:bg-gray-100"
                                        onClick={() => router.push('/admin/dashboard')}
                                    >
                                        Dashboard
                                    </button>
                                )}
                                <button
                                    className="w-full px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 hover:bg-black"
                                    onClick={handleSignOut}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
