import { Booking } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from './ui/button';

type BookingListCardProps = {
  bookings: Booking[];
  limit?: number;
  searchByUserId?: string;
};

export default function BookingListCard({ bookings, limit, searchByUserId }: BookingListCardProps) {
  const displayedBookings = limit ? bookings.slice(0, limit) : bookings;

  if (displayedBookings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <p className="text-gray-500 text-lg font-medium">No upcoming trips</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 max-w-7xl w-full">
        {displayedBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={booking.tour_package?.image_overview ?? ''}
                alt={booking.tour_package?.title ?? 'Tour package'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                {booking.tour_package?.title
                  ? `${booking.tour_package.title}${
                      booking.package_category?.name
                        ? ` (${booking.package_category.name})`
                        : ''
                    }`
                  : ''}
              </h3>

              <p className="text-xs text-gray-600 mb-2">
                {booking.departure_date} - {booking.return_date}
              </p>

              <div className="flex justify-end">
                <Link href={route('bookings.show', booking.id)}>
                  <Button
                    type="button"
                    className="px-4 py-1 cursor-pointer"
                  >
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
