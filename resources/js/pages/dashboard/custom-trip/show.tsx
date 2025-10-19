import CustomTripDetails from '@/components/custom-trip-details';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, CustomTrip, OtherService, PreferredVan, TourPackage, VanCategory } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

type CustomTripDetailProps = {
    booking: CustomTrip;
    vans: PreferredVan[];
    isAdmin?: boolean;
    vanCategories: VanCategory[];
};

export default function Show({ booking, vans, isAdmin, vanCategories }: CustomTripDetailProps) {
    useEffect(()=>{
        console.log(vanCategories);
    }, [vanCategories]);

    return (
        <DashboardLayout title="Custom Trip" href="/bookings">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Custom Trip Details</h1>
                </div>
        
                <Link
                    href="/custom-trips"
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm hover:bg-gray-50"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </Link>
            </div>

            <CustomTripDetails
                trip={booking}
                preferredVans={vans}
                vanCategories={vanCategories}
                editable={!!isAdmin}
            />
        </DashboardLayout>
    );
}
