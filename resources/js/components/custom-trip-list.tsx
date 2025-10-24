import { formatStatus } from '@/lib/utils';
import { CustomTrip } from '@/types';
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

type CustomTripListProps = {
  trips: CustomTrip[];
  limit?: number;
  statusFilter?: string;
};

export default function CustomTripList({ trips, limit, statusFilter }: CustomTripListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'destination' | 'booking_number' | 'email'>('name');
  const [status, setStatus] = useState(statusFilter || '');
  const [sortByDate, setSortByDate] = useState<'newest' | 'oldest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [tripToCancel, setTripToCancel] = useState<CustomTrip | null>(null);
  const itemsPerPage = 10;

  const getTripStatus = (trip: CustomTrip): string => {
    if (
      trip.date_of_trip &&
      new Date(trip.date_of_trip).getTime() < Date.now() &&
      trip.status !== 'completed'
    ) {
      if (!trip.payment || trip.payment.status === 'pending' || trip.payment.status === 'declined') {
        return 'past_due';
      } else if (trip.payment.status.toLowerCase() === 'accepted') {
        return 'completed';
      }
    }
    return trip.status;
  };

  const handleCancelTrip = (id: number) => {
    router.post(route('customTrips.cancel', id));
    setTripToCancel(null);
  };

  // Search & Filter logic
  const filteredTrips = trips
    .filter((trip) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (() => {
        switch (searchBy) {
          case 'name':
            return (`${trip.first_name} ${trip.last_name}`.toLowerCase().includes(query));
          case 'destination':
            return trip.destination?.toLowerCase().includes(query);
          case 'booking_number':
            return trip.booking_number?.toLowerCase().includes(query);
          case 'email':
            return trip.email?.toLowerCase().includes(query);
          default:
            return true;
        }
      })();
      const matchesStatus = !status || getTripStatus(trip) === status;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date_of_trip).getTime();
      const dateB = new Date(b.date_of_trip).getTime();
      return sortByDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = limit
    ? filteredTrips.slice(0, limit)
    : filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Keep URL synced with filters
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
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
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
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
          />
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value as any)}
            className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="destination">Destination</option>
            <option value="booking_number">Booking No.</option>
            <option value="email">Email</option>
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

      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Trip Number</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Destination</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {(paginatedTrips.length > 0 ? paginatedTrips : []).map((trip) => {
            const absoluteStatus = getTripStatus(trip);
            return (
              <tr key={trip.id}>
                <td className="px-4 py-2">{trip.booking_number}</td>
                <td className="px-4 py-2">{trip.date_of_trip}</td>
                <td className="px-4 py-2">{`${trip.first_name} ${trip.last_name}`}</td>
                <td className="px-4 py-2">{trip.destination}</td>
                <td className="px-4 py-2">
                  <span
                    className={clsx(
                      'inline-block rounded-full px-2 py-0.5 text-xs font-medium',
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
                    href={route('customTrips.show', trip.id)}
                    className="btn-primary cursor-pointer text-xs"
                  >
                    View
                  </Link>
                  <Button
                    type="button"
                    onClick={() => setTripToCancel(trip)}
                    className="btn-primary cursor-pointer text-xs py-5"
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            );
          })}
          {paginatedTrips.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                No custom trips found.
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
                page === currentPage ? 'bg-blue-600 text-white' : 'border text-gray-700'
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
      <Dialog open={!!tripToCancel} onOpenChange={(open) => !open && setTripToCancel(null)}>
        <DialogContent className="p-4 max-w-md bg-white rounded shadow-xl">
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Cancel Trip "{tripToCancel?.booking_number}"?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to cancel this custom trip? This action cannot be undone.
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
              onClick={() => tripToCancel && handleCancelTrip(tripToCancel.id)}
            >
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
