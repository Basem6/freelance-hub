import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '../../app/lib/utils'
import { BadgeCheck, Star } from 'lucide-react'

const FREELANCERS = [
  {
    name: 'Sarah Chen',
    role: 'Senior Product Designer',
    avatar: 3,
    skills: ['UI/UX', 'Figma', 'Design Systems'],
    rate: '$85',
    rating: '4.9',
    jobs: 214,
  },
  {
    name: 'Marcus Reid',
    role: 'Full-Stack Engineer',
    avatar: 2,
    skills: ['React', 'Node.js', 'AWS'],
    rate: '$95',
    rating: '5.0',
    jobs: 178,
  },
  {
    name: 'Priya Nair',
    role: 'AI/ML Specialist',
    avatar: 5,
    skills: ['Python', 'LLMs', 'PyTorch'],
    rate: '$120',
    rating: '4.9',
    jobs: 96,
  },
  {
    name: 'Diego Alvarez',
    role: 'Brand & Motion Designer',
    avatar: 4,
    skills: ['Branding', 'After Effects', '3D'],
    rate: '$70',
    rating: '4.8',
    jobs: 152,
  },
  {
    name: 'Emma Wilson',
    role: 'Growth Marketer',
    avatar: 1,
    skills: ['SEO', 'Paid Ads', 'Analytics'],
    rate: '$65',
    rating: '4.9',
    jobs: 203,
  },
  {
    name: 'Liam Foster',
    role: 'Mobile Developer',
    avatar: 6,
    skills: ['Swift', 'Kotlin', 'Flutter'],
    rate: '$90',
    rating: '5.0',
    jobs: 131,
  },
]

export function FreelancerShowcase() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          eyebrow="Top talent"
          title="Meet freelancers clients love"
          description="Hand-picked professionals with proven track records, ready to start on your next project."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FREELANCERS.map((f, i) => (
            <Reveal key={f.name} delay={(i % 3) * 100}>
              <article className="group h-full rounded-2xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={`/avatars/avatar-${f.avatar}.png`}
                      alt={`${f.name} profile photo`}
                      className="size-14 rounded-full object-cover ring-2 ring-border"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 inline-flex size-5 items-center justify-center rounded-full bg-card text-primary">
                      <BadgeCheck className="size-5 fill-primary/15" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="flex items-center gap-1.5 truncate text-base font-semibold tracking-tight">
                      {f.name}
                    </h3>
                    <p className="truncate text-sm text-muted-foreground">
                      {f.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="size-4 fill-primary text-primary" />
                    <span className="font-medium">{f.rating}</span>
                    <span className="text-muted-foreground">
                      ({f.jobs} jobs)
                    </span>
                  </div>
                  <span className="font-semibold">
                    {f.rate}
                    <span className="text-xs font-normal text-muted-foreground">
                      /hr
                    </span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <a
            href="/freelancers"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'h-11 px-6 text-sm',
            )}
          >
            Browse all talent
          </a>
        </Reveal>
      </div>
    </section>
  )
}
