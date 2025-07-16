import BookingDetails from '@/components/booking-details';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, OtherService, PreferredVan, TourPackage } from '@/types';

type BookingDetailProps = {
    booking: Booking;
    otherServices: OtherService[];
    packages: TourPackage;
    vans: PreferredVan[];
    isAdmin?: boolean;
};

export default function Show({ booking, otherServices, packages, vans, isAdmin }: BookingDetailProps) {

    return (
        <DashboardLayout title="Bookings" href="/bookings">
            <BookingDetails 
                booking={booking}
                otherServices={otherServices}
                packages={packages}
                vans={vans}
                editable={!!isAdmin}
            />            
        </DashboardLayout>
    );
}
