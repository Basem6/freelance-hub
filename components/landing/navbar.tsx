'use client'
import {NAV_LINKS} from "@/app/lib/constants/NavItems"
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '../../app/lib/utils'
import {  Menu, X  ,ChevronDown} from 'lucide-react'
import {  useState } from 'react'
import Link from "next/link";

export function Navbar() {  
const [open, setOpen] = useState(false)
return (
  <header className="fixed bg-primary min-w-full inset-x-0 top-0 z-50 pt-1.5 rounded-b-lg">
    <div
      className={cn('flex w-full px-2   md:px-4xl items-center justify-between rounded-2xl  py-2  transition-all duration-300')}
    >
      <a href="#" className="flex items-center w-fit" aria-label="FreelanceHub home">
        <span className="text-lg font-semibold tracking-tight font-sans text-font-primary">HEMMA</span>
      </a>

      <nav className="hidden text-font-primary  w-fit items-center gap-1 md:flex" aria-label="Primary">
        {NAV_LINKS.map((link, index) => {
          const hasDropdown = index === 1 || index === 2;
          return (
            <div
              key={link.href}
              className="relative group"
            >
              <a
                href={link.href}
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium   duration-300"
              > 
                <div className="flex items-center gap-1.5">
                  <span className="mr-1">{link.label}</span>
                  {hasDropdown &&
                  <span className="group-hover:rotate-180 transition-transform duration-300"><ChevronDown className={"text-font-primary group-hover:opacity-40 transition-opacity duration-300"}  strokeWidth={1.3} size={17}/></span>
                  }
                </div>
                

                {hasDropdown && (
                  <i className="fa-solid fa-angle-down text-xs text-gray-500 dark:text-gray-500 duration-300 group-hover:-rotate-180 group-hover:text-black dark:group-hover:text-white" />
                )}
              </a>

              {/* Find Work Dropdown */}
              {index === 1 && (
                <div className="absolute top-full right-0 z-50 hidden w-60 rounded-lg bg-white text-black shadow-lg group-hover:block">
                  <ul className="flex flex-col">
                    <li className="rounded-t-md hover:bg-gray-100">
                      <a
                        href="/findwork"
                        className="flex items-center gap-3 px-4 py-2"
                      >
                        <p className="text-sm">Browse Projects</p>
                      </a>
                    </li>

                    <li className="flex cursor-pointer items-center gap-3 px-4 py-2 hover:bg-gray-100">
                      <p className="text-sm">Saved Jobs</p>
                    </li>

                    <li className="flex cursor-pointer items-center gap-3 border-b border-gray-200 px-4 py-2 hover:bg-gray-100">
                      <p className="text-sm">Proposals and offers</p>
                    </li>

                    <li className="flex cursor-pointer items-center gap-3 rounded-b-md px-4 py-2 hover:bg-gray-100">
                      <p className="text-sm">Completed Jobs</p>
                    </li>
                  </ul>
                </div>
              )}

              {/* Hire Dropdown */}
              {index === 2 && (
                <div className="absolute top-full right-0 z-50 hidden w-60 rounded-lg bg-white text-black shadow-lg group-hover:block">
                  <ul className="flex flex-col">
                    <li className="rounded-t-md hover:bg-gray-100">
                      <a
                        href="/freelancers"
                        className="flex items-center gap-3 px-4 py-2"
                      >
                        <p className="text-sm ">
                          Browse Freelancers
                        </p>
                      </a>
                    </li>

                    <li className="flex cursor-pointer items-center gap-3 border-t border-gray-100 px-4 py-2 hover:bg-gray-100">
                      <p className="text-sm">Active contracts</p>
                    </li>

                    <li className="flex cursor-pointer items-center gap-3 rounded-b-md px-4 py-2 hover:bg-gray-100">
                      <p className="text-sm">All contracts</p>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center  w-fit  gap-0.5 text-font-primary">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hidden h-9 px-3.5 sm:inline-flex ',
          )}
        >
          Log in
        </Link>
        <Link
          href="/choose-role"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'hidden h-9 px-4 text-primary bg-font-primary  sm:inline-flex',
          )}
          
        >
          Sign up
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>
    </div>

    {open && (
      <div className="mx-auto mt-2 max-w-6xl md:hidden">
        <div className="glass flex flex-col gap-1 rounded-2xl border border-border/60 p-3 shadow-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-1 flex gap-2 border-t border-border/60 pt-3">
            <Link
              href="/choose-role"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-9 flex-1')}
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: 'default' }), 'h-9 flex-1')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    )}
  </header>
)
}
