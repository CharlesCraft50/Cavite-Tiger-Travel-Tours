import { TourPackage } from '@/types';
import { Link } from '@inertiajs/react';
import { Button } from './ui/button';
import PriceSign from './price-sign';

type PackageListCardProps = {
  packages: TourPackage[];
  limit?: number;
  searchable?: boolean;
  searchQuery?: string;
};

export default function PackageListCard({ packages, limit, searchable, searchQuery }: PackageListCardProps) {
  const filteredPackages = searchable && searchQuery
    ? packages.filter(pkg =>
        pkg.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : packages;

  const displayedPackages = limit ? filteredPackages.slice(0, limit) : filteredPackages;

  if (displayedPackages.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🏖️</div>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-2">No packages available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for amazing deals!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayedPackages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
        >
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-32 md:w-40 h-32 sm:h-24 md:h-28 overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
              {pkg.image_overview ? (
                <img
                  src={pkg.image_overview}
                  alt={pkg.title ?? 'Tour package'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🏞️</div>
                    <div className="text-xs">No image</div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                  {pkg?.title || 'Untitled Package'}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-xl font-bold text-primary flex items-center gap-1">
                      <PriceSign />
                      <span>{pkg.base_price?.toLocaleString() || 'N/A'}</span>
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">per person</span>
                  </div>

                  <Link
                    href={route('localTrip', { package: pkg?.slug })}
                    className="flex-shrink- cursor-pointer"
                  >
                    <Button 
                      type="button" 
                      className="bg-primary hover:bg-primary hover:opacity-90 text-white px-2 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Show all packages hint */}
      {/* {limit && packages.length > limit && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {limit} of {packages.length} packages
          </p>
        </div>
      )} */}
    </div>
  );
}