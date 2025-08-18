import BookingList from '@/components/booking-list';
import BookingListCard from '@/components/booking-list-card';
import PackageListCard from '@/components/package-list-card';
import PriceSign from '@/components/price-sign';
import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData, TourPackage } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/dashboard.css';
import BottomNav from '@/components/ui/bottom-nav';
import clsx from 'clsx';

type DashboardProps = {
    bookingCount: number;
    userBookings: Booking[];
};

export default function Dashboard({ bookingCount, userBookings }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);
    const [packages, setPackages] = useState<TourPackage[]>([]);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages/latest');
                const packages = response.json();
                setPackages(await packages);
            } catch (error) {
                console.error('Error fetching packages: ', error);
            }
        }

        fetchPackages();
    }, []);

    const upcomingTrips = userBookings.filter(b => new Date(b.departure_date) > new Date()).length;
    const totalSpent = userBookings.reduce((sum, b) => sum + Number(b.total_amount ?? 0), 0);

    return (
        <DashboardLayout title="Dashboard" href="/dashboard">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            Welcome back, {auth.user.name}!
                        </h1>
                        {!(isAdmins || isDrivers) && (
                            <p className="text-gray-600 dark:text-gray-300">
                                You have {upcomingTrips} upcoming trip{upcomingTrips !== 1 ? 's' : ''} — ready for adventure?
                            </p>
                        )}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Upcoming Trips */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Upcoming Trips</h3>
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {upcomingTrips}
                                </div>
                            </div>
                        </div>

                        {/* Total Completed */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{!(isAdmins || isDrivers) ? "Total Completed Trips" : "Accepted"}</h3>
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    {bookingCount - upcomingTrips}
                                </div>
                            </div>
                        </div>

                        {/* Total Spent */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                            <div className="text-center">
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{!(isAdmins || isDrivers) ? "Total Spent" : "Revenue"}</h3>
                                <div className="flex items-center justify-center text-4xl font-bold text-yellow-600 mb-2">
                                    <PriceSign />
                                    <span>{totalSpent.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    <div className={clsx("grid gap-8", !(isAdmins || isDrivers) && "grid-cols-1 xl:grid-cols-2")}>
                        {/* Upcoming Trips Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {(isAdmins || isDrivers) ? 'Recent Bookings' : 'Upcoming Trips'}
                                </h2>
                                {userBookings.length > 3 && (
                                    <Link 
                                        href="/bookings" 
                                        className="text-primary hover:opacity-80 font-medium text-sm transition-opacity duration-200"
                                    >
                                        View All →
                                    </Link>
                                )}
                            </div>
                            
                            <div className="space-y-4">
                                {(isAdmins || isDrivers) ? (
                                    <BookingList bookings={userBookings} limit={3} />
                                ) : (
                                    <BookingListCard bookings={userBookings} limit={3} />
                                )}
                                
                                {userBookings.length === 0 && (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <p>No trips scheduled yet</p>
                                        {!(isAdmins || !isDrivers) && (
                                            <Link 
                                                href="/packages" 
                                                className="inline-block mt-4 bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg transition-opacity duration-200"
                                            >
                                                Browse Packages
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recommended Packages Section */}
                        {!(isAdmins || isDrivers) && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                        Recommended for You
                                    </h2>
                                    <Link 
                                        href="/packages" 
                                        className="text-primary hover:opacity-80 font-medium text-sm transition-opacity duration-200"
                                    >
                                        View All →
                                    </Link>
                                </div>
                                
                                <div className="space-y-4">
                                    <PackageListCard packages={packages} limit={3} />
                                    
                                    {packages.length === 0 && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Additional Action Cards for regular users */}
                    {!(isAdmins || isDrivers) && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link 
                                href="/packages" 
                                className="bg-primary hover:opacity-90 text-white rounded-2xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Explore Packages</h3>
                                        <p className="text-pink-100">Discover amazing destinations</p>
                                    </div>
                                    <div className="text-3xl group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
                                        ✈️
                                    </div>
                                </div>
                            </Link>

                            <Link 
                                href="/bookings" 
                                className="bg-green-500 hover:bg-green-600 text-white rounded-2xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">My Bookings</h3>
                                        <p className="text-green-100">View your travel history</p>
                                    </div>
                                    <div className="text-3xl group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
                                        📋
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {!(isAdmins || isDrivers) && (
                <BottomNav />
            )}
        </DashboardLayout>
    );
}