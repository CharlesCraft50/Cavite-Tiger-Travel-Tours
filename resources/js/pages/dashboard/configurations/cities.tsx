import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, router, useForm } from '@inertiajs/react';
import CityList from '@/components/city-list';
import { City } from '@/types';
import { PackageForm } from '@/pages/packages/create';
import CardImageBackground from '@/components/ui/card-image-bg';

type ConfigurationsProps = {
    cities: City[];
}

export default function Cities({
    cities,
} : ConfigurationsProps) {

    const { data, 
          setData, 
          //post,
          processing, 
          errors 
      } = useForm<PackageForm>({
          title: '',
          subtitle: '',
          overview: '',
          location: '',
          city_id: 0,
          content: '',
          duration: '',
          image_overview: '',
          image_banner: '',
          available_from: null,
          available_until: null,
          base_price: 0,
  
      });

      const [showNewCityInput, setShowNewCityInput] = useState(false);
      const [newCityName, setNewCityName] = useState('');
      const handleAddCity = () => {
        router.post(route('cities.store'), {
            name: newCityName.toString(),
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setShowNewCityInput(false);
            },
        });
    }

    const handleDeletionCity = (cityId: number) => {
        if (!cityId) return;

        router.delete(route('cities.destroy', cityId), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: reset city selection or show a toast
                console.log('City deleted successfully');
            },
            onError: (errors) => {
                console.error('Failed to delete city', errors);
            }
        });
    };

    const [activeCity, setActiveCity] = useState('');

    const selectedCityId = (e: string) => {
      setActiveCity(e);
    }

    const displayedCities = activeCity.trim() === '' || activeCity === '__new'
      ? cities
      : cities.filter(c => c.id === Number(activeCity));

  return (
    <DashboardLayout title="Manage Cities" href="/configurations/cities">
      <Head title="Manage Cities" />

      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Cities</h2>
            <CityList 
                cities={cities}
                data={data}
                setData={setData}
                showNewCityInput={showNewCityInput}
                setShowNewCityInput={setShowNewCityInput}
                newCityName={newCityName}
                setNewCityName={setNewCityName}
                handleAddCity={handleAddCity}
                processing={processing}
                handleDeletionCity={handleDeletionCity}
                selectedCityId={selectedCityId}
            />

            <div className="flex flex-wrap gap-4 p-4">
              {displayedCities.map((city => (
                <CardImageBackground
                    id={city.id}
                    inputId="image-overview-edit"
                    key={city.id}
                    title={city.name}
                    src={city.image_url}
                    editable={true}
                    editableText={true}
                />
              )))}
            </div>
            
        </div>
      </div>
    </DashboardLayout>
  );
}
