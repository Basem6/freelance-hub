import { FreelancerShowcase } from "@/components/landing/freelancer-showcase";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import { Testimonials } from "@/components/landing/testimonials";
import { TrustedBy } from "@/components/landing/trusted-by";
import { Footer } from "@/components/landing/footer";
export default function LandingPage() {
    return (
        <main>
        <Navbar></Navbar>
        <Hero></Hero>
        <TrustedBy></TrustedBy>
        {/* <Testimonials></Testimonials> */}
        <Footer></Footer>
        </main>
    )
}
