'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TextAlignEnd, X, PanelLeftClose,ChevronRight } from 'lucide-react';
import {  useAppSelector } from '../../app/lib/hooks';
import { useSocketContext } from "../../app/providers/SocketProvider"
import Image from 'next/image';
import gsap from 'gsap';
import  { registerOutsideClick, unregisterOutsideClick } from '@/app/hooks/ClickOutside'
import ProfileNav from './ProfileNav';
import { ClientNavItems, FreelancerNavItems } from '../../app/lib/constants/NavItems';
import { usePathname } from 'next/navigation';

export default function DashboardSidebar() {
    const [activeMenu,setActiveMenu]=useState("")
    const sidebarRef = useRef();
    const logoPanelRef = useRef();
    const nav1Ref = useRef(null)
    const [active , setActive]=useState(null)
    const activeIconRef = useRef(null);
    const pathname = usePathname();
    const { notifications, setNotifications } = useSocketContext();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const user = useAppSelector((state) => state.auth.user);
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
    
    const navItems = user?.role === 'client' ?  ClientNavItems(notifications) : FreelancerNavItems(notifications);

    useEffect(() => {
        if (pathname.startsWith("/messages")) {
            setNotifications([]);
        }
    }, [pathname, setNotifications]);

    const handleToggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        setIsLogoHovered(false);

        if (newState) {
            // Collapse
            gsap.to(sidebarRef.current, { width: 50, duration: 0.3 });
            gsap.to(".link-text", { opacity: 0, duration: 0.1 });
            gsap.to(".link-badge", { opacity: 0, duration: 0.1 });
            gsap.to(logoPanelRef.current, { x: -10, opacity: 0, duration: 0.1 });
        } else {
            // Expand
            gsap.to(sidebarRef.current, { width: 260, duration: 0.3 });
            gsap.to(".link-text", { opacity: 1, duration: 0.4 });
            gsap.to(".link-badge", { opacity: 1, duration: 0.4 });
            gsap.to(logoPanelRef.current, { x: 0, opacity: 1, duration: 0.1 });
        }
    };
    
    function handleanimation(e) {
        if (activeIconRef.current) {
            activeIconRef.current.classList.remove("nav-link");
        }

        const icon = e.currentTarget.children[0];
        icon.classList.add("nav-link");

        activeIconRef.current = icon;
    }
    return (
        <>
        <div className="navMob md:hidden   fixed justify-between min-w-full h-14 bg-white items-center px-4 border-b border-gray-400/60 pb-2  flex z-50 ">
            <div className="logo relative">
                <Image
                        src="/logo.svg"
                        alt="logo"
                        width={30}
                        height={30}
                        className={`
                        `}
                />
            </div>
            <button
            type="button"
            aria-label="Open dashboard navigation"
            aria-expanded={isMobileOpen}
            onClick={() => setIsMobileOpen(true)}
            className="  flex h-11 w-11 items-center justify-center   text-gray-700  md:hidden"
        >
        
            <TextAlignEnd  size={21} />
        </button>
        </div>
        <div className={`top-0 left-0 relative z-9999`}>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard navigation"
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-50 bg-gray-900/30 md:hidden"
                />
            )}
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`z-9999 fixed md:sticky left-0 top-0 min-h-screen w-65  md:w-12.5 flex-col gap-2 overflow-x-hidden overflow-y-auto  bg-gray-100 transition-transform duration-300 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {isCollapsed?
                <div className="flex  items-center justify-between gap-3 border-b border-gray-100 px-2.5 py-4 min-w-full">
                    <div
                        className="relative size-7.5 group"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        {/* Logo Image */}
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={30}
                            height={30}
                            className={`absolute inset-0 min-w-[30px] transition-all duration-300 ${
                                isLogoHovered ? 'opacity-0' : 'opacity-100'
                            }`}
                        />

                        {/* Collapse/Expand Button */}
                        <button
                            onClick={handleToggleSidebar}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className={`absolute md:flex hidden inset-0  items-center justify-center transition-all duration-300 ${
                                isLogoHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <PanelLeftClose
                                className="cursor-pointer text-gray-500 hover:text-orange-400 transition-colors"
                                strokeWidth={0.5}
                                size={24}
                            />
                        </button>

                    </div>

                    {/* Mobile Close Button */}
                    <button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={() => setIsMobileOpen(false)}
                        className="md:hidden text-gray-600 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>:
                <div className="flex  items-center justify-between gap-3 border-b border-gray-100 px-2.5 py-4 min-w-full">
                <div className='relative size-7.5 group'
                >
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={30}
                        height={30}
                        className={`absolute inset-0 min-w-[30px] transition-all duration-300 ${
                            isLogoHovered ? 'opacity-0' : 'opacity-100'
                        }`}
                    />
                </div>

                {/* Panel Icon */}
                <button
                    onClick={handleToggleSidebar}
                    className={`md:flex hidden items-center justify-center transition-opacity duration-200`}
                >
                    <PanelLeftClose
                        className="cursor-pointer text-gray-500 hover:text-orange-400"
                        strokeWidth={0.5}
                    />
                </button>

                </div>
                }
                <div className="relative flex gap-3 items-center  px-3  text-gray-800 hover:bg-gray-300/60  py-2.5 rounded-md transition-all duration-200 hover:text-gray-900 cursor-pointer" onClick={() => {setIsMobileOpen(false); openNav(nav1Ref, "profile")}}>
                    <div className='size-6.5 shrink-0 rounded-full overflow-hidden '>
                        <Image
                        src={user?.image || "/avatars/avatar-1.png"}
                        alt="User photo"
                        width={90}
                        height={90}
                        quality={30}
                        className="object-cover rounded-full"
                    />
                    
                    </div>
                    <div className='flex w-full link-text  justify-between items-center'>
                        <div className='flex flex-col gap-0.5 flex-1'>
                            <div className='text-sm font-semibold leading-3.5 whitespace-nowrap'>{user?.fullName}</div>
                            <div className='text-gray-400 text-xs tracking-wide whitespace-nowrap'>{user?.role[0].toUpperCase()}{user?.role.slice(1)} Basic</div>
                        </div>
                        <div><ChevronRight size={20} strokeWidth={1} /></div>
                    </div>
                </div>
                {/* Navigation Items */}
                <nav  className="flex-1 flex flex-col gap-1 px-1.5 py-4 ">
                    {navItems.map((item , ind) => {
                        const Icon = item.icon;
                        return (
                            <Link key={item.id} href={item.href||""} onClick={() =>{setActive(ind); setIsMobileOpen(false)}}>
                                <div
                                    
                                    onMouseMove={(e)=>handleanimation(e)}
                                    
                                    className={`w-full flex items-center relative gap-1.5   py-2.5 rounded-md transition-all duration-200 cursor-pointer group ${
                                        active===ind
                                            ? 'bg-gray-300/50 text-gray-700'
                                            : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className=''>
                                    <Icon
                                        size={20}
                                        strokeWidth={1}

                                        className={`shrink-0 mx-2  duration-300 transition-transform ${
                                            active ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-600'
                                        }`}
                                    />
                                    </div>
                                    <span
                                        className={`link-text md:opacity-0 whitespace-nowrap font-medium text-sm flex-1 ${
                                            active ? 'text-gray-900' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    {item.badge > 0 && (
                                        <span className="link-badge bg-[#FF7A00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition-transform duration-300">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            {activeMenu==="profile" && <ProfileNav nav1Ref={nav1Ref} ></ProfileNav> }
        </div>
        </>
    );
}