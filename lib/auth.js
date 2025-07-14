import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

export const getCurrentUser = () => {
    return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (user) => {
            unsub();
            resolve(user);
        });
    });
};
