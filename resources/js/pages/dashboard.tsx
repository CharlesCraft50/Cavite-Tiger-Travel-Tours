import PriceSign from '@/components/price-sign';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Booking, SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DashboardProps = {
    bookingCount: number;
    userBookings: Booking[];
};

export default function Dashboard({ bookingCount, userBookings } : DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.is_admin;

return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-4xl">Hello {auth.user.name}!</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {/* Total Bookings */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex flex-col items-center justify-center">
                        <h2 className="text-sm text-muted-foreground mb-1">Total Bookings</h2>
                        <h1 className="text-4xl font-bold text-primary">{bookingCount}</h1>
                    </div>
                    {/* Upcoming Trips */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex flex-col items-center justify-center">
                        <h2 className="text-sm text-muted-foreground mb-1">Upcoming Trips</h2>
                        <h1 className="text-4xl font-bold text-green-600">
                            {
                                userBookings.filter(b => new Date(b.departure_date) > new Date()).length
                            }
                        </h1>
                    </div>
                    {/* Total Spent */}
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex flex-col items-center justify-center">
                        <h2 className="text-sm text-muted-foreground mb-1">Total Spent</h2>
                        <h1 className="flex flex-row items-center text-4xl font-bold text-yellow-600">
                            <PriceSign />
                            {userBookings.reduce((sum, b) => sum + Number(b.total_amount ?? 0), 0).toLocaleString()}
                        </h1>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    <h2 className="text-xl font-semibold mt-8 mb-4">My Recent Bookings</h2>
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Package</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {userBookings.length > 0 ? userBookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-4 py-2">
                                            {booking.tour_package?.title ?? '—'}
                                        </td>
                                        <td className="px-4 py-2">
                                            {booking.departure_date}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-4 text-center text-gray-500">No bookings yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
