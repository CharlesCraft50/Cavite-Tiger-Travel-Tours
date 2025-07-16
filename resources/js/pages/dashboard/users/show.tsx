import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, Link } from '@inertiajs/react';
import { Booking, User } from '@/types';
import { ArrowLeft, ShieldCheck, User2 } from 'lucide-react';
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

interface Props {
  user: User;
  bookings: Booking[];
  totalSpent: number;
}

export default function Show({ user, bookings, totalSpent }: Props) {
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

  return (
    <DashboardLayout title="Users" href="/users">
      <Head title={`User: ${user.name}`} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Details</h1>
          <p className="text-sm text-gray-500">Manage access and account info</p>
        </div>

        <Link
          href="/users"
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
        >
          <ArrowLeft size={16} />
          Back to List
        </Link>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm mb-6">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <User2 className="h-6 w-6 text-gray-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <p className="text-gray-500 mb-1">Role</p>
            <span
              className={clsx(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium',
                user.is_admin
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-700'
              )}
            >
              {user.is_admin && <ShieldCheck className="h-4 w-4" />}
              {user.is_admin ? 'Admin' : 'User'}
            </span>
          </div>

          <div>
            <p className="text-gray-500 mb-1">Joined</p>
            <p>
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
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900">₱ {totalSpent.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-xl border mb-6">
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

      <div className="bg-white p-6 shadow rounded-xl border mb-6">
        <h2 className="text-lg font-semibold mb-4">All Bookings</h2>
        <BookingList bookings={bookings} searchByUserId={user.id.toString()} />
      </div>
    </DashboardLayout>
  );
}
