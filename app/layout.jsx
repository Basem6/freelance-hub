
import { GoogleOAuthProvider } from "@react-oauth/google";
import localFont from "next/font/local";
import "./globals.css";

import SocketProvider from "./providers/SocketProvider";
import AuthProvider from "./providers/AuthProvider";

import StoreProvider from "./lib/StoreProvider";
import { Analytics } from "@vercel/analytics/react";
import Toast from "../components/ui/Toast";



const BoldHeadinFont = localFont({
    src: [
        {
        path: "./fonts/SpaceGrotesk-SemiBold.ttf",
        weight: "600",
        style: "normal",
        },
    ],
    variable: "--font-Bold-Heading",
    display: "swap",
    });
export const metadata = {
    title: "Hemma",
    description: "Find Top Freelancers. Build Amazing Projects.",
    openGraph: {
        title: "Hemma",
        description: "Hire vetted freelancers and manage projects end to end",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={` ${BoldHeadinFont.variable}`}
            suppressHydrationWarning
        >
            <body className="font-sans antialiased" suppressHydrationWarning>
                <GoogleOAuthProvider
                    clientId={process.env.NEXT_APP_GOOGLE_CLIENT_ID}
                >
                    <StoreProvider>
                        <AuthProvider>
                            <SocketProvider>
                                <Toast />

                                {children}

                                <Analytics />
                            </SocketProvider>
                        </AuthProvider>
                    </StoreProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}