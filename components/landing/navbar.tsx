'use client'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '../../app/lib/utils'
import {  Menu, Sun, X } from 'lucide-react'
import Image from "next/image";
import { useRef, useEffect, useState, useCallback  } from 'react'
import Link from "next/link";
import { useSocketContext } from '../../app/providers/SocketProvider';
import { useAppDispatch, useAppSelector } from '@/app/lib/hooks'
import { logout, setUser } from '@/app/lib/Features/authSlice'
import { useRouter } from "next/navigation";
import api from '../../app/utils/api'
import gsap from "gsap";
import  { registerOutsideClick, unregisterOutsideClick } from '@/app/hooks/ClickOutside'
import { Search, Bell,  TrendingUp , Settings , BadgeQuestionMark, CircleUserRound , LogOut } from "lucide-react";

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Find Work', href: '/findwork' },
  { label: 'Hire talent', href: '/hire' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Messages', href: '/messages' },
]

export function Navbar() { 
const { notifications } = useSocketContext(); 
console.log(notifications)
const [activeMenu, setActiveMenu] = useState(null);
const nav1Ref = useRef(null);
const nav2Ref = useRef(null);
const nav3Ref = useRef(null);
const router = useRouter();
const [open1, setOpen1] = useState(false);
const {user}= useAppSelector((state) => {
  return state.auth;
});
const dispatch = useAppDispatch();
useEffect(() => {
  
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
    fetch('/api/auth/google', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        code,
        redirectUri: window.location.origin
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("##########")
        console.log(data)
        if (data.isNewUser) {
            console.log('📝 New user detected, redirecting to choose role...');
            
            // Store Google data temporarily for the choose-role page
            sessionStorage.setItem(
                'googleData',
                JSON.stringify(data.googleData)
            );
            //f

            router.push('/choose-role');
            return;
        }
        if (data.success && !data.isNewUser ) {
        dispatch(setUser(data.user));
        window.history.replaceState({}, '', '/');
        }
    }).catch((error)=>{
      console.log(error)
    })
    }
}, []);
//gsap
const openNav = (ref, id) => {
  
  if (activeMenu === id) return;

  setActiveMenu(id);

  requestAnimationFrame(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3 }
    );
  });

  registerOutsideClick(ref, () => closeNav(ref, id));
};

const closeNav = (ref, id) => {
  gsap.to(ref.current, {
    opacity: 0,
    y: 10,
    duration: 0.3,
    onComplete: () => {
      setActiveMenu((prev) => (prev === id ? null : prev));
      unregisterOutsideClick();
    },
  });
};

// scrolled state to add shadow to navbar on scroll
console.log(user)
const [scrolled, setScrolled] = useState(false)
const [open, setOpen] = useState(false)
useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 12)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])
const handleLogout = async () => {
    try {
        await api.post("/api/auth/logout", {}, {
            withCredentials: true,
        });
        dispatch(logout()); // امسح بيانات المستخدم من Redux
        router.push("/");
    } catch (error) {
        console.log(error);
    }
};
return (
  <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
    <div
      className={cn(
        'mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-transparent px-4 py-2.5 transition-all duration-300 sm:px-5',
        scrolled
          ? 'glass border-border/60 shadow-lg shadow-primary/5'
          : 'bg-transparent',
      )}
    >
      <a href="#" className="flex items-center gap-2" aria-label="FreelanceHub home">
        
        <span className="text-lg font-semibold tracking-tight font-sans">HEMMA</span>
      </a>

      <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
        {NAV_LINKS.map((link, index) => {
          const hidden =
            (index === 3 && user) ||
            (index === 4 && !user);

          if (hidden) return null;

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
                <span className="mr-1">{link.label}</span>

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
                        <p className="text-sm font-semibold text-[#FF7A00]">
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

      {!user?
      <div className="flex items-center gap-1.5">
        {/* <ThemeToggle /> */}
        <Link
          href="/choose-role"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'hidden h-9 px-3.5 sm:inline-flex',
          )}
        >
          Sign in
        </Link>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'hidden h-9 px-4 shadow-sm shadow-primary/30 sm:inline-flex',
          )}
        >
          Get Started
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
      </div>:
      <div className='flex gap-5 items-center'>
        <div className="relative cursor-pointer" onClick={() => openNav(nav2Ref, "help")}>
            <BadgeQuestionMark strokeWidth={1.2} />
          {activeMenu === "help"  &&
          <div className='absolute top-12 right-0 w-60 select-none bg-white rounded-lg shadow-lg group-hover:block' ref={nav2Ref}>
            <ul className='flex flex-col'>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-md flex gap-3 items-center '>
                  
                  <p className='text-sm '>Help Center</p>
              </li>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center'>
                  
                  <p className='text-sm '>Hemma Updates</p>
              </li>
              <li className='px-4 py-2 hover:bg-gray-100 rounded-b-md cursor-pointer flex gap-3 items-center  '>
              
                  <p className='text-sm '>Your Questions</p>
              </li>
            </ul>
          </div>
          }
        </div>
        <div className="relative xs:rounded-full select-none rounded-lg p-2 cursor-pointer w-8 h-10 flex items-center justify-center" onClick={() => openNav(nav3Ref, "notfication")}>
          <Bell
            strokeWidth={1.2}
            className="absolute bottom-2 right-0 select-none"
            
          />

          {activeMenu === "notfication" && (
            <div
              className="absolute select-none top-12 right-0 w-56 bg-white rounded-lg min-h-56 h-auto   shadow-lg z-50"
              ref={nav3Ref}
            >
              <ul
                className={`flex flex-col select-none  items-center min-h-56 ${
                  notifications.length === 0 ? "justify-center" : "justify-start"
                }`}
              >
                  {notifications.length > 0 ? (
                  <>
                    {notifications.slice(0, 4).map((element, index) => (
                      <li
                        key={element._id || index}
                        className={`py-2 hover:bg-gray-100 select-none min-w-full ${index===0 ?"rounded-t-lg":""} justify-center  flex gap-4 items-center`}
                      >
                        <span className="size-8 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={element.message?.sender?.image || "/avatars/avatar-1.png"}
                            alt={element.message?.sender?.fullName || "User"}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </span>

                        <p className="text-sm text-gray-700">
                          {element.message?.sender?.fullName
                            ? `${element.message.sender.fullName} sent a message`
                            : "You have a new notification"}
                        </p>
                      </li>
                    ))}

                    {/* يظهر فقط لو فيه أكتر من 4 */}
                    {notifications.length > 4 && (
                      <li
                        className="text-center py-2 text-sm text-orange-400 cursor-pointer hover:underline"
                        onClick={() => {
                          router.push("/messages")
                        }}
                      >
                        Load More
                      </li>
                    )}
                  </>
                ) : (
                  <li className="px-4 py-3 text-sm text-gray-500">
                    No notifications
                  </li>
                )}
              </ul>
            </div>
          )}

    <div
      className={`absolute top-2 -right-0 size-2 rounded-full bg-red-500 transition-all origin-center ${
        notifications.length === 0 ? "scale-0" : "scale-100"
      } duration-300`}
    />
        </div>
        <div className="relative">
          <div className='size-10 rounded-full overflow-hidden cursor-pointer' onClick={() => openNav(nav1Ref, "profile")}>
            <Image
            src={user?.image || "/avatars/avatar-1.png"}
            alt="User photo"
            width={200}
            height={200}
            className="object-cover h-full h-full object-center"
          />
          </div>
          {activeMenu ==="profile" &&
          <div className='absolute top-12 select-none right-0 w-60 bg-white rounded-lg shadow-lg group-hover:block' ref={nav1Ref}>
            <ul className='flex flex-col'>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-t-md flex gap-3 items-center'>
                <div className='size-8 rounded-full overflow-hidden'>
                  <Image
                  src={user.image?user.image:"/avatars/avatar-1.png"}
                  alt="userphoto"
                  width={200}
                  height={200}
                  className="object-cover h-full h-full object-center"
                />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {user.fullName}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {user.role}
                  </p>
              </div>
              </li>
              <Link href={`/profile`}>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center '>
                  <CircleUserRound strokeWidth={1.2} />
                  <p className='text-sm '>Your Profile</p>
              </li>
              </Link>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center  border-b border-gray-200'>
                  <TrendingUp strokeWidth={1.2} />
                  <p className='text-sm '>Stats and Trend</p>
              </li>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center  '>
                  <Sun strokeWidth={1.2} />
                  <p className='text-sm '>Themes</p>
              </li>
              <Link href={`/settings`}>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer flex gap-3 items-center  border-b border-gray-200'>
                <Settings strokeWidth={1.2} />
                  <p className='text-sm '>Account Settings</p>
              </li>
              </Link>
              <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-b-md flex gap-3 items-center' onClick={handleLogout}>
                <LogOut strokeWidth={1.2} />
                <p className='text-sm '>Logout</p>
              </li>
            
            </ul>
          </div>
          }
        </div>

      </div>
      } 
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
