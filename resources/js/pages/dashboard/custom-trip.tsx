import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData, User, PreferredVan, VanCategory } from '@/types';
import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState, FormEventHandler } from 'react';
import '../../../css/dashboard.css';
import { LayoutDashboard, Plane, Truck } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import VanSelection from "@/components/van-selection";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import InputError from "@/components/input-error";

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
        notes: '',
    });

    const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
    const [drivers, setDrivers] = useState<User[]>([]);
    const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);
    const [vanCategoryList, setVanCategoryList] = useState<VanCategory[]>(vanCategories);
    const [formError, setFormError] = useState<string>('');
    const [formSuccess, setFormSuccess] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const toggleVanSelection = (vanId: number) => {
        if(selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setFormData({...formData, preferred_van_id: null});
        } else {
            setSelectedVanIds([vanId]);
            setFormData({...formData, preferred_van_id: vanId});
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        setFormError('');
        setFormSuccess('');
        setErrors({});

        router.post(route('customTrips.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setFormSuccess('Custom trip submitted successfully!');
                setFormData({
                    ...formData,
                    date_of_trip: '',
                    pickup_time: '',
                    dropoff_time: '',
                    pickup_address: auth.user.address || '',
                    destination: '',
                    preferred_van_id: null,
                });
                setSelectedVanIds([]);
            },
            onError: (errs: any) => {
                setFormError('Please check the required fields.');
                setErrors(errs);
            },
        });
    };

    return (
        <DashboardLayout title="" href="/dashboard">
            <div className="flex mb-2 gap-2">
                <Link href="/dashboard" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><LayoutDashboard /> Dashboard</Link>
                <Link href="/custom-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-[#f1c5c3]"><Truck className="fill-black" /> Custom Trip</Link>
                <Link href="/local-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent"><Plane className="fill-black" /> Local Trip</Link>
            </div>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
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

                    <div className="p-4">
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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
                                <Label required>Date of Trip</Label>
                                <DatePicker
                                    selected={formData.date_of_trip ? new Date(formData.date_of_trip) : null}
                                    onChange={(date: Date | null) => date && setFormData({...formData, date_of_trip: date.toISOString().split('T')[0]})}
                                    className="w-full border px-3 py-2 rounded-md"
                                    placeholderText="Select date of trip"
                                    minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
                                />
                                <InputError message={errors.date_of_trip} className="mt-2" />
                            </div>

                            {/* Pick-up & Drop-off Time */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label required>Pick-up Time</Label>
                                    <Input type="time" value={formData.pickup_time} onChange={(e) => setFormData({...formData, pickup_time: e.target.value})} />
                                    <InputError message={errors.pickup_time} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label required>Drop-off Time</Label>
                                    <Input type="time" value={formData.dropoff_time} onChange={(e) => setFormData({...formData, dropoff_time: e.target.value})} />
                                    <InputError message={errors.dropoff_time} className="mt-2" />
                                </div>
                            </div>

                            {/* Pickup & Destination */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <Label required>Pickup Address</Label>
                                    <Input type="text" value={formData.pickup_address} onChange={(e) => setFormData({...formData, pickup_address: e.target.value})} />
                                    <InputError message={errors.pickup_address} className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label required>Destination</Label>
                                    <Input type="text" value={formData.destination} onChange={(e) => setFormData({...formData, destination: e.target.value})} />
                                    <InputError message={errors.destination} className="mt-2" />
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="grid gap-2">
                                <Label>Notes</Label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full border px-3 py-2 rounded-md"
                                    placeholder="Any additional notes..."
                                    rows={4}
                                />
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Preferred Van */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Preferred Vans (Optional)</h2>
                                <VanSelection
                                    preferredVans={vanList}
                                    drivers={drivers ?? []}
                                    small={true}
                                    vanCategories={vanCategoryList}
                                    selectedVanIds={selectedVanIds}
                                    onSelect={toggleVanSelection}
                                />
                                <InputError message={errors.preferred_van_id} className="mt-2" />
                            </div>

                            <Button type="submit" className="w-full mt-4">SUBMIT</Button>

                            {/* Form Messages */}
                            {formError && (
                                <div className="bg-red-100 text-red-800 p-3 rounded mt-2 text-center">
                                    {formError}
                                </div>
                            )}
                            {formSuccess && (
                                <div className="bg-green-100 text-green-800 p-3 rounded mt-2 text-center">
                                    {formSuccess}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
