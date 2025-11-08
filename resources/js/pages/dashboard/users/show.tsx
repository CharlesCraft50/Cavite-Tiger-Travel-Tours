import React, { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Booking, CustomTrip, User } from '@/types';
import { ArrowLeft, Check, Pencil, ShieldCheck, User2, X, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar
} from 'recharts';
import BookingList from '@/components/booking-list';
import { isAdmin, isDriver, isStaff } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/components/ui/loading-provider';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import TripList from '@/components/trip-list';

interface Props {
  user: User;
  bookings: Booking[];
  totalSpent: number;
  userBookings: Booking[];
  userCustomTrips: CustomTrip[],
}

export default function Show({ user, bookings, totalSpent, userBookings, userCustomTrips }: Props) {
  const chartData = Object.values(
    bookings.reduce((acc, booking) => {
      const month = new Date(booking.created_at).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      acc[month] = acc[month] || { month, count: 0 };
      acc[month].count++;
      return acc;
    }, {} as Record<string, { month: string; count: number }>)
  ).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState<string>(user.role);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { start, stop } = useLoading();

  const saveEdits = () => {
    start();

    router.post(route('users.update', user.id), {
      '_method': 'PUT',
      'role': userRole,
    }, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        stop();
        setIsEditing(false);
      }
    });
  }

  const handleDelete = () => {
    start();
    router.delete(route('users.destroy', user.id), {
      preserveScroll: true,
      onSuccess: () => {
        stop();
        setShowDeleteDialog(false);
        // The redirect will happen from the controller
      },
      onError: () => {
        stop();
      }
    });
  };

  const allTrips = [
    ...userBookings.map(b => ({
        type: 'booking' as const,
        id: b.id,
        date: new Date(b.departure_date),
        status: b.status,
        total_amount: b.total_amount ?? 0,
        paymentStatus: b.payment?.status ?? '',
        is_completed: b.is_completed,
    })),
    ...userCustomTrips.map(t => ({
        type: 'custom' as const,
        id: t.id,
        date: new Date(t.date_of_trip),
        status: t.status,
        total_amount: t.total_amount ?? 0,
        paymentStatus: t.payment?.status ?? '',
        is_completed: t.is_completed,
    })),
];

  return (
    <DashboardLayout title="Users" href="/users">
      <Head title={`User: ${user.first_name}`} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Details</h1>
          <p className="text-sm text-gray-500">Manage access and account info</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.history.back()}
            className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2"
          >
            <ArrowLeft size={16} />
            Back To List
          </button>

          {user.first_name.toLowerCase() !== 'admin' && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="inline-flex items-center gap-2 text-xs px-4 py-2 cursor-pointer"
            >
              <Trash2 size={16} />
              Delete User
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-accent p-6 shadow-sm mb-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-400">
            {user.profile_photo ? (
                <img
                    src={user.profile_photo}
                    alt="Profile photo"
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full bg-white text-gray-600 dark:bg-gray-400 rounded-full">
                    <User2 className="h-6 w-6 text-gray-500" />
                </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{user.first_name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-200">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 mb-1 dark:text-gray-200">Role</p>
            <div className="flex flex-row items-center space-x-2">
              {isEditing ? (
                <>
                  <select className="cursor-pointer" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    <option key="user" value="user">User</option>
                    <option key="admin" value="admin">Admin</option>
                    <option key="driver" value="driver">Driver</option>
                    <option key="staff" value="staff">Staff</option>
                  </select>
                </>
              ) : (
                <span
                  className={clsx(
                    'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize',
                    isAdmin(user)
                      ? 'bg-purple-100 text-purple-800'
                      : isStaff(user)
                        ? 'bg-blue-100 text-blue-800'
                      : isDriver(user) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-700'
                  )}
                >
                  {isAdmin(user) || isDriver(user) && <ShieldCheck className="h-4 w-4" />}
                  {user.role}
                </span>
              )}

              {isEditing ? (
                <div className="flex flex-row space-x-2">
                  <Button
                    className="cursor-pointer"
                    onClick={saveEdits}
                  >
                    <Check className="text-gray w-2 h-2" />
                  </Button>

                  <Button
                    className="cursor-pointer"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="text-gray w-2 h-2" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <Pencil className="text-gray w-2 h-2" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-gray-500 mb-1 dark:text-gray-200">Joined</p>
            <p className="dark:text-gray-400">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border bg-white dark:bg-accent p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
        </div>

        <div className="rounded-lg border bg-white dark:bg-accent p-6 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">₱ {totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-accent p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Bookings Over Time</h2>

        {chartData.length === 0 ? (
          <p className="text-gray-500">No data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white dark:bg-accent p-6 shadow rounded-xl border mb-6">
        <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
        <TripList customTrips={userCustomTrips} bookings={userBookings} limit={3} />
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={(open) => !open && setShowDeleteDialog(false)}>
        <DialogContent className="p-4 max-w-md bg-white rounded shadow-xl">
          <DialogTitle className="text-lg font-semibold text-center mb-2">
            Delete User "{user.first_name}"?
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500 text-center mb-4">
            Are you sure you want to delete this user? This will also delete all their bookings ({bookings.length}) and related data. This action cannot be undone.
          </DialogDescription>

          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}