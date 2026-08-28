import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '../../../app/lib/utils'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    description: 'For freelancers just getting started.',
    features: [
      'Up to 5 active proposals',
      'Basic profile & portfolio',
      'Built-in chat',
      'Standard payment protection',
    ],
    cta: 'Start for free',
    highlighted: false,
  },
  {
    name: 'Pro',
    monthly: 24,
    yearly: 19,
    description: 'For professionals who want to grow.',
    features: [
      'Unlimited proposals',
      'AI job matching',
      'Smart contracts & e-signing',
      'Analytics dashboard',
      'Lower platform fees',
      'Priority support',
    ],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    monthly: 89,
    yearly: 79,
    description: 'For agencies and larger teams.',
    features: [
      'Everything in Pro',
      'Team workspaces & roles',
      'Dedicated account manager',
      'Custom contracts & SLAs',
      'SSO & advanced security',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
]

export default function page() {
  return (
    <section id="pricing" className="flex items-center mt-10 min-h-screen ">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          description="Start free and upgrade as you grow. No hidden fees, cancel anytime."
        />
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const price =  plan.monthly
            return (
              <Reveal key={plan.name} delay={i * 100}>
                <div
                  className={cn(
                    'relative flex h-full flex-col rounded-2xl border bg-card p-7 transition-all duration-300',
                    plan.highlighted
                      ? 'border-primary/60 shadow-2xl shadow-primary/15 lg:-translate-y-3'
                      : 'border-border/70 hover:border-primary/30 hover:shadow-lg',
                  )}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">
                      ${price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {price === 0 ? 'forever' : '/mo'}
                    </span>
                  </div>

                  <a
                    href="#"
                    className={cn(
                      buttonVariants({
                        variant: plan.highlighted ? 'default' : 'outline',
                      }),
                      'mt-6 h-11 w-full text-sm',
                      plan.highlighted && 'shadow-lg shadow-primary/30',
                    )}
                  >
                    {plan.cta}
                  </a>

                  <ul className="mt-7 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Check className="size-3" />
                        </span>
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
