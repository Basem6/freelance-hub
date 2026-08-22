import { Reveal } from '@/components/landing/reveal'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '../../app/lib/utils'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  MessageSquare,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Btns from './Btns'
export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      {/* background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--foreground)_5%,transparent)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-8">
        {/* Left copy */}
        <div className="text-center lg:text-left">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="size-3.5 text-primary" />
              AI-powered talent matching
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Find Top Freelancers.{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Build Amazing Projects.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              FreelanceHub connects you with vetted professionals and gives you
              everything to hire, collaborate, and pay — all in one beautifully
              simple workspace.
            </p>
          </Reveal>

          <Btns></Btns>

          <Reveal delay={320}>
            <div className="mt-8 flex items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((n) => (
                  <img
                    key={n}
                    src={`/avatars/avatar-${n}.png`}
                    alt=""
                    className="size-8 rounded-full border-2 border-background object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className="size-3.5 fill-current" />
                  ))}
                </div>
                <span>Loved by 100K+ freelancers</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right dashboard illustration */}
        <Reveal delay={200} className="relative">
          <HeroDashboard />
        </Reveal>
      </div>
    </section>
  )
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* main dashboard card */}
      <div className="glass relative rounded-2xl border border-border/70 p-4 shadow-2xl shadow-primary/10">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-accent/60" />
            <span className="size-3 rounded-full bg-primary/60" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Dashboard
          </span>
        </div>

        <div className="rounded-xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Total earnings</p>
              <p className="mt-1 text-2xl font-semibold">$48,920</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <TrendingUp className="size-3" /> +24%
            </span>
          </div>

          {/* mini bar chart */}
          <div className="mt-4 flex h-24 items-end gap-2">
            {[42, 58, 35, 72, 50, 88, 64, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border/60 bg-card p-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Briefcase className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">32</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Active projects
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <BadgeCheck className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-none">98%</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Success rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* floating card: earnings */}
      <div className="absolute -left-6 top-16 hidden animate-[float_6s_ease-in-out_infinite] rounded-xl border border-border/70 bg-card p-3 shadow-xl shadow-primary/10 sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <TrendingUp className="size-4" />
          </span>
          <div>
            <p className="text-[11px] text-muted-foreground">This week</p>
            <p className="text-sm font-semibold">+$3,240</p>
          </div>
        </div>
      </div>

      {/* floating card: rating */}
      <div className="absolute -right-4 top-4 hidden animate-[float_7s_ease-in-out_infinite_reverse] rounded-xl border border-border/70 bg-card p-3 shadow-xl shadow-primary/10 sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Star className="size-4 fill-current" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">4.9</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              2,847 reviews
            </p>
          </div>
        </div>
      </div>

      {/* floating card: message */}
      <div className="absolute -bottom-6 right-8 hidden animate-[float_5.5s_ease-in-out_infinite] rounded-xl border border-border/70 bg-card p-3 shadow-xl shadow-primary/10 sm:block">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="size-4" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-none">New message</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Sarah sent a proposal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
