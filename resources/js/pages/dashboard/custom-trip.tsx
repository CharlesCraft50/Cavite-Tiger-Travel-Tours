import BookingList from '@/components/booking-list';
import BookingListCard from '@/components/booking-list-card';
import PackageListCard from '@/components/package-list-card';
import PriceSign from '@/components/price-sign';
import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData, TourPackage, User, PreferredVan, VanCategory } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import '../../../css/dashboard.css';
import BottomNav from '@/components/ui/bottom-nav';
import clsx from 'clsx';
import { LayoutDashboard, Plane, Truck } from 'lucide-react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import FormLayout from "@/layouts/form-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import VanSelection from "@/components/van-selection";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";

type DashboardProps = {
    bookingCount: number;
    userBookings: Booking[];
    preferredVans: PreferredVan[];
    vanCategories: VanCategory[];
};

export default function CustomTrip({ bookingCount, userBookings, preferredVans, vanCategories }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);
    const [packages, setPackages] = useState<TourPackage[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // --- Fetch Packages ---
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

    // --- Form State ---
    const [formData, setFormData] = useState({
        first_name: auth.user.first_name || '',
        last_name: auth.user.last_name || '',
        contact_number: auth.user.contact_number || '',
        email: auth.user.email || '',
        date_of_trip: '',
        pickup_time: '',
        dropoff_time: '',
        pickup_address: auth.user.address || '',
        destination: '',
        preferred_van_id: null as number | null,
    });

    const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
    const [drivers, setDrivers] = useState<User[]>([]);

    const toggleVanSelection = (vanId: number) => {
        if(selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setFormData({...formData, preferred_van_id: null});
        } else {
            setSelectedVanIds([vanId]);
            setFormData({...formData, preferred_van_id: vanId});
        }
    };

    const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);
    const [vanCategoryList, setVanCategoryList] = useState<VanCategory[]>(vanCategories);

    return (
        <DashboardLayout title="" href="/dashboard">
            {/* Top Navigation */}
            <div className="flex mb-2 gap-2">
                <Link href="/dashboard" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><LayoutDashboard /> Dashboard</Link>
                <Link href="/custom-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-[#f1c5c3]"><Truck className="fill-black" /> Custom Trip</Link>
                <Link href="/local-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><Plane className="fill-black" /> Local Trip</Link>
            </div>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Custom Trip!</h1>
                            {!(isAdmins || isDrivers) && (
                                <p className="text-gray-600 dark:text-gray-300">
                                    Choose your desired trips and vehicles.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* CustomTrip Form */}
                    {!isAdmins && !isDrivers && (
                        <div className="p-4">
                            <form className="flex flex-col gap-6">
                                {/* Name */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label>First Name</Label>
                                        <Input value={formData.first_name} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Last Name</Label>
                                        <Input value={formData.last_name} disabled />
                                    </div>
                                </div>

                                {/* Contact & Email */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label>Contact Number</Label>
                                        <Input value={formData.contact_number} disabled />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input value={formData.email} disabled />
                                    </div>
                                </div>

                                {/* Date of Trip */}
                                <div className="grid gap-2">
                                    <Label>Date of Trip</Label>
                                    <DatePicker
                                        selected={formData.date_of_trip ? new Date(formData.date_of_trip) : null}
                                        onChange={(date: Date | null) => date && setFormData({...formData, date_of_trip: date.toISOString().split('T')[0]})}
                                        className="w-full border px-3 py-2 rounded-md"
                                        placeholderText="Select date of trip"
                                    />
                                </div>

                                {/* Pick-up & Drop-off Time */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label>Pick-up Time</Label>
                                        <Input type="time" value={formData.pickup_time} onChange={(e) => setFormData({...formData, pickup_time: e.target.value})} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Drop-off Time</Label>
                                        <Input type="time" value={formData.dropoff_time} onChange={(e) => setFormData({...formData, dropoff_time: e.target.value})} />
                                    </div>
                                </div>

                                {/* Pickup & Destination */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="grid gap-2">
                                        <Label>Pickup Address</Label>
                                        <Input type="text" value={formData.pickup_address} onChange={(e) => setFormData({...formData, pickup_address: e.target.value})} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Destination</Label>
                                        <Input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
                                    </div>
                                </div>

                                {/* Preferred Van */}
                                <div className="space-y-10">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">Preferred Vans</h2>
                                        <VanSelection
                                            preferredVans={vanList}
                                            drivers={drivers ?? []}
                                            small={true}
                                            vanCategories={vanCategoryList}
                                            selectedVanIds={selectedVanIds}
                                            onSelect={toggleVanSelection}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full mt-4">SUBMIT</Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
