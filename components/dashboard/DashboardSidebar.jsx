'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Briefcase, MessageSquare, DollarSign, Settings,House,LogOut, CircleUserRound, FolderOpen, Users, Menu, X, PanelLeftClose } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/lib/hooks';
import { logout } from '../../app/lib/Features/authSlice';
import api from '../../app/utils/api';
import { useSocketContext } from "../../app/providers/SocketProvider"
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function DashboardSidebar({ activePage = 'dashboard' }) {
    const sidebarRef = useRef();
    const logoPanelRef = useRef();
    const linksContainerRef = useRef();
    
    const pathname = usePathname();
    const { notifications, setNotifications } = useSocketContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();

    const clientNavItems = [
        { id: 'profile', label: 'My Profile', icon: CircleUserRound, href: '/profile' },
        { id: 'projects', label: 'My Projects', icon: Briefcase, href: '/projects' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', badge: notifications.length },
        { id: 'hire', label: 'Find Freelancers', icon: Users, href: '/freelancers' },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
    ];

    const freelancerNavItems = [
        { id: 'profile', label: 'My Profile', icon: CircleUserRound, href: '/profile' },
        { id: 'home', label: 'Home', icon: House, href: '/' },
        { id: 'Propoals', label: 'Propoals', icon: Briefcase, href: '/my-offers' },
        { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages', badge: notifications.length },
        { id: 'earnings', label: 'Earnings', icon: DollarSign, href: '/earnings' },
        { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
    ];

    const navItems = user?.role === 'client' ? clientNavItems : freelancerNavItems;

    useEffect(() => {
        if (pathname.startsWith("/messages")) {
            setNotifications([]);
        }
    }, [pathname, setNotifications]);

    const isActive = (item) => {
        return pathname === item.href || activePage === item.id;
    };

    const handleToggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        setIsLogoHovered(false);

        if (newState) {
            // Collapse
            gsap.to(sidebarRef.current, { width: 60, duration: 0.7 });
            gsap.to(".link-text", { opacity: 0, duration: 0.1 });
            gsap.to(".link-badge", { opacity: 0, duration: 0.1 });
            gsap.to(logoPanelRef.current, { x: -10, opacity: 0, duration: 0.1 });
        } else {
            // Expand
            gsap.to(sidebarRef.current, { width: 260, duration: 0.7 });
            gsap.to(".link-text", { opacity: 1, duration: 0.4 });
            gsap.to(".link-badge", { opacity: 1, duration: 0.4 });
            gsap.to(logoPanelRef.current, { x: 0, opacity: 1, duration: 0.1 });
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {
                withCredentials: true,
            });
            router.push("/");
            setTimeout(() => {
                dispatch(logout());
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                type="button"
                aria-label="Open dashboard navigation"
                aria-expanded={isMobileOpen}
                onClick={() => setIsMobileOpen(true)}
                className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-700 shadow-md ring-1 ring-gray-200 md:hidden"
            >
                <Menu size={21} />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard navigation"
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-gray-900/30 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`z-50 flex sticky left-0 top-0 min-h-screen w-64 flex-col gap-2 overflow-y-auto overflow-x-hidden bg-gray-100 transition-transform duration-300 ${
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}
            >
                {isCollapsed?
                <div className="flex  items-center justify-between gap-3 border-b border-gray-100 px-3 py-4 min-w-full">
                    <div
                        className="relative h-[37px] w-[37px] group"
                        onMouseEnter={() => setIsLogoHovered(true)}
                        onMouseLeave={() => setIsLogoHovered(false)}
                    >
                        {/* Logo Image */}
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={37}
                            height={37}
                            className={`absolute inset-0 min-w-[37px] transition-all duration-300 ${
                                isLogoHovered ? 'opacity-0' : 'opacity-100'
                            }`}
                        />

                        {/* Collapse/Expand Button */}
                        <button
                            onClick={handleToggleSidebar}
                            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                                isLogoHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <PanelLeftClose
                                className="cursor-pointer text-gray-500 hover:text-orange-400 transition-colors"
                                strokeWidth={0.5}
                                size={24}
                            />
                        </button>

                        {/* Tooltip */}
                        {/* <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {isCollapsed ? 'Expand' : 'Collapse'}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                        </div> */}
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
                <div className="flex  items-center justify-between gap-3 border-b border-gray-100 px-3 py-4 min-w-full">
                <div className='relative h-[37px] w-[37px] group'
                >
                    <Image
                        src="/logo.svg"
                        alt="logo"
                        width={37}
                        height={37}
                        className='absolute inset-0 min-w-[37px] transition-all duration-300'
                    />
                </div>

                {/* Panel Icon */}
                <button
                    onClick={handleToggleSidebar}
                    className={` flex items-center justify-center transition-opacity duration-200`}
                >
                    <PanelLeftClose
                        className="cursor-pointer text-gray-500 hover:text-orange-400"
                        strokeWidth={0.5}
                    />
                </button>

                </div>
                }

                {/* Navigation Items */}
                <nav ref={linksContainerRef} className="flex-1 flex flex-col gap-1 px-3 py-4 ">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        return (
                            <Link key={item.id} href={item.href} onClick={() => setIsMobileOpen(false)}>
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.15 }}
                                    className={`w-full flex items-center relative space-x-3  py-2.5 rounded-xl transition-all duration-200 cursor-pointer group ${
                                        active
                                            ? 'bg-orange-50 text-[#FF7A00]'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon
                                        size={22}
                                        strokeWidth={1.2}
                                        className={`shrink-0 mx-2 group-hover:-rotate-12 duration-300 transition-transform ${
                                            active ? 'text-[#FF7A00]' : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                    />
                                    <span
                                        className={`link-text whitespace-nowrap font-medium text-sm flex-1 ${
                                            active ? 'text-[#FF7A00]' : ''
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    {item.badge > 0 && (
                                        <span className="link-badge bg-[#FF7A00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center transition-transform duration-300">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="border-t border-gray-200 px-3 py-4">
                    <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                        <LogOut
                            size={18}
                            className="shrink-0 group-hover:-rotate-12 duration-300 transition-transform"
                        />
                        <span className="link-text whitespace-nowrap font-medium text-sm flex-1">
                            Logout
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}