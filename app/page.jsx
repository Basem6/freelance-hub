import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import Promote  from "@/components/landing/Promote";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Footer } from "@/components/landing/footer";
export default function LandingPage() {
    return (
        <main>
        <Navbar></Navbar>
        <Hero></Hero>
        <TrustedBy></TrustedBy>
        <Promote></Promote>
        <Footer></Footer>
        </main>
    )
}
