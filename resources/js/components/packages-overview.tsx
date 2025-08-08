import { TourPackage } from '@/types';
import React from 'react';
import OverviewContent from './overview-content';
import { ArrowLeft, ArrowRight, PencilIcon } from 'lucide-react';
import clsx from 'clsx';
import { Link, router } from '@inertiajs/react';

type PackagesOverviewContent = {
  currentPackages: TourPackage[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isAdmin?: boolean;
};

export default function PackagesOverview({
  currentPackages,
  totalPages,
  currentPage,
  setCurrentPage,
  isAdmin,
}: PackagesOverviewContent) {
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto grid gap-4">
        {currentPackages.map((p) => (
          <div key={p.id} className="relative">
            <OverviewContent packageData={p} />

            {isAdmin && (
              <Link 
                className="btn-primary cursor-pointer absolute top-2 right-2"
                href={`/packages/${p.id}/edit`}
              >
                <PencilIcon className="w-4 h-4 text-white" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 mt-10 z-10 bg-white/80 backdrop-blur-md border-t px-6 py-4 flex justify-between items-center shadow-md rounded-b-xl">
          {/* Prev button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Prev
            </div>
          </button>

          {/* Page dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={clsx(
                  'w-3 h-3 rounded-full transition-all duration-300 cursor-pointer',
                  currentPage === index
                    ? 'bg-primary scale-125 shadow-sm'
                    : 'bg-gray-300 hover:bg-gray-400'
                )}
                aria-label={`Page ${index + 1}`}
              />
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            disabled={currentPage === totalPages - 1}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
