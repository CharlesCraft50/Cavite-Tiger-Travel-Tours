import BookingList from '@/components/booking-list';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, SharedData } from '@/types';
import { isAdmin, isDriver } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

type DashboardProps = {
    userBookings: Booking[];
};

export default function Bookings({ userBookings }: DashboardProps) {
    const { auth, ziggy } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);

    // Get query params
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('status') ?? '';

    return (
        <DashboardLayout title="Bookings" href="/bookings">
            <h2 className="text-xl font-semibold mt-8 mb-4">
                {isDrivers ? 'Bookings from Users' : 'My Recent Bookings'}
            </h2>
            <BookingList 
                bookings={userBookings}
                statusFilter={statusFilter}
            />
        </DashboardLayout>
    );
}
