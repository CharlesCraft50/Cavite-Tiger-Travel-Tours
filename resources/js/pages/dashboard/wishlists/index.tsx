import PackageListCard from '@/components/package-list-card';
import DashboardLayout from '@/layouts/dashboard-layout';
import { TourPackage, Wishlist } from '@/types';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

type WishlistProps = {
    wishlists: Wishlist[];
};

export default function Index({ wishlists }: WishlistProps) {
    const [packages, setPackages] = useState<TourPackage[]>([]);

    useEffect(() => {
        const extractedPackages = wishlists
            .map(wishlist => wishlist.tour_package)
            .filter((pkg): pkg is TourPackage => pkg !== undefined && pkg !== null);
        setPackages(extractedPackages);
    }, [wishlists]);

    return (
        <DashboardLayout title="Wishlist" href="/wishlists">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                <div className="flex flex-row items-center m-4 mb-4">
                    <Heart className="mr-1 h-5 w-5 text-red-500" />
                    <h2 className="text-xl font-semibold">Wishlist</h2>
                </div>
                <PackageListCard
                    packages={packages}
                />
            </div>
        </DashboardLayout>
    );
}
