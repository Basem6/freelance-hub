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

export const NAV_LINKS= [
    { label: 'Home', href: '/' },
    { label: 'Find work' },
    { label: 'Hire talent'},
    { label: 'Pricing', href: '/pricing' },
]
export const NAV_Mob_LINKS= [
    { label: 'Home', href: '/' },
    { label: 'Find work', href:"/nx/search?type=jobs&sort=createdAt%3Aasc&page=1" },
    { label: 'Hire talent', href:"/nx/search"},
    { label: 'Pricing', href: '/pricing' },
]
export const LINK_GROUPS = [
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