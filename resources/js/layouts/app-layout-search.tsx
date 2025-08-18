import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Navbar from '@/components/ui/navbar';

interface AppLayoutSearchProps {
    children: ReactNode;
    hasSearchBar?: boolean;
    removeNavItems?: boolean;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, hasSearchBar, removeNavItems, breadcrumbs, ...props }: AppLayoutSearchProps) => (
    <>
        <Navbar hasSearchBar={hasSearchBar} inDashboard={true} removeNavItems={removeNavItems} />
        
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </>
);
