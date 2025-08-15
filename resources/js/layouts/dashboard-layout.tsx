import BookingList from '@/components/booking-list';
import PriceSign from '@/components/price-sign';
import AppLayout from '@/layouts/app-layout';
import { Booking, SharedData, type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppLayoutSearch from './app-layout-search';

type DashboardProps = {
    title: string,
    href: string,
};

export default function DashboardLayout({ title, href, children } : PropsWithChildren<DashboardProps>) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: href,
        },
    ];

return (
        <AppLayoutSearch breadcrumbs={breadcrumbs}>
            <Head title={title} />
            
            <main className="p-8">{children}</main>
        </AppLayoutSearch>
    );
}