import { TourPackage, SharedData, Country, City } from '@/types';
import { useState, useEffect, useRef, Fragment } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Listbox, Transition } from '@headlessui/react';
import { Search, ChevronDownIcon, X, LayoutDashboard, Truck, Plane, PartyPopper } from 'lucide-react';
import CardImageBackground from '@/components/ui/card-image-bg';
import { Button } from '@/components/ui/button';
import ShowPage from '../packages/show';
import ModalLarge from '@/components/ui/modal-large';
import Index from '../packages';
import CityList from '@/components/city-list';
import { useLoading } from '@/components/ui/loading-provider';
import PackagesOverview from '@/components/packages-overview';
import clsx from 'clsx';

type PackagesIndexProps = {
  packages: TourPackage[];
  cities: City[];
  selectedCountry: Country;
};

const ITEMS_PER_LOAD = 8;

// Helper: convert shorthand durations like "3D2N" → "3 Days 2 Nights"
const formatDuration = (duration: string) => {
  if (!duration) return '';
  const match = duration.match(/(\d+)D(\d+)N/i);
  if (match) {
    const [, days, nights] = match;
    return `${days} Day${days !== '1' ? 's' : ''} ${nights} Night${nights !== '1' ? 's' : ''}`;
  }
  return duration;
};

export default function LocalTrip({ packages: initialPackages, cities, selectedCountry }: PackagesIndexProps) {
  const { auth } = usePage<SharedData>().props;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const showRef = useRef<HTMLDivElement>(null);
  const [showCreateTripModal, setShowCreateTripModal] = useState(false);
  const ITEMS_PER_PAGE = 2;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const packageSlug = params.get('package');

    if (packageSlug && initialPackages?.length) {
      const foundPackage = initialPackages.find((pkg) => pkg.slug === packageSlug);
      if (foundPackage) {
        setSelectedPackage(foundPackage);
        setTimeout(() => {
          showRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
  }, [initialPackages]);

  // Filter and sort
  const filteredPackages = initialPackages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pkg.overview && pkg.overview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedPackages = [...filteredPackages].sort((a, b) => {
    const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return sortOption === 'newest' ? diff : -diff;
  });

  // Group by duration (Others if undefined)
  const groupedPackages = sortedPackages.reduce((acc, pkg) => {
    const duration = pkg.duration?.trim() || '';
    let formatted = duration ? formatDuration(duration) : 'Others';
    if (!acc[formatted]) acc[formatted] = [];
    acc[formatted].push(pkg);
    return acc;
  }, {} as Record<string, TourPackage[]>);

  const [visiblePackages, setVisiblePackages] = useState(sortedPackages.slice(0, ITEMS_PER_LOAD));
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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      if (fullHeight - (scrollTop + windowHeight) < 200 && hasMore) {
        loadMorePackages();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentIndex, hasMore]);

  useEffect(() => {
    const newVisible = sortedPackages.slice(0, ITEMS_PER_LOAD);
    setVisiblePackages(newVisible);
    setCurrentIndex(ITEMS_PER_LOAD);
    setHasMore(sortedPackages.length > ITEMS_PER_LOAD);
  }, [searchQuery, sortOption, filteredPackages.length]);

  // Scroll into view when a package is selected
  useEffect(() => {
    if (selectedPackage && showRef.current) {
      setTimeout(() => {
        showRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [selectedPackage]);

  const { start, stop } = useLoading();
  const [activeCityId, setActiveCityId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeModal, setActiveModal] = useState(false);
  const [allPackages, setAllPackages] = useState<TourPackage[]>([]);

  const handleCityClick = (cityId: number) => {
    start();
    setActiveCityId(cityId);
    setCurrentPage(0);
    router.get(route('localTrip'), { city_id: cityId, no_paginate: true }, {
        preserveScroll: true,
        preserveState: true,
        only: ['packages'],
        onSuccess: (page: any) => {
            setAllPackages(page.props.packages || []);
            stop();
            setActiveModal(true);
        },
        onError: stop,
    });
  };

  useEffect(() => {
    if (selectedPackage?.package_type == 'event') {
      router.visit(route("events", { package: selectedPackage.slug }));
    }
  }, [selectedPackage]);

  return (
    <DashboardLayout title="LocalTrip" href="/localtrip">
      <Head title="LocalTrip" />
      <div className="flex mb-2 gap-2">
        <Link href="/dashboard" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <LayoutDashboard /> Dashboard
        </Link>
        <Link href="/custom-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <Truck className="fill-black" /> Custom Trip
        </Link>
        <Link href="/local-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-[#f1c5c3]">
          <Plane className="fill-black" /> Local Trip
        </Link>
        <Link href="/events" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <PartyPopper className="fill-black" />Events
        </Link>
      </div>
      <div className="border border-gray-300 dark:border-gray-700 min-h-screen rounded-2xl p-6 bg-white dark:bg-accent shadow-sm max-w-7xl mx-auto">
        {selectedPackage ? (
          <div ref={showRef} className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <Button variant="outline" className="bg-primary cursor-pointer text-white hover:bg-[#fb2056]/80 hover:text-white" onClick={() => {
                setSelectedPackage(null);
              }}>
                ← Back to Packages
              </Button>
              <h2 className="text-lg font-semibold">{selectedPackage.title}</h2>
              <div className="w-16" />
            </div>

            <ShowPage
              packages={selectedPackage}
              categories={selectedPackage.package_categories ?? []}
              preferredVans={selectedPackage.preferred_vans ?? []}
              otherServices={selectedPackage.other_services ?? []}
              isWishlisted={selectedPackage.wishlist?.id != null}
              disableNav
            />
          </div>
        ) : (
          <>
            <div className="flex flex-row mb-8 justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl font-semibold">Local Trip!</h1>
                <h1 className="text-1xl">Are you ready for adventure?</h1>
              </div>
              <div className="flex flex-col justify-center">
                <Button
                  className="bg-[#5c1f1d] cursor-pointer hover:bg-[#3d1514]"
                  onClick={() => setShowCreateTripModal(true)}
                >
                  Explore Cities
                </Button>
              </div>
            </div>
            <div className="flex flex-row items-center w-full gap-4 mb-4">
              <div className="relative flex-grow" ref={searchRef}>
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Search size={20} />
                </span>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Search local trips..."
                  className="border rounded-lg p-2 pl-9 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <Listbox value={sortOption} onChange={setSortOption}>
                <div className="relative w-40">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-white dark:bg-accent py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
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
                    <Listbox.Options className="dark:bg-accent absolute z-50 mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg max-h-60 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-pointer select-none dark:bg-accent py-2 pl-4 pr-4 ${
                            active ? 'bg-blue-100 text-blue-900 dark:text-gray-200' : 'text-gray-900 dark:text-white'
                          }`
                        }
                        value="newest"
                      >
                        Newest to Oldest
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-pointer select-none dark:bg-accent py-2 pl-4 pr-4 ${
                            active ? 'bg-blue-100 text-blue-900 dark:text-gray-200' : 'text-gray-900 dark:text-white'
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
            </div>

            {Object.entries(groupedPackages).map(([duration, pkgs]) => {
              const allAreEvents = pkgs.every(pkg => pkg.package_type === 'event');
              if (allAreEvents) return null;

              const sorted = [...pkgs].sort((a, b) => {
                const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                return sortOption === 'newest' ? diff : -diff;
              });

              return (
                <div key={duration} className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6 border-b pb-2">
                    Duration - {duration}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sorted.map(pkg => {
                      // Compute average rating for this package
                      const avgRating =
                        pkg.reviews && pkg.reviews.length > 0
                          ? pkg.reviews.reduce((sum, review) => sum + review.rating, 0) /
                            pkg.reviews.length
                          : 0;
                      const roundedAvg = Math.round(avgRating * 10) / 10;

                      return (
                        <div key={pkg.id} className="relative">
                          <CardImageBackground
                            id={pkg.id}
                            title={pkg.title}
                            src={pkg.image_overview ?? ''}
                            size="smallWide"
                            editable={false}
                            onClick={() => setSelectedPackage(pkg)}
                          />

                          {/* Display average rating */}
                          {pkg.reviews && pkg.reviews.length > 0 && (
                            <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-neutral-800 px-2 py-1 rounded-md flex items-center text-sm font-medium shadow">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span>{roundedAvg} / 5</span>
                              <span className="ml-2 text-gray-500">({pkg.reviews.length})</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}




            {loadingMore && <p className="text-center mt-4 text-gray-500">Loading more...</p>}
          </>
        )}
      </div>

      <ModalLarge 
        activeModal={showCreateTripModal} 
        setActiveModal={setShowCreateTripModal}
        wrapContent={true}
      >
        <div className="space-y-10">
          <div>
              <h2 className="text-xl font-semibold mb-4">Cities</h2>
              <div className="flex flex-wrap gap-4 p-4">
                  {cities.map((city => (
                      <CardImageBackground
                          id={city.id}
                          inputId="image-overview-edit"
                          key={city.id}
                          title={city.name}
                          src={city.image_url}
                          city={city}
                          size='small'
                          onClick={() => handleCityClick(city.id)}
                      />
                  )))}
              </div>
              
          </div>
        </div>
      </ModalLarge>

      <ModalLarge 
        activeModal={activeModal} 
        setActiveModal={setActiveModal}
        wrapContent={true}
      >
          <div className="mt-4">
              <PackagesOverview
                  currentPackages={allPackages.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)}
                  totalPages={Math.ceil(allPackages.length / ITEMS_PER_PAGE)}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  isAdmin={false}
                  onLocalTrip={true}
              />
          </div>
      </ModalLarge>
    </DashboardLayout>
  );
}
