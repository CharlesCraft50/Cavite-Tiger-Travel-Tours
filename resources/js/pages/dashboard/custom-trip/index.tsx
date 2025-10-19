import CustomTripList from '@/components/custom-trip-list';
import DashboardLayout from '@/layouts/dashboard-layout';
import { CustomTrip, SharedData } from '@/types';
import { isAdmin, isDriver } from '@/lib/utils';
import { usePage } from '@inertiajs/react';

type DashboardProps = {
    userTrips: CustomTrip[];
};

export default function CustomTrips({ userTrips }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);

    // Get query params
    const urlParams = new URLSearchParams(window.location.search);
    const statusFilter = urlParams.get('status') ?? ''; // ← copied from Bookings

    return (
        <DashboardLayout title="Custom Trips" href="/custom-trips">
            <h2 className="text-xl font-semibold mt-8 mb-4">
                {isDrivers ? 'Custom Trips from Users' : 'My Recent Custom Trips'}
            </h2>
            <CustomTripList
                trips={userTrips}
                statusFilter={statusFilter} // ← pass statusFilter to list
                limit={undefined} // optional
            />
        </DashboardLayout>
    );
}
