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
import { BarChart2, Book, BookOpen, Folder, LayoutGrid, Settings } from 'lucide-react';
import AppLogo from './app-logo';
import type { SharedData } from '@/types'; // adjust path if needed

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar({ bookingPackageName }: { bookingPackageName?: string }) {
    const { url, props } = usePage<SharedData>();
    const { auth } = props;
    const isBookingView = /^\/bookings\/\d+$/.test(url);
    const isAdmin = auth.user.is_admin;

    const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Bookings',
        href: '/bookings',
        icon: Book,
    },
    ...(isAdmin
            ? [
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
                {
                    title: 'Configurations',
                    href: '/configurations',
                    icon: Settings,
                },
            ]
            : []),
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
