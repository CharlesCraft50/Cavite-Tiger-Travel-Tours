import { useState } from "react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X } from 'lucide-react';
import { City } from '@/types';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogContent,
  DialogDescription
} from '@/components/ui/dialog';
import { DialogFooter } from "./ui/dialog";
import clsx from "clsx";
import { Button } from "./ui/button";

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
  onToggleEdit?: (e: boolean) => void;
  editable?: boolean;
  hasSearchBar?: boolean;
  searchQuery?: string;
  onSearch?: (e: string) => void;
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
  onToggleEdit,
  editable,
  hasSearchBar,
  onSearch
}: CityListProps) {
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggleEdit = () => {
    setToggleEdit(prev => {
      onToggleEdit?.(!prev);
      return !prev;
    });
  }

  const handleSearchBar = (e: string) => {
    setSearchQuery(e);
    setSearchQuery(prev => {
      onSearch?.(prev);
      return prev;
    });
  }

  return (
    <div>
      <div className="flex flex-row w-full items-center gap-2">
        {hasSearchBar ? (
          <div className="relative w-full">
            {/* Search icon */}
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
              <Search size={20} />
            </span>

            {/* Input field */}
            <input
              value={searchQuery}
              onChange={(e) => handleSearchBar(e.target.value)}
              type="text"
              placeholder="Search cities..."
              className="border rounded-lg p-2 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Clear button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ) : (<select
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
          <option value="">[ Choose a City ]</option>
          {cities.map((city: City) => (
            <option value={city.id} key={city.id} data-name={city.name}>
              {city.name}
            </option>
          ))}
          {editable && (
            <option value="__new">+ Add New City</option>
          )}
        </select>)}

        {!!data.city_id && editable && (
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

        {editable && (
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                handleToggleEdit();
              }}
              className={clsx("btn-primary font-semibold cursor-pointer", toggleEdit && "bg-gray-500")}
            >Edit Cities</Button>

            <Button
              onClick={() => {
                setShowNewCityInput(!showNewCityInput);
                setData('city_id', 0);
                setData('location', '');
              }}
              className={clsx("btn-primary cursor-pointer font-semibold", showNewCityInput && "bg-gray-500")}
            >Add New City</Button>
          </div>
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
