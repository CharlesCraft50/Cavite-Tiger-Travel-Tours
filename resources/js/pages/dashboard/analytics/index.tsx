import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking } from '@/types';
import { BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Bar } from 'recharts';
import { BarChart3, CalendarCheck, CircleSlash2Icon, Clock, DollarSign, UserCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const chartColors: Record<string, string> = {
  accepted: '#22c55e', // green
  pending: '#facc15',  // yellow
  declined: '#ef4444', // red
  past_due: '#9ca3af', // gray
  users: '#3b82f6',
  income: '#10b981', // green for income
};

type AnalyticsProps = {
  bookings: Booking[];
  userCount: number;
};

export default function Analytics({ bookings, userCount }: AnalyticsProps) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState("Total Bookings");

  const acceptedBookings = bookings.filter(b =>
        b.payment?.status.toLowerCase() === 'accepted' &&
        b.status.toLowerCase() !== 'cancelled'
    );
  const totalSpent = acceptedBookings.reduce((sum, b) => sum + Number(b.total_amount ?? 0), 0);

  const stats = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />, label: "Total Bookings", value: bookings.length,
      onClick: () => setActiveStatus(null), // All
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-green-600" />, label: "Accepted", value: bookings.filter(b => b.status === 'accepted').length,
      onClick: () => setActiveStatus('accepted'),
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-600" />, label: "Pending", value: bookings.filter(b => b.status === 'pending').length,
      onClick: () => setActiveStatus('pending'),
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-600" />, label: "On Process", value: bookings.filter(b => b.status === 'pending').length,
      onClick: () => setActiveStatus('on_process'),
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-500" />, label: "Declined", value: bookings.filter(b => b.status === 'declined').length,
      onClick: () => setActiveStatus('declined'),
    },
    {
      icon: <Clock className="h-6 w-6 text-gray-500" />, label: "Past Due", value: bookings.filter(b => b.status === 'past_due').length,
      onClick: () => setActiveStatus('past_due'),
    },
    {
      icon: <CircleSlash2Icon className="h-6 w-6 text-red-900" />, label: "Cancelled", value: bookings.filter(b => b.status === 'cancelled').length,
      onClick: () => setActiveStatus('cancelled'),
    },
    {
      icon: <UserCircle className="h-6 w-6 text-red-900" />, label: "User Count", value: userCount,
      onClick: () => setActiveStatus('users'),
    },
    {
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />, label: "Total Income", 
      value: `₱ ${totalSpent.toLocaleString()}`,
      onClick: () => setActiveStatus('income'),
    },
  ];

  const filteredBookings = activeStatus ? bookings.filter(b => b.status === activeStatus) : bookings;

  let chartData = [];

  if (activeStatus === 'users') {
      chartData = [{ month: 'All Time', count: userCount }];
  } else if (activeStatus === 'income') {
      // Group accepted bookings by month and sum total_amount
      const incomeBookings = bookings.filter(b =>
          b.payment?.status.toLowerCase() === 'accepted' &&
          b.status.toLowerCase() !== 'cancelled'
      );

      const monthlyIncome = Object.values(
          incomeBookings.reduce((acc, b) => {
              const month = new Date(b.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
              acc[month] = acc[month] || { month, total: 0 };
              acc[month].total += Number(b.total_amount ?? 0);
              return acc;
          }, {} as Record<string, { month: string; total: number }>)
      ).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      chartData = monthlyIncome.map(item => ({ month: item.month, count: item.total }));
  } else {
      const filteredBookings = activeStatus ? bookings.filter(b => b.status === activeStatus) : bookings;

      chartData = Object.values(
          filteredBookings.reduce((acc, booking) => {
              const month = new Date(booking.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
              acc[month] = acc[month] || { month, count: 0 };
              acc[month].count++;
              return acc;
          }, {} as Record<string, { month: string; count: number }> )
      ).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }


  return (
    <DashboardLayout title="Analytics" href="/admin/analytics">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Booking Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => {
                const isSelected = stat.label === selectedLabel;
                return (
                <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl border shadow transition
                    ${isSelected ? "bg-gray-100 border-gray-300" : "bg-white border-gray-200"}
                    cursor-pointer hover:bg-gray-50`}
                    onClick={() => {
                        setSelectedLabel(stat.label);
                        stat.onClick();
                    }}
                >
                    <div className="bg-gray-100 p-2 rounded-full">
                    {stat.icon}
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                </div>
                );
            })}
            </div>

        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            {activeStatus === 'users'
              ? 'Total Users'
              : activeStatus
              ? `${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Bookings Over Time`
              : 'All Bookings Over Time'}
          </h2>

          {chartData.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill={activeStatus ? chartColors[activeStatus] : '#3b82f6'} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
