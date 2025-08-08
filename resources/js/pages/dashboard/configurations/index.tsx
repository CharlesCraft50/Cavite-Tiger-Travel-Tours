import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, router, useForm } from '@inertiajs/react';
import CityList from '@/components/city-list';
import { City, OtherService, PreferredVan, User } from '@/types';
import { PackageForm } from '@/pages/packages/create';
import CardImageBackground from '@/components/ui/card-image-bg';
import VanSelection from '@/components/van-selection';
import OtherServiceSelection, { EditableOtherService } from '@/components/other-service-selection';

type ConfigurationsProps = {
    cities: City[];
    preferredVans: PreferredVan[];
    drivers: User[];
    otherServices: OtherService[];
}

export default function Configurations({
    cities,
    preferredVans,
    drivers,
    otherServices,
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

    const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);

    const addPreferredVans = (vans: PreferredVan[]) => {
        setVanList(vans);
    }

    const [otherServiceList, setOtherServiceList] = useState<EditableOtherService[]>(otherServices);

    const addOtherServices = (otherServices: EditableOtherService[]) => {
        setOtherServiceList(otherServices);
    }

  return (
    <DashboardLayout title="Manage Cities, Vans & Services" href="/configurations">
      <Head title="Manage Cities, Vans & Services" />

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
                />
              )))}
            </div>
            
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Preferred Vans</h2>
          <VanSelection
              preferredVans={vanList}
              drivers={drivers ?? []}
              textLabel="Edit Vans"
              onSave={(newVans) => addPreferredVans(newVans)}
              required={true}
              editable
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Other Services</h2>
          <OtherServiceSelection
              otherServices={otherServiceList}
              textLabel="Edit Services"
              onSave={(newServices) => addOtherServices(newServices)}
              editable
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
