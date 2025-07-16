import BookingList from '@/components/booking-list';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking } from '@/types';

type DashboardProps = {
    userBookings: Booking[];
};

export default function Bookings({ userBookings } : DashboardProps) {

return (
        <DashboardLayout title="Bookings" href="/bookings">
            <h2 className="text-xl font-semibold mt-8 mb-4">My Recent Bookings</h2>
            <BookingList 
                bookings={userBookings}
            />
        </DashboardLayout>
    );
}
