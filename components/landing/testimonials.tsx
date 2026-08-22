'use client'

import { Reveal } from '@/components/landing/reveal'
import { SectionHeading } from '@/components/landing/section-heading'
import { Button } from '@/components/ui/button'
import { cn } from '../../app/lib/utils'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

const TESTIMONIALS = [
  {
    quote:
      'FreelanceHub completely changed how we staff projects. We found a designer in a day and shipped our rebrand two weeks early.',
    name: 'Olivia Bennett',
    role: 'Head of Product, Lumen',
    avatar: 1,
  },
  {
    quote:
      'The escrow payments and smart contracts give me total peace of mind. I have never felt more secure freelancing.',
    name: 'Marcus Reid',
    role: 'Full-Stack Engineer',
    avatar: 2,
  },
  {
    quote:
      'AI matching is scary good. Every freelancer it recommended was exactly the caliber we needed for our AI product.',
    name: 'Priya Nair',
    role: 'CTO, Vertex',
    avatar: 5,
  },
  {
    quote:
      'I doubled my income in six months. The portfolio builder and analytics helped me land bigger, better clients.',
    name: 'Diego Alvarez',
    role: 'Motion Designer',
    avatar: 4,
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = TESTIMONIALS.length

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = () => setIndex((i) => (i - 1 + count) % count)

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  return (
    <section className="bg-muted/30 py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeading
          eyebrow="Testimonials"
          title="Loved by freelancers and teams alike"
        />

        <Reveal delay={120}>
          <div className="relative mt-14 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {TESTIMONIALS.map((t) => (
                <figure
                  key={t.name}
                  className="w-full shrink-0 px-1"
                >
                  <div className="relative rounded-2xl border border-border/70 bg-card p-8 text-center shadow-lg shadow-primary/5 sm:p-10">
                    <Quote className="mx-auto size-8 text-primary/30" />
                    <div className="mt-4 flex justify-center gap-0.5 text-primary">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className="size-4 fill-current" />
                      ))}
                    </div>
                    <blockquote className="mt-5 text-balance text-lg font-medium leading-relaxed sm:text-xl">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center justify-center gap-3">
                      <img
                        src={`/avatars/avatar-${t.avatar}.png`}
                        alt=""
                        className="size-11 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            aria-label="Previous testimonial"
            className="rounded-full"
          >
            <ChevronLeft className="size-4" />
          </Button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all',
                  i === index
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-border hover:bg-muted-foreground/40',
                )}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={next}
            aria-label="Next testimonial"
            className="rounded-full"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
