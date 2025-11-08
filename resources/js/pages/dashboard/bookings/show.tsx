import BookingDetails from '@/components/booking-details';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Booking, OtherService, PreferredVan, TourPackage, VanCategory } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

type BookingDetailProps = {
    booking: Booking;
    otherServices: OtherService[];
    packages: TourPackage;
    vans: PreferredVan[];
    isAdmin?: boolean;
    vanCategories: VanCategory[];
};

export default function Show({ booking, otherServices, packages, vans, isAdmin, vanCategories }: BookingDetailProps) {
    useEffect(()=>{
        console.log(vanCategories);
    }, [vanCategories]);
    return (
        <DashboardLayout title="Bookings" href="/bookings">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">{packages.package_type == 'normal' ? 'Booking' : 'Event'} Details</h1>
                </div>
        
                <Link
                    href="/bookings"
                    className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2"
                >
                    <ArrowLeft size={16} />
                    Back to List
                </Link>
            </div>
            <BookingDetails 
                booking={booking}
                otherServices={otherServices}
                packages={packages}
                vans={vans}
                editable={!!isAdmin}
                vanCategories={vanCategories}
            />            
        </DashboardLayout>
    );
}
