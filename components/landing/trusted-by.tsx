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
      </div>
    </section>
  )
}
