import { TourPackage } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from './ui/button';
import PriceSign from './price-sign';

type PackageListCardProps = {
  packages: TourPackage[];
  limit?: number;
};

export default function PackageListCard({ packages, limit }: PackageListCardProps) {
  const displayedPackages = limit ? packages.slice(0, limit) : packages;

  if (displayedPackages.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[100px]">
        <p className="text-gray-500 text-lg font-medium">No packages</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 max-w-7xl w-full">
        {displayedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full"
          >
            {/* Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={pkg.image_overview ?? ''}
                alt={pkg.title ?? 'Tour package'}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-3">
              <h3 className="font-semibold text-base text-gray-900 mb-1 line-clamp-2">
                {pkg?.title}
              </h3>

              <p className="text-md text-gray-900 mb-2 font-semibold flex items-center gap-1">
                <PriceSign />
                {pkg.base_price}
              </p>

              <div className="flex justify-end">
                <Link
                  href={route('packages.show', {
                    slug: pkg?.slug,
                  })}
                >
                  <Button type="button" className="px-4 py-1 cursor-pointer">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
