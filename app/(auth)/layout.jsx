import '.././globals.css'
import Link from 'next/link'
import Image from 'next/image'

export default function RootLayout({ children }) {
return (
        <div className="font-sans antialiased min-h-screen ">
                <nav className="fixed top-0 flex md:justify-start justify-center items-center md:bg-transparent bg-white  h-15 min-w-full">
                                <div className=" flex w-fit  items-center justify-between px-5 sm:px-8">
                                <Link href="/" aria-label="Hemma home" className="inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-4">
                                        <Image src="/logo.svg" alt="" width={32} height={32} priority />
                                        <span className="text-[21px] font-semibold">Hemma</span>
                                </Link>
                                </div>
                </nav>
                {children}
        </div>
)
}