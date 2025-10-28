import { formatStatus, isDriver } from '@/lib/utils';
import { Booking, CustomTrip } from '@/types';
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

type TripListProps = {
  bookings: Booking[];
  customTrips: CustomTrip[];
  limit?: number;
  statusFilter?: string;
  isDriver?: boolean;
};

export default function TripList({ bookings, customTrips, limit, statusFilter, isDriver }: TripListProps) {
  const [tripType, setTripType] = useState<'all' | 'bookings' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'destination' | 'package' | 'booking_number'>('name');
  const [status, setStatus] = useState(statusFilter || '');
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const itemsPerPage = 10;

  const allTrips = [
    ...bookings.map((b) => ({
      id: b.id,
      booking_number: b.booking_number,
      name: `${b.first_name} ${b.last_name}`,
      date: b.departure_date,
      destination: b.tour_package?.title ?? '',
      status: b.status,
      type: 'booking' as const,
      created_at: b.created_at,
    })),
    ...customTrips.map((c) => ({
      id: c.id,
      booking_number: c.booking_number ?? '',
      name: `${c.first_name} ${c.last_name}`,
      date: c.date_of_trip,
      destination: c.destination,
      status: c.status,
      type: 'custom' as const,
      created_at: c.created_at,
    })),
  ];

  const getTripStatus = (trip: any) => {
    const dateField = trip.date;
    if (dateField && new Date(dateField).getTime() < Date.now() && trip.status !== 'completed') {
      return ['pending', 'declined'].includes(trip.status) ? 'past_due' : trip.status;
    }
    return trip.status;
  };

  // Filter
  const filteredTrips = allTrips
    .filter((trip) => {
      if (tripType === 'bookings' && trip.type !== 'booking') return false;
      if (tripType === 'custom' && trip.type !== 'custom') return false;
      const query = searchQuery.toLowerCase();
      const matchesSearch = (() => {
        switch (searchBy) {
          case 'name':
            return trip.name.toLowerCase().includes(query);
          case 'destination':
            return trip.destination.toLowerCase().includes(query);
          case 'package':
            return trip.destination.toLowerCase().includes(query);
          case 'booking_number':
            return trip.booking_number?.toLowerCase().includes(query);
          default:
            return true;
        }
      })();
      const matchesStatus = !status || getTripStatus(trip) === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.created_at).getTime() : 0;
      const dateB = b.date ? new Date(b.created_at).getTime() : 0;
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCancel = (trip: any) => {
    if (trip.type === 'booking') router.post(route('bookings.cancel', trip.id));
    else router.post(route('customTrips.cancel', trip.id));
    setCancelTarget(null);
  };

  const handleCompleteTarget = (trip: any) => {
    if (trip.type === 'booking') router.post(route('bookings.complete', trip.id));
    else router.post(route('customTrips.complete', trip.id));
  }

  // Sync URL filter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (status) params.set('status', status);
    else params.delete('status');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [status]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      {/* Filters */}
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Trip Type Dropdown */}
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-pink-500 focus:outline-none"
          >
            <option value="all">All Trips</option>
            <option value="bookings">Local Trips</option>
            <option value="custom">Custom Trips</option>
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-pink-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="on_process">On Process</option>
            <option value="accepted">Accepted</option>
            <option value="cancelled">Cancelled</option>
            <option value="past_due">Past Due</option>
            <option value="declined">Declined</option>
            <option value="completed">Completed</option>
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder={`Search by ${searchBy.replace('_', ' ')}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-pink-500 focus:outline-none sm:w-64"
          />
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-pink-500 focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="destination">Destination</option>
            <option value="package">Package</option>
            <option value="booking_number">Booking No.</option>
          </select>
        </div>

        {/* Sort */}
        <select
          value={sortByDate}
          onChange={(e) => setSortByDate(e.target.value as any)}
          className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-pink-500 focus:outline-none"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Trip #</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Destination / Package</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {paginatedTrips.length > 0 ? (
            paginatedTrips.map((trip) => {
              const absoluteStatus = getTripStatus(trip);
              return (
                <tr key={`${trip.type}-${trip.id}`}>
                  <td className="px-4 py-2">{trip.booking_number}</td>
                  <td className="px-4 py-2">{trip.date}</td>
                  <td className="px-4 py-2">{trip.name}</td>
                  <td className="px-4 py-2">{trip.destination}</td>
                  <td className="px-4 py-2 capitalize">{trip.type == 'booking' ? 'Local' : trip.type}</td>
                  <td className="px-4 py-2">
                    <span
                      className={clsx(
                        'inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium',
                        {
                          'bg-blue-100 text-blue-800': absoluteStatus === 'pending',
                          'bg-green-100 text-green-800': absoluteStatus === 'accepted',
                          'bg-red-100 text-red-800': absoluteStatus === 'declined' || absoluteStatus === 'past_due',
                          'bg-gray-200 text-gray-700': absoluteStatus === 'cancelled',
                          'bg-gray-200 text-green-600': absoluteStatus === 'completed',
                          'bg-amber-200 text-amber-600': absoluteStatus === 'on_process',
                        }
                      )}
                    >
                      {formatStatus(absoluteStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <Link
                      href={route(trip.type === 'booking' ? 'bookings.show' : 'customTrips.show', trip.id)}
                      className="btn-primary cursor-pointer text-xs"
                    >
                      View
                    </Link>
                    <Button
                      type="button"
                      onClick={() => {
                        if (isDriver) {
                          handleCompleteTarget(trip);
                        } else {
                          setCancelTarget(trip);
                        }
                      }}
                      className="btn-primary cursor-pointer text-xs py-5"
                    >
                      {isDriver ? 'Complete' : 'Cancel'}
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                No trips found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
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
                'rounded px-3 py-1 text-sm cursor-pointer',
                page === currentPage ? 'bg-pink-600 text-white' : 'border text-gray-700'
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

      {/* Cancel Dialog */}
      <Dialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <DialogContent className="p-4 max-w-md bg-white rounded shadow-xl">
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Cancel {cancelTarget?.type === 'custom' ? 'Trip' : 'Booking'} "{cancelTarget?.booking_number}"?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to cancel this {cancelTarget?.type}? This action cannot be undone.
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
              onClick={() => cancelTarget && handleCancel(cancelTarget)}
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
