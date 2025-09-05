import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, router, useForm } from '@inertiajs/react';
import CityList from '@/components/city-list';
import { City } from '@/types';
import { PackageForm } from '@/pages/packages/create';
import CardImageBackground from '@/components/ui/card-image-bg';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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

    const [searchQuery, setSearchQuery] = useState('');

    const displayedCities = cities.filter(city => {
      if (!searchQuery.trim()) return true;
      return city.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const [toggleEdit, setToggleEdit] = useState(false);

    const [cityToDelete, setCityToDelete] = useState<City | null>(null);

    

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
                onToggleEdit={setToggleEdit}
                editable={true}
                hasSearchBar={true}
                onSearch={setSearchQuery}
            />

            <div className="flex flex-wrap gap-4 p-4">
              {displayedCities.map((city => (
                <CardImageBackground
                    id={city.id}
                    inputId="image-overview-edit"
                    key={city.id}
                    title={city.name}
                    src={city.image_url}
                    editable={toggleEdit}
                    deletable={true}
                    editableText={true}
                    city={city}
                    handleDeletionCity={setCityToDelete}
                />
              )))}
            </div>
            
        </div>
      </div>

      {cityToDelete && (
        <Dialog open={true} onOpenChange={(open) => !open && setCityToDelete(null)}>
          <DialogContent className="p-4 max-w-md bg-white rounded shadow-xl">
            <DialogTitle className="text-lg font-semibold text-center mb-2">
              Delete City "{cityToDelete.name}"?
            </DialogTitle>

            <DialogDescription className="text-sm text-gray-500 text-center mb-4">
              This will permanently remove the city from the list.
            </DialogDescription>

            <DialogFooter className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => {
                  handleDeletionCity(cityToDelete.id);
                  setCityToDelete(null);
                  setData('city_id', 0);
                  setData('location', '');
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
