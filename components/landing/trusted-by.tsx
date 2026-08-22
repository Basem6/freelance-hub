import { Reveal } from '@/components/landing/reveal'

const COMPANIES = [
  'Northwind',
  'Lumen',
  'Vertex',
  'Skyline',
  'Cobalt',
  'Everly',
  'Quantum',
  'Meridian',
]

const STATS = [
  { value: '100K+', label: 'Freelancers' },
  { value: '15K+', label: 'Clients' },
  { value: '1M+', label: 'Completed Projects' },
  { value: '4.9/5', label: 'Average Rating' },
]

export function TrustedBy() {
  return (
    <section className="border-y border-border/60 bg-muted/30 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Trusted by fast-growing teams worldwide
          </p>
        </Reveal>

        {/* logos marquee */}
        <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-12 pr-12 group-hover:[animation-play-state:paused]">
            {[...COMPANIES, ...COMPANIES].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* stats */}
        <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 80}>
              <div className="text-center">
                <p className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
