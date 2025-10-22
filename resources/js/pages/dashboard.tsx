import BookingList from '@/components/booking-list';
import BookingListCard from '@/components/booking-list-card';
import PackageListCard from '@/components/package-list-card';
import PriceSign from '@/components/price-sign';
import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver, isStaff } from '@/lib/utils';
import { Booking, CustomTrip, SharedData, TourPackage } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../css/dashboard.css';
import BottomNav from '@/components/ui/bottom-nav';
import clsx from 'clsx';
import { Button } from '@headlessui/react';
import { LayoutDashboard, Plane, Truck } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import CustomTripList from '@/components/custom-trip-list';
import TripList from '@/components/trip-list';

type DashboardProps = {
    bookingCount: number;
    userBookings: Booking[];
    userCustomTrips: CustomTrip[],
};

export default function Dashboard({ bookingCount, userBookings, userCustomTrips }: DashboardProps) {
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

    const allTrips = [
        ...userBookings.map(b => ({
            type: 'booking' as const,
            id: b.id,
            date: new Date(b.departure_date),
            status: b.status,
            total_amount: b.total_amount ?? 0,
            paymentStatus: b.payment?.status ?? '',
        })),
        ...userCustomTrips.map(t => ({
            type: 'custom' as const,
            id: t.id,
            date: new Date(t.date_of_trip),
            status: t.status,
            total_amount: t.total_amount ?? 0,
            paymentStatus: t.payment?.status ?? '',
        })),
    ];

    useEffect(() => {
        console.log(userCustomTrips);
    }, []);

    const upcomingTrips = allTrips.filter(t => t.date > new Date()).length;
    const acceptedTrips = allTrips.filter(t => {
    const status = t.paymentStatus?.toLowerCase() ?? '';
    return ['accepted', 'paid', 'success'].includes(status) && 
            t.status.toLowerCase() !== 'cancelled';
    });
    const totalSpent = acceptedTrips.reduce((sum, t) => sum + Number(t.total_amount ?? 0), 0);

    useEffect(() => {
        console.table(allTrips.map(t => ({
        type: t.type,
        id: t.id,
        status: t.status,
        paymentStatus: t.paymentStatus,
        total_amount: t.total_amount
        })));
    }, [allTrips]);

    return (
        <DashboardLayout title="" href="/dashboard">
            <div className="flex mb-2 gap-2">
                <Link href="/dashboard" className="border rounded-lg px-4 py-2 flex gap-2 bg-[#f1c5c3]"><LayoutDashboard /> Dashboard</Link>
                {!isDrivers && (
                    <>
                        <Link href="/custom-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><Truck className="fill-black" /> Custom Trip</Link>
                        <Link href="/local-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><Plane className="fill-black" /> Local Trip</Link>
                    </>
                )}
            </div>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            Welcome, {auth.user.first_name}!
                        </h1>
                        {!(isAdmins || isDrivers) && (
                            <p className="text-gray-600 dark:text-gray-300">
                                You have {upcomingTrips} upcoming trip{upcomingTrips !== 1 ? 's' : ''} — ready for adventure?
                            </p>
                        )}
                        {!(isAdmins || isDrivers) && (
                            <div className="flex justify-center mt-4 px-4">
                                <div className="container mx-auto px-4 mt-4 max-w-4xl"> {/* keeps consistent width */}
                                    <Swiper
                                        modules={[Autoplay, Pagination]}
                                        spaceBetween={20}
                                        slidesPerView={1}
                                        loop={true}
                                        autoplay={{
                                            delay: 3000,
                                            disableOnInteraction: false,
                                        }}
                                        pagination={{
                                            clickable: true,
                                            dynamicBullets: true,
                                        }}
                                        className="rounded-xl overflow-hidden shadow-md"
                                        >
                                        {[
                                            "https://i.ibb.co/cXRrgPNs/ctt-c-6.jpg",
                                            "https://i.ibb.co/Wv4F3SfC/ctt-c-5.jpg",
                                            "https://i.ibb.co/BWwC1cp/ctt-c-4.jpg",
                                            "https://i.ibb.co/tpShGxt7/Untitled-12.png",
                                            "https://i.ibb.co/hxrDk4Nh/Untitled-11.png",
                                            "https://i.ibb.co/d0qVY7XK/Untitled-10.png",
                                            "https://i.ibb.co/jv8DKxtY/Untitled-8.png",
                                            "https://i.ibb.co/3m8LTGv6/Untitled-6.png",
                                            "https://i.ibb.co/Kzfvf4CR/Untitled-5.png",
                                            "https://i.ibb.co/Qv4tmbnC/Untitled-4.png",
                                            "https://i.ibb.co/BHrkpD6T/Untitled-3.png",
                                            "https://i.ibb.co/23MbNhKj/Untitled-1.png",
                                        ].map((url, index) => (
                                            <SwiperSlide key={index}>
                                            <img
                                                src={url}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-64 sm:h-64 md:h-72 lg:h-120 object-cover"
                                            />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                </div>
                            </div>
                        )}
                    </div>

                    

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
                        <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Upcoming Trips
                        </h3>
                        <div className="text-4xl font-bold text-primary mb-2">
                            {upcomingTrips}
                        </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
                        <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Accepted Trips
                        </h3>
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {acceptedTrips.length}
                        </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border">
                        <div className="text-center">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            {!(isAdmins || isDrivers) ? "Total Spent" : "Revenue"}
                        </h3>
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
                            {allTrips.length > 3 && (
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
                            <TripList customTrips={userCustomTrips} bookings={userBookings} limit={3} />
                            ) : (
                            allTrips.length > 0 ? (
                                allTrips
                                .filter(t => t.date > new Date()) // upcoming only
                                .sort((a, b) => a.date.getTime() - b.date.getTime()) // soonest first
                                .slice(0, 3)
                                .map((trip) => (
                                    <Link
                                    key={`${trip.type}-${trip.id}`}
                                    href={
                                        trip.type === 'custom'
                                        ? route('customTrips.show', trip.id)
                                        : route('bookings.show', trip.id)
                                    }
                                    className="block border rounded-lg p-4 hover:bg-gray-50 transition-all duration-200"
                                    >
                                    <div className="flex justify-between items-center">
                                        <div>
                                        <p className="font-semibold text-gray-900">
                                            {trip.type === 'custom' ? (
                                            <>
                                                Custom Trip
                                                {/* <span className="ml-2 text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">Custom</span> */}
                                            </>
                                            ) : (
                                                'Local Trip'
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {trip.date.toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            })}
                                        </p>
                                        </div>

                                        <div className="text-right">
                                        <p
                                            className={clsx(
                                            'text-sm font-medium capitalize',
                                            trip.status === 'completed' && 'text-green-600',
                                            trip.status === 'cancelled' && 'text-red-600',
                                            trip.status === 'pending' && 'text-yellow-600'
                                            )}
                                        >
                                            {trip.status.replace(/_/g, ' ')}
                                        </p>
                                        <div className="flex items-center justify-end text-primary">
                                            <PriceSign />
                                            <p className="text-base font-medium">
                                            {Number(trip.total_amount).toLocaleString()}
                                            </p>
                                        </div>
                                        </div>
                                    </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>No upcoming trips yet.</p>
                                    <Link
                                        href={route('localTrip')}
                                        className="inline-block mt-4 bg-primary hover:opacity-90 text-white px-6 py-2 rounded-lg transition-opacity duration-200"
                                    >
                                        Browse Packages
                                    </Link>
                                </div>
                            )
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
                                        href={route('localTrip')}
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
                                href="/local-trip" 
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
            {/* {!(isAdmins || isDrivers) && (
                <BottomNav />
            )} */}
        </DashboardLayout>
    );
}