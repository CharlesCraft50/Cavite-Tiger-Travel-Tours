import BookingList from '@/components/booking-list';
import PriceSign from '@/components/price-sign';
import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type DashboardProps = {
    bookingCount: number;
    userBookings: Booking[];
};

export default function Dashboard({ bookingCount, userBookings } : DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);

return (
        <DashboardLayout title="Dasboard" href="/dashboard">
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
                    <h2 className="text-xl font-semibold mt-8 mb-4">{isDrivers ? 'Bookings from Users' : 'My Recent Bookings'}</h2>
                    <BookingList 
                        bookings={userBookings}
                        limit={3}
                    />
                    {userBookings.length > 2 && (
                        <div className="w-full flex">
                            <Link href="/bookings" className="btn-primary text-center w-full shadow bg-gray-100 text-sm text-black hover:bg-gray-200 rounded rounded-t-none cursor-pointer">Show All</Link>
                        </div>
                    )}
                </div>
                
            </div>
        </DashboardLayout>
    );
}
