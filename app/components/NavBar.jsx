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
        <header className="w-full px-6 py-3 flex justify-between items-center bg-gradient-to-br from-gray-900 to-blue-900 text-white shadow-md">
            <h1
                className="text-2xl font-bold cursor-pointer"
                onClick={() => router.push('/')}
            >
                CloneCatcher
            </h1>

            {!user ? (
                <button
                    onClick={() => router.push('/login')}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-medium"
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
                        <div className="absolute right-0 mt-2 w-64 bg-gradient-to-br from-gray-900 to-blue-600 text-black rounded shadow-md z-50">
                            <div className="p-4 border-b text-center">
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
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <div className="p-2">
                                {isAdminRoute && (
                                    <button
                                        className="w-full px-4 py-2 mb-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={() => router.push('/admin/dashboard')}
                                    >
                                        Dashboard
                                    </button>
                                )}
                                <button
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
