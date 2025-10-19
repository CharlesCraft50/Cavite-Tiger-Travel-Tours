import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    // Initialize openItems state based on active children
    const initialOpenItems: Record<string, boolean> = {};
    items.forEach(item => {
        if (item.collapsable && item.children) {
            initialOpenItems[item.title] = item.children.some(child => child.href === page.url);
        }
    });

    const [openItems, setOpenItems] = useState<Record<string, boolean>>(initialOpenItems);

    const toggleItem = (title: string) => {
        setOpenItems(prev => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isCollapsable = item.collapsable && hasChildren;
                    const isOpen = openItems[item.title] || false;

                    return (
                        <SidebarMenuItem key={item.title}>
                            <div className="flex items-center justify-between">
                                <SidebarMenuButton
                                    asChild
                                    isActive={item.href === page.url}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} className="flex items-center gap-2 w-full">
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>

                                {isCollapsable && (
                                    <button
                                        className="p-1 hover:bg-gray-200 rounded"
                                        onClick={() => toggleItem(item.title)}
                                    >
                                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                )}
                            </div>

                            {hasChildren && (isCollapsable ? isOpen : true) && (
                                <div className="ml-6 mt-1 space-y-1">
                                    {item.children!.map((child) => (
                                        <SidebarMenuButton
                                            key={child.title}
                                            asChild
                                            isActive={child.href === page.url}
                                            tooltip={{ children: child.title }}
                                        >
                                            <Link href={child.href} className="flex items-center gap-2">
                                                {child.icon && <child.icon />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    ))}
                                </div>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
