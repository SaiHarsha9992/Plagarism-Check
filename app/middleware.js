import { NextResponse } from 'next/server';

const ALLOWED_ADMINS = ['gaduharsha72@gmail.com', 'anotheradmin@example.com'];

export function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get('token')?.value || null;
    const userEmail = req.cookies.get('email')?.value || null;

    // 🔐 Protect `/submit` route (requires login)
    if (pathname === '/submit') {
        if (!token) {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = '/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    // 🔐 Protect all `/admin` routes
    if (pathname.startsWith('/admin')) {
        const isAdmin = token && userEmail && ALLOWED_ADMINS.includes(userEmail);

        // ✅ If already logged in admin visits `/admin/login`, redirect to dashboard
        if (pathname === '/admin/login' && isAdmin) {
            const dashboardUrl = req.nextUrl.clone();
            dashboardUrl.pathname = '/admin/dashboard';
            return NextResponse.redirect(dashboardUrl);
        }

        // ❌ If not logged in or not an admin, redirect to login
        if (!isAdmin && pathname !== '/admin/login') {
            const loginUrl = req.nextUrl.clone();
            loginUrl.pathname = '/admin/login';
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/submit', '/admin/:path*'],
};
