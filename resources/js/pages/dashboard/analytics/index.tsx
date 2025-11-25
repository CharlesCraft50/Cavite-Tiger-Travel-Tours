import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, CustomTrip, SharedData } from '@/types';
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
  CheckCircle,
  CircleSlash2Icon,
  Clock,
  DollarSign,
  UserCircle,
  XCircle,
  Download,
  FileText,
  Crown, // Added for most popular package
  TrendingUp, // Added for revenue
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { usePage } from '@inertiajs/react';

const chartColors: Record<string, string> = {
  accepted: '#22c55e',
  pending: '#facc15',
  declined: '#ef4444',
  past_due: '#9ca3af',
  users: '#3b82f6',
  income: '#10b981',
  cancelled: '#7f1d1d',
  on_process: '#f59e0b',
  completed: '#00c84f',
};

type AnalyticsProps = {
  bookings: Booking[];
  customTrips: CustomTrip[];
  userCount: number;
};

type SalesReportData = {
  period: string;
  totalRevenue: number;
  totalBookings: number;
  totalCustomTrips: number;
  completedTrips: number;
  pendingPayments: number;
  averageRevenuePerBooking: number;
  mostPopularPackage: string;
  mostBookedPackage: string; // New field
  mostBookedPackageRevenue: number; // New field
  revenueByMonth: Array<{ month: string; revenue: number }>;
  bookingStatusBreakdown: Record<string, number>;
  topRevenuePackages: Array<{ name: string; revenue: number }>;
};

export default function Analytics({
  bookings,
  customTrips,
  userCount,
}: AnalyticsProps) {
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState('Total Bookings');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<SalesReportData | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Combine bookings and custom trips into one array for unified analytics
  const allTrips = [...bookings, ...customTrips];

  // Filter trips by date range
  const filteredTrips = allTrips.filter(trip => {
    const tripDate = new Date(trip.created_at);
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    endDate.setHours(23, 59, 59, 999); // Include entire end date
    
    return tripDate >= startDate && tripDate <= endDate;
  });

  // Accepted (paid and not cancelled)
  const acceptedTrips = filteredTrips.filter(
    (t) =>
      t.payment?.status?.toLowerCase() === 'accepted' &&
      t.status?.toLowerCase() !== 'cancelled'
  );

  const totalIncome = acceptedTrips.reduce(
    (sum, t) => sum + Number(t.total_amount ?? 0),
    0
  );

  // Calculate most booked package and its revenue
  const calculateMostBookedPackage = () => {
    const bookingsInPeriod = filteredTrips.filter(t => 'tour_package_id' in t);
    
    const packageStats = bookingsInPeriod.reduce((acc, booking) => {
      if (booking.tour_package) {
        const packageName = booking.tour_package?.title || 'Unknown Package';
        if (packageName && packageName !== 'na') {
          if (!acc[packageName]) {
            acc[packageName] = {
              count: 0,
              revenue: 0
            };
          }
          acc[packageName].count += 1;
          acc[packageName].revenue += Number(booking.total_amount ?? 0);
        }
      }
      return acc;
    }, {} as Record<string, { count: number; revenue: number }>);

    const mostBookedPackageEntry = Object.entries(packageStats)
      .filter(([name]) => name && name !== 'na' && name.toLowerCase() !== 'unknown package')
      .sort(([, a], [, b]) => b.count - a.count)[0];

    return mostBookedPackageEntry 
      ? {
          name: mostBookedPackageEntry[0],
          count: mostBookedPackageEntry[1].count,
          revenue: mostBookedPackageEntry[1].revenue
        }
      : null;
  };

  const mostBookedPackage = calculateMostBookedPackage();

  const stats = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
      label: 'Total Trips',
      value: filteredTrips.length,
      onClick: () => setActiveStatus(null),
    },
    {
      icon: <CalendarCheck className="h-6 w-6 text-green-600" />,
      label: 'Accepted',
      value: filteredTrips.filter((t) => t.status === 'accepted').length,
      onClick: () => setActiveStatus('accepted'),
    },
    {
      icon: <Clock className="h-6 w-6 text-yellow-600" />,
      label: 'Pending',
      value: filteredTrips.filter((t) => t.status === 'pending').length,
      onClick: () => setActiveStatus('pending'),
    },
    {
      icon: <Clock className="h-6 w-6 text-amber-600" />,
      label: 'On Process',
      value: filteredTrips.filter((t) => t.status === 'on_process').length,
      onClick: () => setActiveStatus('on_process'),
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      label: 'Declined',
      value: filteredTrips.filter((t) => t.status === 'declined').length,
      onClick: () => setActiveStatus('declined'),
    },
    {
      icon: <Clock className="h-6 w-6 text-gray-500" />,
      label: 'Past Due',
      value: filteredTrips.filter((t) => t.status === 'past_due').length,
      onClick: () => setActiveStatus('past_due'),
    },
    {
      icon: <CircleSlash2Icon className="h-6 w-6 text-red-900" />,
      label: 'Cancelled',
      value: filteredTrips.filter((t) => t.status === 'cancelled').length,
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
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      label: 'Completed',
      value: filteredTrips.filter((t) => t.is_completed == true).length,
      onClick: () => setActiveStatus('completed'),
    },
    // New: Most Booked Package
    {
      icon: <Crown className="h-6 w-6 text-purple-500" />,
      label: 'Most Booked Package',
      value: mostBookedPackage ? `${mostBookedPackage.name} (${mostBookedPackage.count})` : 'No data',
      onClick: () => setActiveStatus(null),
    },
    // New: Most Booked Package Revenue
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      label: 'Most Booked Revenue',
      value: mostBookedPackage ? `₱ ${mostBookedPackage.revenue.toLocaleString()}` : '₱ 0',
      onClick: () => setActiveStatus(null),
    },
  ];

  // Filter trips based on selected status
  const statusFilteredTrips = activeStatus
    ? activeStatus == 'completed'
      ? filteredTrips.filter((t) => t.is_completed == true)
      : filteredTrips.filter((t) => t.status === activeStatus)
    : filteredTrips;

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
      statusFilteredTrips.reduce((acc, t) => {
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

  const generateSalesReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Calculate report data
      const bookingsInPeriod = filteredTrips.filter(t => 'tour_package_id' in t);
      const customTripsInPeriod = filteredTrips.filter(t => 'trip_type' in t);
      
      // Calculate revenue by month
      const revenueByMonth = Object.values(
        acceptedTrips.reduce((acc, t) => {
          const month = new Date(t.created_at).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          });
          acc[month] = acc[month] || { month, revenue: 0 };
          acc[month].revenue += Number(t.total_amount ?? 0);
          return acc;
        }, {} as Record<string, { month: string; revenue: number }>)
      ).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

      // Booking status breakdown
      const bookingStatusBreakdown = filteredTrips.reduce((acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Top revenue packages
      const packageRevenue = bookingsInPeriod.reduce((acc, booking) => {
        if (booking.tour_package) {
          const packageName = booking.tour_package.title;
          acc[packageName] = (acc[packageName] || 0) + Number(booking.total_amount ?? 0);
        }
        return acc;
      }, {} as Record<string, number>);

      const topRevenuePackages = Object.entries(packageRevenue)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Most popular package (by booking count)
      const packageCounts = bookingsInPeriod.reduce((acc, booking) => {
        if (booking.tour_package) {
          const packageName = booking.tour_package?.title || 'Unknown Package';
          if (packageName && packageName !== 'na') {
            acc[packageName] = (acc[packageName] || 0) + 1;
          }
        }
        return acc;
      }, {} as Record<string, number>);

      // Find the package with the highest booking count
      const mostPopularPackageEntry = Object.entries(packageCounts)
        .filter(([title]) => title && title !== 'na' && title.toLowerCase() !== 'unknown package')
        .sort(([, a], [, b]) => b - a)[0];

      const mostPopularPackage = mostPopularPackageEntry 
        ? `${mostPopularPackageEntry[0]} (${mostPopularPackageEntry[1]} bookings)`
        : 'No package data available';

      // Calculate most booked package details for report
      const mostBookedPackageStats = calculateMostBookedPackage();

      const report: SalesReportData = {
        period: `${new Date(dateRange.startDate).toLocaleDateString()} - ${new Date(dateRange.endDate).toLocaleDateString()}`,
        totalRevenue: totalIncome,
        totalBookings: bookingsInPeriod.length,
        totalCustomTrips: customTripsInPeriod.length,
        completedTrips: filteredTrips.filter(t => t.is_completed).length,
        pendingPayments: filteredTrips.filter(t => t.payment?.status === 'pending').length,
        averageRevenuePerBooking: acceptedTrips.length > 0 ? totalIncome / acceptedTrips.length : 0,
        mostPopularPackage,
        mostBookedPackage: mostBookedPackageStats 
          ? `${mostBookedPackageStats.name} (${mostBookedPackageStats.count} bookings)`
          : 'No package data available',
        mostBookedPackageRevenue: mostBookedPackageStats?.revenue || 0,
        revenueByMonth,
        bookingStatusBreakdown,
        topRevenuePackages,
      };

      setReportData(report);

      // Auto-save the report
      await autoSaveReport(report);
      
      // Generate PDF
      await generatePDF(report);
      
    } catch (error) {
      console.error('Error generating sales report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const { auth } = usePage<SharedData>().props;

  const autoSaveReport = async (report: SalesReportData) => {
    try {
      const response = await fetch('/api/sales-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          report_data: report,
          date_range: dateRange,
          generated_at: new Date().toISOString(),
          user_id: auth.user.id,
        }),
      });

      if (response.ok) {
        console.log('Sales report saved successfully');
      }
    } catch (error) {
      console.error('Error auto-saving report:', error);
    }
  };

  const generatePDF = async (report: SalesReportData) => {
    try {
      const response = await fetch('/api/generate-sales-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ report }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `sales-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <DashboardLayout title="Analytics" href="/admin/analytics">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Trips Analytics</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Sales Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Generate Sales Report</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      type="date"
                      id="startDate"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      type="date"
                      id="endDate"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {reportData && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Report Preview:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Period: {reportData.period}</div>
                      <div>Total Revenue: ₱{reportData.totalRevenue.toLocaleString()}</div>
                      <div>Total Bookings: {reportData.totalBookings}</div>
                      <div>Custom Trips: {reportData.totalCustomTrips}</div>
                      <div>Completed Trips: {reportData.completedTrips}</div>
                      <div>Avg Revenue/Booking: ₱{reportData.averageRevenuePerBooking.toLocaleString()}</div>
                      <div>Most Popular Package: {reportData.mostPopularPackage}</div>
                      <div>Most Booked Package: {reportData.mostBookedPackage}</div>
                      <div>Most Booked Revenue: ₱{reportData.mostBookedPackageRevenue.toLocaleString()}</div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={generateSalesReport}
                  disabled={isGeneratingReport}
                  className="w-full flex items-center gap-2"
                >
                  {isGeneratingReport ? (
                    <>Generating Report...</>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Download PDF Report
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => {
            const isSelected = stat.label === selectedLabel;
            return (
              <div
                key={i}
                className={`flex items-center gap-4 p-4 rounded-xl border shadow transition
                ${isSelected ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-800' : 'bg-white dark:bg-accent border-gray-200 dark:border-gray-600'}
                cursor-pointer hover:bg-gray-50`}
                onClick={() => {
                  setSelectedLabel(stat.label);
                  stat.onClick();
                }}
              >
                <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded-full">{stat.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-200 truncate">{stat.label}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-accent p-6 shadow rounded-xl border">
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
            <p className="text-gray-500 dark:text-white">No data available.</p>
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