import { City, Country, Paginated, SharedData, TourPackage, User } from '@/types';
import PackagesIndexHeaderLayout from '@/layouts/packages/packages-index-header-layout';
import { useEffect, useRef, useState } from 'react';
import ModalLarge from '@/components/ui/modal-large';
import PackagesOverview from '@/components/packages-overview';
import CardImageBackground from '@/components/ui/card-image-bg';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useLoading } from '@/components/ui/loading-provider';
import { PlusSquareIcon, Search } from 'lucide-react';
import { isAdmin } from '@/lib/utils';

type PackagesIndexProps = {
    packages?: TourPackage[]; 
    cities: City[]; 
    countries?: Country[]; 
    selectedCountry: Country;
}

export default function Index({ packages, cities, countries, selectedCountry }: PackagesIndexProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 2;
    const { start, stop } = useLoading();
    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);

    const [activeCityId, setActiveCityId] = useState<number | null>(null);
    const [activeModal, setActiveModal] = useState(false);
    const [allPackages, setAllPackages] = useState<TourPackage[]>([]);

    // New search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TourPackage[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    const handleCityClick = (cityId: number) => {
        start();
        setActiveCityId(cityId);
        setCurrentPage(0);
        router.get(route('packages.index'), { city_id: cityId, no_paginate: true }, {
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

    const handlePageChange = (page: number) => {
        start();
        router.get(route('packages.index'), { city_id: activeCityId, page }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => stop(),
            onError: stop,
            onSuccess: stop,
        });
    }

    // Fetch search results
    const fetchPackagesSearch = async (query: string) => {
        if (!query) return setSearchResults([]);
        try {
            const response = await fetch(`/api/packages?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data.packages);
        } catch (e) {
            console.error('Search error', e);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchPackagesSearch(value);
    };

    // Click outside handler
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
        <PackagesIndexHeaderLayout id={selectedCountry.id} src={selectedCountry.image_url} editable={!!isAdmins}>
            <div className="p-4 flex flex-col gap-4">
                <div className="flex justify-center items-center">
                    {/* Search Bar */}
                    <div className="relative w-full md:w-1/2" ref={searchRef}>
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search size={20} />
                        </span>
                        <input
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onClick={() => {
                                fetchPackagesSearch(searchQuery);
                            }}
                            type="text"
                            placeholder="Search packages or destinations..."
                            className="border rounded-lg p-2 pl-9 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-64 overflow-auto">
                                {searchResults.map((pkg: TourPackage) => (
                                    <Link
                                        key={pkg.id}
                                        href={`/packages/${pkg.slug}`}
                                        className="block px-4 py-2 hover:bg-gray-100"
                                    >
                                        {pkg.title} — {pkg.city?.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* City Cards */}
                <div className="flex flex-wrap gap-4 justify-center items-center">
                    {!!isAdmins && (
                        <Link
                            href={route('packages.create')}
                            className="flex-col gap-2 relative w-76 h-84 bg-gray-200 border-gray-600 shadow-lg rounded-xl overflow-hidden flex items-center justify-center text-center cursor-pointer transition-shadow duration-300"
                            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 0, 0, 0.5)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
                        >
                            <PlusSquareIcon className="w-24 h-24 text-gray-600" />
                            <span className="font-semibold text-gray-600">Add New Package</span>
                        </Link>
                    )}
                    {cities.map((city: City) => (
                        <CardImageBackground
                            key={city.id}
                            id={city.id}
                            inputId="image-overview-edit"
                            onClick={() => handleCityClick(city.id)}
                            title={city.name}
                            src={city.image_url}
                            editable={!!isAdmins}
                            size='small'
                        />
                    ))}
                </div>
            </div>

            <ModalLarge activeModal={activeModal} setActiveModal={setActiveModal} wrapContent>
                <div className="mt-4">
                    <PackagesOverview
                        currentPackages={allPackages.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)}
                        totalPages={Math.ceil(allPackages.length / ITEMS_PER_PAGE)}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        isAdmin={!!isAdmins}
                    />
                </div>
            </ModalLarge>
        </PackagesIndexHeaderLayout>
    );
}
