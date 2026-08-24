import { NextResponse } from 'next/server'
import { jwtDecode } from "jwt-decode";
export function middleware(request) {
    const token = request.cookies.get('authToken')?.value
    const { pathname } = request.nextUrl
    // الصفحات الخاصة بـ freelancer فقط
    const freelancerOnly = ['/my-works', '/earnings']
    
    // الصفحات الخاصة بـ client فقط
    const clientOnly = ['/projects']
    
    // الصفحات المحمية (محتاج توكن)
    const protectedRoutes = ['/dashboard', '/profile', '/projects', '/settings', '/my-works', '/messages', '/earnings' ]
    
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isFreelancerRoute = freelancerOnly.some(route => pathname.startsWith(route))
    const isClientRoute = clientOnly.some(route => pathname.startsWith(route))

    // لو محاول دخول صفحة محمية بدون توكن
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token) {
    try {
    const decoded = jwtDecode(token);

    const userRole = decoded.role;

    // Client → Freelancer pages
    if (userRole === "client" && isFreelancerRoute) {
        return NextResponse.redirect(
        new URL("/dashboard", request.url)
        );
    }

    // Freelancer → Client pages
    if (userRole === "freelancer" && isClientRoute) {
        return NextResponse.redirect(
        new URL("/dashboard", request.url)
        );
    }

    } catch (error) {
    console.error("Invalid token:", error);

    return NextResponse.redirect(
        new URL("/login", request.url)
    );
    }
}

    // لو مسجل دخول ويحاول دخول اللوجن أو الريجستر
    if ((pathname === '/login' || pathname === '/register') && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/projects/:path*',
        '/settings/:path*',
        '/login',
        '/register',
        '/my-works',
        '/messages/:path*',
        '/earnings/:path*',
        '/hire/:path*'
    ]
}