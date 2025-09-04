import { TourPackage, SharedData } from '@/types';
import { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { useLoading } from '@/components/ui/loading-provider';
import { Button, Listbox, Transition } from '@headlessui/react';
import { Search, PencilIcon, ChevronDownIcon } from 'lucide-react';
import CardImageBackground from '@/components/ui/card-image-bg';
import clsx from 'clsx';
import { isAdmin } from '@/lib/utils';
import { Fragment } from 'react';

type PackagesIndexProps = {
  packages: TourPackage[];
};

const ITEMS_PER_LOAD = 8;

export default function Packages({ packages: initialPackages }: PackagesIndexProps) {
  const { auth } = usePage<SharedData>().props;
  const isAdmins = isAdmin(auth.user);

  const [toggleEdit, setToggleEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<TourPackage[]>([]);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const searchRef = useRef<HTMLDivElement>(null);

  const { start, stop } = useLoading();

  const sortedPackages = [...initialPackages].sort((a, b) => {
    const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return sortOption === 'newest' ? diff : -diff;
  });

  const [visiblePackages, setVisiblePackages] = useState<TourPackage[]>(
    sortedPackages.slice(0, ITEMS_PER_LOAD)
  );
  const [currentIndex, setCurrentIndex] = useState(ITEMS_PER_LOAD);
  const [hasMore, setHasMore] = useState(sortedPackages.length > ITEMS_PER_LOAD);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMorePackages = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    const nextIndex = currentIndex + ITEMS_PER_LOAD;
    const nextPackages = sortedPackages.slice(currentIndex, nextIndex);
    setVisiblePackages((prev) => [...prev, ...nextPackages]);
    setCurrentIndex(nextIndex);

    if (nextIndex >= sortedPackages.length) setHasMore(false);
    setLoadingMore(false);
  };

  const handleScroll = () => {
    if (!hasMore) return;
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (fullHeight - (scrollTop + windowHeight) < 200) {
      loadMorePackages();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, hasMore]);

  useEffect(() => {
    setVisiblePackages(sortedPackages.slice(0, currentIndex));
    setHasMore(sortedPackages.length > currentIndex);
  }, [sortOption]);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value) return setSearchResults([]);
    try {
      start();
      const response = await fetch(`/api/packages?search=${encodeURIComponent(value)}`);
      const data = await response.json();
      setSearchResults(data.packages);
    } catch (err) {
      console.error('Search error', err);
    } finally {
      stop();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <DashboardLayout title="Manage Packages" href="/configurations/packages">
      <Head title="Manage Packages" />

      {/* Search & buttons */}
      <div className="flex flex-row items-center w-full gap-4 mb-4">
        <div className="relative flex-grow" ref={searchRef}>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={20} />
          </span>
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            type="text"
            placeholder="Search packages..."
            className="border rounded-lg p-2 pl-9 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-64 overflow-auto">
              {searchResults.map((pkg) => (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {pkg.title}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <Listbox value={sortOption} onChange={setSortOption}>
          <div className="relative w-40">
            <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
              <span className="block truncate">
                {sortOption === 'newest' ? 'Newest to Oldest' : 'Oldest to Newest'}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </Listbox.Button>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg max-h-60 focus:outline-none sm:text-sm">
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value="newest"
                >
                  Newest to Oldest
                </Listbox.Option>
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                      active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`
                  }
                  value="oldest"
                >
                  Oldest to Newest
                </Listbox.Option>
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {isAdmins && (
          <div className="flex gap-2">
            <Button
              onClick={() => setToggleEdit(!toggleEdit)}
              className={clsx(
                'btn-primary text-sm cursor-pointer',
                toggleEdit && 'bg-gray-500'
              )}
            >
              Edit Packages
            </Button>
            <Link
              href={route('packages.create', { from: 'packages' })}
              className="btn-primary text-sm"
            >
              Add Packages
            </Link>
          </div>
        )}
      </div>

      {/* Package grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 mt-8">
        {visiblePackages.map((pkg) => (
          <div key={pkg.id} className="relative">
            <CardImageBackground
              id={pkg.id}
              inputId="image-overview-edit"
              onClick={() => {
                if (!toggleEdit) {
                  router.get(`/packages/${pkg.slug}`);
                }
              }}
              title={pkg.title}
              src={pkg.image_overview ?? ''}
              size="small"
            />

            {toggleEdit && isAdmins && (
              <div className="absolute top-2 right-8">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.get(`/packages/${pkg.id}/edit?from=packages`);
                  }}
                  className="btn-primary cursor-pointer"
                >
                  <PencilIcon className="w-4 h-4 text-white" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {loadingMore && <p className="text-center mt-2">Loading more packages...</p>}
    </DashboardLayout>
  );
}
