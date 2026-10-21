import Link from 'next/link'
import { ArrowUpRight, MoveUp } from 'lucide-react'

const LINK_GROUPS = [
  {
    title: 'For freelancers',
    links: [
      { label: 'Browse projects', href: '/nx/search?type=jobs&sort=createdAt%3Aasc&page=1' },
      { label: 'Create a profile', href: '/choose-role' },
    ],
  },
  {
    title: 'For clients',
    links: [
      { label: 'Browse freelancers', href: '/nx/search' },
      { label: 'Post a project', href: '/nx/post-job' },
    ],
  },
  {
    title: 'Hemma',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Log in', href: '/login' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-black/90 text-font-primary">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
        <div className="grid gap-12 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight"
              aria-label="Hemma home"
            >
            
              HEMMA
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              Good work starts with the right people. Find your next project or
              build your next great team with Hemma.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hemma. Built for better work.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
          >
            Back to home
            <MoveUp aria-hidden="true" className="size-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
