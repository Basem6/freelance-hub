import { NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// صفحة الـ freelancer الرئيسية
const FREELANCER_HOME = 'nx/findwork'

// صفحات الـ freelancer بس
const freelancerOnly = ['/my-works', '/earnings']

// صفحات الـ client بس
const clientOnly = ['/projects', "/freelancers"]

// الصفحات المحمية (محتاجة توكن)
const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/projects',
    '/settings',
    '/my-works',
    '/messages',
    '/earnings',
    '/hire',
    '/findwork',
    '/nx/findwork',
]

const authPages = ['/login', '/register']

export function proxy(request) {
    const token = request.cookies.get('authToken')?.value
    const { pathname } = request.nextUrl

    const matches = (routes) => routes.some((route) => pathname.startsWith(route))

    const isProtectedRoute = matches(protectedRoutes)
    const isFreelancerRoute = matches(freelancerOnly)
    const isClientRoute = matches(clientOnly)
    const isAuthPage = authPages.includes(pathname)
    const isHomePage = pathname === '/'  || pathname === '/findwork' // مقارنة مباشرة مش startsWith

    // صفحة محمية بدون توكن
    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token) {
        let decoded

        try {
            decoded = jwtDecode(token)

            if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
                throw new Error('Expired token')
            }
        } catch (error) {
            console.error('Invalid token:', error)

            const response = isAuthPage || isHomePage
                ? NextResponse.next()
                : NextResponse.redirect(new URL('/login', request.url))

            response.cookies.delete('authToken')
            return response
        }

        const userRole = decoded.role

        // Client بيحاول يدخل صفحات الـ Freelancer
        if (userRole === 'client' && isFreelancerRoute) {
            return NextResponse.redirect(new URL('/profile', request.url))
        }

        // Freelancer بيحاول يدخل صفحات الـ Client
        if (userRole === 'freelancer' && isClientRoute) {
            return NextResponse.redirect(new URL('/profile', request.url))
        }

        // Freelancer على الصفحة الرئيسية → findwork
        if (userRole === 'freelancer' && isHomePage) {
            return NextResponse.redirect(new URL(FREELANCER_HOME, request.url))
        }

        // مسجل دخول وبيفتح login/register
        if (isAuthPage) {
            const target = userRole === 'freelancer' ? FREELANCER_HOME : '/'
            return NextResponse.redirect(new URL(target, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/', // ضروري عشان الـ middleware يشتغل على الرئيسية
        '/dashboard/:path*',
        '/profile/:path*',
        '/projects/:path*',
        '/settings/:path*',
        '/login',
        '/register',
        '/my-works/:path*',
        '/messages/:path*',
        '/earnings/:path*',
        '/hire/:path*',
        '/findwork/:path*',
        '/nx/findwork/:path*',
    ],
}