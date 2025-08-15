import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Navbar from '@/components/ui/navbar';
import BottomNav from '@/components/ui/bottom-nav';

interface AppLayoutSearchProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutSearchProps) => (
    <>
        <Navbar hasSearchBar={true} inDashboard={true} />
        
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <BottomNav />
    </>
);
