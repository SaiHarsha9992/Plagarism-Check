'use client';
// use `js-cookie` or `document.cookie` in client side
import Cookies from 'js-cookie';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ADMIN_EMAIL = 'admin@example.com'; // replace

export default function AdminLogin() {
    const ALLOWED_ADMINS = ['gaduharsha72@gmail.com', 'anotheradmin@example.com'];
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const login = async () => {
    try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (ALLOWED_ADMINS.includes(cred.user.email)) {
            Cookies.set('token', await cred.user.getIdToken(), { secure: true });
            Cookies.set('email', cred.user.email, { secure: true });
            router.push('/admin/dashboard');
        } else {
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Not authorized');
            });
        }
    } catch (err) {
        import('react-hot-toast').then(({ toast }) => {
                toast.error('Login failed');
            });
    }
};


    const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        if (ALLOWED_ADMINS.includes(cred.user.email)) {
            Cookies.set('token', await cred.user.getIdToken(), { secure: true });
            Cookies.set('email', cred.user.email, { secure: true });
            router.push('/admin/dashboard');
        } else {
            import('react-hot-toast').then(({ toast }) => {
                toast.error('Not authorized');
            });
        }
    } catch (err) {
        import('react-hot-toast').then(({ toast }) => {
                toast.error('Login failed');
            });
    }
};


    return (
        <div className="p-6">
            <h2>Admin Login</h2>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={login}>Login</button>
            <div className="my-2" />
            <button onClick={loginWithGoogle}>Login with Google</button>
        </div>
    );
}
