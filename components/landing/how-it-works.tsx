import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { Handshake, Search, UserPlus, Wallet } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description:
      'Sign up in under a minute and build a profile that shows off your skills or your hiring needs.',
  },
  {
    icon: Search,
    title: 'Post or Find Jobs',
    description:
      'Post a brief or let AI matching recommend the ideal projects and people for you.',
  },
  {
    icon: Handshake,
    title: 'Collaborate',
    description:
      'Chat, share files, and track milestones together in one shared workspace.',
  },
  {
    icon: Wallet,
    title: 'Get Paid Securely',
    description:
      'Funds are held in escrow and released the moment work is approved.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="How it works"
          title="Get started in four simple steps"
          description="From sign-up to payday, FreelanceHub keeps the whole journey smooth and secure."
        />

        <div className="relative mt-16">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block"
          />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 120}>
                <div className="relative text-center lg:text-left">
                  <div className="flex items-center justify-center gap-4 lg:justify-start">
                    <span className="relative z-10 inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                      <step.icon className="size-6" />
                      <span className="absolute -right-1.5 -top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
