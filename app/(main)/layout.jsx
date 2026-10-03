import '.././globals.css'
import { Navbar } from '../../components/landing/navbar'
export default function RootLayout({ children }) {
return (
        <div className="font-sans antialiased min-h-screen">
                <Navbar/>
                {children}
        </div>
)
}