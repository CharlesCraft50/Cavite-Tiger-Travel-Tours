import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { City } from '@/types';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import { DialogFooter } from "./ui/dialog";

type CityListProps = {
  cities: City[];
  data: {
    city_id: number;
    location: string;
  };
  setData: (key: string, value: any) => void;
  processing: boolean;
  showNewCityInput: boolean;
  setShowNewCityInput: (val: boolean) => void;
  newCityName: string;
  setNewCityName: (val: string) => void;
  handleAddCity: () => void;
  handleDeletionCity: (cityId: number) => void;
  selectedCityId?: (e: string) => void;
};

export default function CityList({
  cities,
  data,
  setData,
  processing,
  showNewCityInput,
  setShowNewCityInput,
  newCityName,
  setNewCityName,
  handleAddCity,
  handleDeletionCity,
  selectedCityId,
}: CityListProps) {
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  return (
    <div>
      <div className="flex flex-row w-full items-center gap-2">
        <select
          id="cities"
          name="cities"
          value={data.city_id}
          onChange={(e) => {
            const selectedValue = e.target.value;
            
            selectedCityId?.(selectedValue);

            if (selectedValue === '__new') {
              setShowNewCityInput(true);
              setData('city_id', 0);
              setData('location', '');
            } else {
              const selectedCityId = Number(selectedValue);
              const selectedCity = cities.find(city => city.id === selectedCityId);
              setShowNewCityInput(false);
              setData('city_id', selectedCityId);
              setData('location', selectedCity?.name ?? '');
            }
          }}
          disabled={processing}
          className="border w-full rounded p-2 dark:bg-gray-950 text-black dark:text-white"
          required
        >
          <option value="">Choose a City</option>
          {cities.map((city: City) => (
            <option value={city.id} key={city.id} data-name={city.name}>
              {city.name}
            </option>
          ))}
          <option value="__new">+ Add New City</option>
        </select>

        {!!data.city_id && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              const city = cities.find(c => c.id === data.city_id);
              if (city) setCityToDelete(city);
            }}
            className="p-2 cursor-pointer"
            title="Delete selected city"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {showNewCityInput && (
        <div className="mt-2 space-y-2">
          <Label htmlFor="newCityName">New City Name</Label>
          <Input
            id="newCityName"
            type="text"
            placeholder="Enter new city name"
            value={newCityName}
            onChange={(e) => {
              setNewCityName(e.target.value);
            }}
          />
          <div className="flex flex-row gap-2">
            <Button type="button" onClick={handleAddCity} className="btn-primary cursor-pointer">
              Add
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowNewCityInput(false);
                setNewCityName('');
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
}
