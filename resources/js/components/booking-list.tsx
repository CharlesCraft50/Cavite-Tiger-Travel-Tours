import { formatStatus } from '@/lib/utils';
import { Booking } from '@/types';
import { Link, router } from '@inertiajs/react';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';
import { DialogFooter } from './ui/dialog';

type BookingListProps = {
  bookings: Booking[];
  limit?: number;
  searchByUserId?: string;
  statusFilter?: string;
};

export default function BookingList({ bookings, limit, searchByUserId, statusFilter }: BookingListProps) {
  const [searchQuery, setSearchQuery] = useState(searchByUserId ?? '');
  const [searchBy, setSearchBy] = useState< 'package' | 'name' | 'booking_number' | 'user_id'>(
    searchByUserId ? 'user_id' : 'package'
  );
  const [status, setStatus] = useState(statusFilter);
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const itemsPerPage = 10;

  const filteredBookings = bookings
    .filter((booking) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (() => {
        switch (searchBy) {
          case 'name':
            return (`${booking.first_name} ${booking.last_name}`.toLowerCase().includes(query));
          case 'package':
            return booking.tour_package?.title?.toLowerCase().includes(query) || '';
          case 'booking_number':
            return booking.booking_number?.toLowerCase().includes(query);
          case 'user_id':
            return booking.user_id?.toString() === query;
          default:
            return true;
        }
      })();
      const matchesStatus = !status || booking.status === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.departure_date).getTime();
      const dateB = new Date(b.departure_date).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const displayedBookings = limit ? filteredBookings.slice(0, limit) : filteredBookings;

  const handleCancelBooking = (id: number) => {
    router.post(route('bookings.cancel', id));
    setBookingToCancel(null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [status]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder={`Search by ${searchBy.replace('_', ' ')}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
          />
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            
            <option value="package">Package</option>
            <option value="name">Name</option>
            <option value="booking_number">Booking No.</option>
            <option value="user_id">User ID</option>
          </select>
        </div>
        {/* Sort */}
        <select
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value as any)}
          className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Booking Number</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Package</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {(limit ? displayedBookings : paginatedBookings).length > 0 ? (
            (limit ? displayedBookings : paginatedBookings).map((booking) => (
              <tr key={booking.id}>
                <td className="px-4 py-2">{booking.booking_number}</td>
                <td className="px-4 py-2">
                  {booking.tour_package?.title
                    ? `${booking.tour_package.title}${booking.package_category?.name ? ` (${booking.package_category.name})` : ''}`
                    : ''}
                </td>
                <td className="px-4 py-2">{booking.departure_date}</td>
                <td className="px-4 py-2">{`${booking.first_name} ${booking.last_name}`}</td>
                <td className="px-4 py-2">
                  <span
                    className={clsx(
                      "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                      {
                        "bg-blue-100 text-blue-800": booking.status === "pending",
                        "bg-green-100 text-green-800": booking.status === "accepted",
                        "bg-red-100 text-red-800": booking.status === "declined" || booking.status === "past_due",
                        "bg-gray-100 text-gray-800": booking.status === "past_due" && booking.payment?.status === "pending",
                        "bg-gray-200 text-gray-700": booking.status === "cancelled",
                      }
                    )}
                  >
                    {booking.payment?.status
                      ? `Payment: ${formatStatus(booking.payment.status)}`
                      : formatStatus(booking.status)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-row gap-2">
                    <Link
                      href={route('bookings.show', booking.id)}
                      className="btn-primary cursor-pointer text-xs"
                    >
                      View
                    </Link>
                    <Button
                      type="button"
                      onClick={() => setBookingToCancel(booking)}
                      className="btn-primary cursor-pointer text-xs py-5"
                    >
                      Cancel
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!limit && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={clsx(
                "rounded px-3 py-1 text-sm cursor-pointer",
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "border text-gray-700"
              )}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={!!bookingToCancel} onOpenChange={(open) => !open && setBookingToCancel(null)}>
        <DialogContent className="p-4 max-w-md bg-white rounded shadow-xl">
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Cancel Booking "{bookingToCancel?.booking_number}"?
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </DialogDescription>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Close
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => bookingToCancel && handleCancelBooking(bookingToCancel.id)}
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}