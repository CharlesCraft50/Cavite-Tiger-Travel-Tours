import { Booking, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import AppLayoutSearch from './app-layout-search';
import { isAdmin, isDriver } from '@/lib/utils';

type DashboardProps = {
    title: string,
    href: string,
    disableNav?: boolean,
};

export default function DashboardLayout({ title, href, children, disableNav } : PropsWithChildren<DashboardProps>) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: title,
            href: href,
        },
    ];

    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);

return (
    !disableNav ?
        (
            <AppLayoutSearch breadcrumbs={breadcrumbs} hasSearchBar={!(isAdmins || isDrivers) ? true : false} removeNavItems={!(isAdmins || isDrivers) ? false : true}>
                <Head title={title} />
                
                <main className="p-8">{children}</main>
            </AppLayoutSearch>
        ) : (
            <main className="p-8">{children}</main>
        )
    
    );
}