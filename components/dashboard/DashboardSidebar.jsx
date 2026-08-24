'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
    Briefcase, MessageSquare, DollarSign, Settings, LogOut, 
    CircleUserRound, FolderOpen, ChevronRight, Users, Menu, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/lib/hooks';
import { logout } from '../../app/lib/Features/authSlice';
import api from '../../app/utils/api';

export default function DashboardSidebar({ activePage = 'dashboard' }) {
    
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const dispatch = useAppDispatch()
    const user = useAppSelector((state)=> state.auth.user)
    const router = useRouter();
    
    const clientNavItems = [
        { id: 'profile',    label: 'My Profile',  icon: CircleUserRound,  href: '/profile' },
        { id: 'projects',   label: 'My Projects',    icon: Briefcase,        href: '/projects' },
        { id: 'messages',   label: 'Messages',    icon: MessageSquare,    href: '/messages', badge: 3 },
        { id: 'hire',       label: 'Find Freelancers', icon: Users,       href: '/freelancers' },
        { id: 'settings',   label: 'Settings',    icon: Settings,         href: '/settings' },
    ];

    const freelancerNavItems = [
        { id: 'profile',    label: 'My Profile',  icon: CircleUserRound,  href: '/profile' },
        { id: 'works',      label: 'My Works',    icon: FolderOpen,       href: '/my-works' },
        { id: 'offers',   label: 'My Offers',    icon: Briefcase,        href: '/my-offers' },
        { id: 'messages',   label: 'Messages',    icon: MessageSquare,    href: '/messages', badge: 3 },
        { id: 'earnings',   label: 'Earnings',    icon: DollarSign,       href: '/earnings' },
        { id: 'settings',   label: 'Settings',    icon: Settings,         href: '/settings' },
    ];

    const navItems = user?.role === 'client' ? clientNavItems : freelancerNavItems;

    const isActive = (item) => {
        if (pathname === item.href) return true;
        if (activePage === item.id) return true;
        return false;
    };
    const handlelogout = async () => {
        try {
            await api.post("/api/auth/logout", {}, {
                withCredentials: true,
            });
             // امسح بيانات المستخدم من Redux
            router.push("/");
            setTimeout(() => {
                dispatch(logout());
            }, 500);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <button
                type="button"
                aria-label="Open dashboard navigation"
                aria-expanded={isMobileOpen}
                onClick={() => setIsMobileOpen(true)}
                className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-gray-700 shadow-md ring-1 ring-gray-200 md:hidden"
            >
                <Menu size={21} />
            </button>

            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close dashboard navigation"
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-gray-900/30 md:hidden"
                />
            )}

        <aside className={`fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[85vw] flex-col overflow-y-auto border-r border-gray-100 bg-white shadow-xl transition-transform duration-200 md:z-auto md:w-64 md:translate-x-0 md:shadow-none ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
            {/* Logo */}
            <div className="p-6 flex items-center space-x-3 border-b border-gray-50">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF7A00] to-orange-400 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-orange-200">
                    FH
                </div>
                <div>
                    <span className="font-bold text-xl text-gray-900 tracking-tight">{user?.role[0] + user?.role.slice(1)} Hub</span>
                    {user?.role && (
                        <p className="text-xs text-gray-500 uppercase tracking-[0.18em] mt-1">{user.role}</p>
                    )}
                </div>
                <button
                    type="button"
                    aria-label="Close dashboard navigation"
                    onClick={() => setIsMobileOpen(false)}
                    className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>
            
            {/* Nav links */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <Link key={item.id} href={item.href} onClick={() => setIsMobileOpen(false)}>
                            <motion.div
                                whileHover={{ x: 2 }}
                                transition={{ duration: 0.15 }}
                                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer group relative ${
                                    active 
                                    ? 'bg-orange-50 text-[#FF7A00]' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent'
                                }`}
                            >
                                <Icon 
                                    size={18} 
                                    className={`shrink-0 ${active ? 'text-[#FF7A00]' : 'text-gray-400 group-hover:text-gray-600'}`} 
                                />
                                <span className={`font-medium text-sm flex-1 ${active ? 'text-[#FF7A00]' : ''}`}>
                                    {item.label}
                                </span>
                                {item.badge && (
                                    <span className="bg-[#FF7A00] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                        {item.badge}
                                    </span>
                                )}
                                {active && (
                                    <ChevronRight size={14} className="text-[#FF7A00] opacity-60" />
                                )}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            {user && (
                <div className="p-4 border-t border-gray-100">
                    <Link href="/" onClick={() => setIsMobileOpen(false)}>
                        <div className="flex items-center space-x-3 mb-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                            <img 
                                src={user?.image || "/avatars/avatar-1.png"}   
                                alt={user?.fullName || 'User'} 
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-100" 
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'User Name'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                            </div>
                        </div>
                    </Link>
                    <button 
                        onClick={handlelogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100"
                    >
                        <LogOut size={15} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            )}
        </aside>
        </>
    );
}
