import { Geist, Geist_Mono } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '.././globals.css'
import RootLayoutContent from '../../components/RootLayoutContent'

export default function RootLayout({ children }) {
return (
        <div className="font-sans antialiased min-h-screen">
                <RootLayoutContent>{children}</RootLayoutContent>
        </div>
)
}