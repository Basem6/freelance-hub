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