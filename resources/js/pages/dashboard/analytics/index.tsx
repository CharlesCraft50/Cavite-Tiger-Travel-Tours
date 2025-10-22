import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, CustomTrip } from '@/types';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
} from 'recharts';
import {
  BarChart3,
  CalendarCheck,
  CircleSlash2Icon,
  Clock,
  DollarSign,
  UserCircle,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const chartColors: Record<string, string> = {
  accepted: '#22c55e',
  pending: '#facc15',
  declined: '#ef4444',
  past_due: '#9ca3af',
  users: '#3b82f6',
  income: '#10b981',
  cancelled: '#7f1d1d',
  on_process: '#f59e0b',
};

type AnalyticsProps = {
  bookings: Booking[];
  customTrips: CustomTrip[];
  userCount: number;
};

export default function Analytics({
  bookings,
  customTrips,
  userCount,
}: AnalyticsProps) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState('Total Bookings');

  // Combine bookings and custom trips into one array for unified analytics
  const allTrips = [...bookings, ...customTrips];

  // Accepted (paid and not cancelled)
  const acceptedTrips = allTrips.filter(
    (t) =>
      t.payment?.status?.toLowerCase() === 'accepted' &&
      t.status?.toLowerCase() !== 'cancelled'
  );

  const totalIncome = acceptedTrips.reduce(
    (sum, t) => sum + Number(t.total_amount ?? 0),
    0
  );

  const stats = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      label: 'Total Trips',
      value: allTrips.length,
      onClick: () => setActiveStatus(null),
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-green-600" />,
      label: 'Accepted',
      value: allTrips.filter((t) => t.status === 'accepted').length,
      onClick: () => setActiveStatus('accepted'),
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      label: 'Pending',
      value: allTrips.filter((t) => t.status === 'pending').length,
      onClick: () => setActiveStatus('pending'),
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      label: 'On Process',
      value: allTrips.filter((t) => t.status === 'on_process').length,
      onClick: () => setActiveStatus('on_process'),
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      label: 'Declined',
      value: allTrips.filter((t) => t.status === 'declined').length,
      onClick: () => setActiveStatus('declined'),
    },
    {
      icon: <Clock className="h-6 w-6 text-gray-500" />,
      label: 'Past Due',
      value: allTrips.filter((t) => t.status === 'past_due').length,
      onClick: () => setActiveStatus('past_due'),
    },
    {
      icon: <CircleSlash2Icon className="h-6 w-6 text-red-900" />,
      label: 'Cancelled',
      value: allTrips.filter((t) => t.status === 'cancelled').length,
      onClick: () => setActiveStatus('cancelled'),
    },
    {
      icon: <UserCircle className="h-6 w-6 text-red-900" />,
      label: 'User Count',
      value: userCount,
      onClick: () => setActiveStatus('users'),
    },
    {
      icon: <DollarSign className="h-6 w-6 text-emerald-500" />,
      label: 'Total Income',
      value: `₱ ${totalIncome.toLocaleString()}`,
      onClick: () => setActiveStatus('income'),
    },
  ];

  // Filter trips based on selected status
  const filteredTrips = activeStatus
    ? allTrips.filter((t) => t.status === activeStatus)
    : allTrips;

  // Build chart data
  let chartData: { month: string; count: number }[] = [];

  if (activeStatus === 'users') {
    chartData = [{ month: 'All Time', count: userCount }];
  } else if (activeStatus === 'income') {
    const monthlyIncome = Object.values(
      acceptedTrips.reduce((acc, t) => {
        const month = new Date(t.created_at).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[month] = acc[month] || { month, total: 0 };
        acc[month].total += Number(t.total_amount ?? 0);
        return acc;
      }, {} as Record<string, { month: string; total: number }>)
    ).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    chartData = monthlyIncome.map((i) => ({ month: i.month, count: i.total }));
  } else {
    const monthlyCounts = Object.values(
      filteredTrips.reduce((acc, t) => {
        const month = new Date(t.created_at).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        acc[month] = acc[month] || { month, count: 0 };
        acc[month].count++;
        return acc;
      }, {} as Record<string, { month: string; count: number }>)
    ).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    chartData = monthlyCounts;
  }

  return (
    <DashboardLayout title="Analytics" href="/admin/analytics">
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Trips Analytics</h1>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {stats.map((stat, i) => {
            const isSelected = stat.label === selectedLabel;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow transition
                ${isSelected ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}
                cursor-pointer hover:bg-gray-50`}
                onClick={() => {
                  setSelectedLabel(stat.label);
                  stat.onClick();
                }}
              >
                <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 shadow rounded-xl border">
          <h2 className="text-lg font-semibold mb-4">
            {activeStatus === 'users'
              ? 'Total Users'
              : activeStatus === 'income'
              ? 'Income Over Time'
              : activeStatus
              ? `${activeStatus.charAt(0).toUpperCase() + activeStatus.slice(1)} Trips Over Time`
              : 'All Trips Over Time'}
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
                <Bar
                  dataKey="count"
                  fill={activeStatus ? chartColors[activeStatus] : '#3b82f6'}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
