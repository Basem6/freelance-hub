import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './globals.css'
import SocketProvider from "./providers/SocketProvider";
import StoreProvider from './lib/StoreProvider'
import { Analytics } from '@vercel/analytics/react'
import Toast from '../components/ui/Toast'

const geistSans = Geist({
    subsets: ['latin'],
    variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
})

// ✅ metadata في Server Component
export const metadata = {
    title: 'FreelanceHub',
    description: 'Find Top Freelancers. Build Amazing Projects.',
    openGraph: {
        title: 'FreelanceHub',
        description: 'Hire vetted freelancers and manage projects end to end',
        type: 'website',
    },
}

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                    integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />
            </head>
            <body className="font-sans antialiased">
                <GoogleOAuthProvider clientId={process.env.NEXT_APP_GOOGLE_CLIENT_ID}>
                <StoreProvider>
                    <SocketProvider>
                    <Toast/>
                    {children}
                    <Analytics/>
                    </SocketProvider>
                </StoreProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    )
}