import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [], }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton  
                            asChild 
                            isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>

                        {/* Render sub-items if any */}
                        {item.children && (
                            <div className="ml-6 mt-1 space-y-1">
                                {item.children.map((child) => (
                                    <SidebarMenuButton
                                        key={child.title}
                                        asChild
                                        isActive={child.href === page.url}
                                        tooltip={{ children: child.title }}
                                    >
                                        <Link href={child.href}>
                                            {child.icon && <child.icon />}
                                            <span>{child.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                ))}
                            </div>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
