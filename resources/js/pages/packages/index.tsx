import { City, Country, SharedData, TourPackage } from '@/types';
import PackagesIndexHeaderLayout from '@/layouts/packages/packages-index-header-layout';
import { useState } from 'react';
import ModalLarge from '@/components/ui/modal-large';
import PackagesOverview from '@/components/packages-overview';
import CardImageBackground from '@/components/ui/card-image-bg';
import { usePage } from '@inertiajs/react';

const ITEMS_PER_PAGE = 2;

export default function Index({ packages, cities, countries, selectedCountry }: { packages: TourPackage[]; cities: City[]; countries: Country[]; selectedCountry: Country; }) {

    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.is_admin;
  
    const [ activeCityId, setActiveCityId ] = useState<number | null>(null);

    const [ activeModal, setActiveModal ] = useState(false);

    const [ currentPage, setCurrentPage ] = useState(0);

    const handleCityClick = (cityId: number) => {
        setActiveCityId(cityId);
        setActiveModal(true);
        setCurrentPage(0);
    }

    const filteredPackages = packages.filter(p => p.city_id === activeCityId);
    const totalPages = Math.ceil(filteredPackages.length / ITEMS_PER_PAGE);
    const currentPackages = filteredPackages.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

    return (
        <PackagesIndexHeaderLayout id={selectedCountry.id} src={selectedCountry.image_url} editable={!!isAdmin}>
            <div className="flex flex-wrap gap-4 p-4">
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
                    currentPackages={currentPackages}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </ModalLarge>

        </PackagesIndexHeaderLayout>
    );
}