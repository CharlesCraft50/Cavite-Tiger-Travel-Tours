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
    <div className="space-y-4">
      {displayedBookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-32 md:w-40 h-32 sm:h-24 md:h-28 overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={booking.tour_package?.image_overview ?? ''}
                alt={booking.tour_package?.title ?? 'Tour package'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {booking.tour_package?.title
                    ? `${booking.tour_package.title}${
                        booking.package_category?.name
                          ? ` (${booking.package_category.name})`
                          : ''
                      }`
                    : 'Untitled Booking'}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Departure:</span> {booking.departure_date}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Return:</span> {booking.return_date}
                    </p>
                  </div>

                  <Link
                    href={route('bookings.show', booking.id)}
                    className="flex-shrink-0"
                  >
                    <Button
                      type="button"
                      className="px-4 py-2 cursor-pointer"
                    >
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}