import {
Briefcase,
MessageSquare,
DollarSign,
Bell,
Search,
House,
} from 'lucide-react';

export const ClientNavItems = (notifications = []) => [
{ id: 'search', label: 'Search', icon: Search },
{ id: 'home', label: 'Home', icon: House, href: '/nx/client/dashboard' },
{ id: 'notifications', label: 'Notifications', icon: Bell },
{
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    href: '/messages',
    badge: notifications.length,
},
];

export const FreelancerNavItems = (notifications = []) => [
{ id: 'search', label: 'Search', icon: Search },
{ id: 'home', label: 'Home', icon: House, href: '/nx/findwork' },
{ id: 'notifications', label: 'Notifications', icon: Bell },
{ id: 'Proposals', label: 'Proposals', icon: Briefcase, href: '/my-offers' },
{ id: 'earnings', label: 'Earnings', icon: DollarSign, href: '/earnings' },
{
    id: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    href: '/messages',
    badge: notifications.length,
},
];

