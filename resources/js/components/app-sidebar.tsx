import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BarChart2, Book, BookOpen, Folder, HeartIcon, Home, Info, LayoutGrid, Settings, Settings2 } from 'lucide-react';
import AppLogo from './app-logo';
import type { SharedData } from '@/types'; // adjust path if needed
import { isAdmin, isDriver, isStaff } from '@/lib/utils';

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar({ bookingPackageName }: { bookingPackageName?: string }) {
    const { url, props } = usePage<SharedData>();
    const { auth } = props;
    const isBookingView = /^\/bookings\/\d+$/.test(url);
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);
    const isStaffs = isStaff(auth.user);

    const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: Book,
        children: [
            {
                title: 'Pending',
                href: '/bookings?status=pending',
            },
            {
                title: 'On Process',
                href: '/bookings?status=on_process',
            },
            {
                title: 'Accepted',
                href: '/bookings?status=accepted',
            },
            {
                title: 'Completed',
                href: '/bookings?status=completed',
            },
            {
                title: 'Cancelled',
                href: '/bookings?status=cancelled',
            },
        ],
    },
    // {
    //     title: 'Custom Trips',
    //     href: '/custom-trips',
    //     collapsable: true,
    //     icon: BookOpen,
    //     children: [
    //         {
    //             title: 'Pending',
    //             href: '/custom-trips?status=pending',
    //         },
    //         {
    //             title: 'On Process',
    //             href: '/custom-trips?status=on_process',
    //         },
    //         {
    //             title: 'Accepted',
    //             href: '/custom-trips?status=accepted',
    //         },
    //         {
    //             title: 'Cancelled',
    //             href: '/custom-trips?status=cancelled',
    //         },
    //     ],
    // },
    ...(!(isAdmins || isDrivers || isStaffs) ? [
        {
            title: 'Wishlist',
            href: '/wishlists',
            icon: HeartIcon,
        },
    ] : []),
    ...(!(isAdmins || isDrivers) ? [
        {
            title: 'About',
            href: '/dashboard/about',
            icon: Info,
            children: [
                {
                    title: 'Information',
                    href: '/dashboard/about',
                },
                {
                    title: 'Certifications',
                    href: '/certifications',
                },
                {
                    title: 'Terms and Conditions',
                    href: '/terms-and-conditions',
                },
                {
                    title: 'Privacy Policy',
                    href: '/privacy-policy',
                },
                {
                    title: 'Cancellation Policy',
                    href: '/cancellation-policy',
                },
            ],
        },
    ] : []),
    ...(isAdmins || isStaffs
            ? [
                ...(!isStaffs ? [
                    {
                        title: 'Analytics',
                        href: '/analytics',
                        icon: BarChart2,
                    },
                    {
                        title: 'Users',
                        href: '/users',
                        icon: Folder,
                    },
                ] : []),
                {
                    title: 'Configurations',
                    href: '/configurations/packages',
                    icon: Settings2,
                    children: [
                        {
                            title: 'Packages',
                            href: '/configurations/packages',
                        },
                        {
                            title: 'Vehicles',
                            href: '/configurations/vehicles',
                        },
                        {
                            title: 'Cities',
                            href: '/configurations/cities',
                        },
                    ],
                },
            ]
            : []),
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                {isBookingView && bookingPackageName && (
                    <div className="text-sm text-gray-500 px-4 py-2 border-t border-gray-200">
                        Package: <span className="text-gray-900 font-medium">{bookingPackageName}</span>
                    </div>
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
