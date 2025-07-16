import { City, Country, Paginated, SharedData, TourPackage } from '@/types';
import PackagesIndexHeaderLayout from '@/layouts/packages/packages-index-header-layout';
import { useState } from 'react';
import ModalLarge from '@/components/ui/modal-large';
import PackagesOverview from '@/components/packages-overview';
import CardImageBackground from '@/components/ui/card-image-bg';
import { Link, router, usePage } from '@inertiajs/react';
import { useLoading } from '@/components/ui/loading-provider';
import { PlusSquareIcon } from 'lucide-react';

type PackagesIndexProps = {
    packages: Paginated<TourPackage>; 
    cities: City[]; 
    countries: Country[]; 
    selectedCountry: Country;
}

export default function Index({ 
    packages, 
    cities, 
    countries, 
    selectedCountry 
}: PackagesIndexProps) {

    const [currentPage, setCurrentPage] = useState(0);
    const ITEMS_PER_PAGE = 2;

    const { start, stop } = useLoading();
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.is_admin;
    
    const [ activeCityId, setActiveCityId ] = useState<number | null>(null);

    const [ activeModal, setActiveModal ] = useState(false);

    const [allPackages, setAllPackages] = useState<TourPackage[]>([]);

    const handleCityClick = (cityId: number) => {
        start();
        setActiveCityId(cityId);
        setCurrentPage(0);
        router.get(route('packages.index'), { city_id: cityId, no_paginate: true }, {
            preserveScroll: true,
            preserveState: true,
            only: ['packages'],
            onSuccess: (page: any) => {
                setAllPackages(page.props.packages);
                stop();
                setActiveModal(true);
            },
            onError: stop,
        });
    };

    const handlePageChange = (page: number) => {
        start();
        router.get(route('packages.index'), { city_id: activeCityId, page: page }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => stop(),
            onError: stop,
            onSuccess: stop,
        });
    }

    return (
        <PackagesIndexHeaderLayout id={selectedCountry.id} src={selectedCountry.image_url} editable={!!isAdmin}>
            <div className="flex flex-wrap gap-4 p-4">
                {!!isAdmin && (
                    <Link
                        href={route('packages.create')} 
                        className="flex-col gap-2 relative w-76 h-84 bg-gray-200 border-gray-600 shadow-lg rounded-xl overflow-hidden flex items-center justify-center text-center cursor-pointer transition-shadow duration-300"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 0, 0, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        <PlusSquareIcon className="w-24 h-24 text-gray-600" />
                        <span className="font-semibold text-gray-600">Add New Package</span>
                    </Link>
                )}
                {cities.map((city: City) => (
                    <CardImageBackground
                        id={city.id}
                        inputId="image-overview-edit"
                        key={city.id}
                        onClick={() => handleCityClick(city.id)}
                        title={city.name}
                        src={city.image_url}
                        editable={!!isAdmin}
                    />
                ))}
            </div>
            <ModalLarge activeModal={activeModal} setActiveModal={setActiveModal}>
                <PackagesOverview 
                    currentPackages={allPackages.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)}
                    totalPages={Math.ceil(allPackages.length / ITEMS_PER_PAGE)}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isAdmin={!!isAdmin}
                />
            </ModalLarge>

        </PackagesIndexHeaderLayout>
    );
}