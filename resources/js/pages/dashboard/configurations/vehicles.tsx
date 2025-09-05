import { useState } from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head } from '@inertiajs/react';
import { City, OtherService, PreferredVan, User } from '@/types';
import VanSelection from '@/components/van-selection';

type ConfigurationsProps = {
    preferredVans: PreferredVan[];
    drivers: User[];
}

export default function Vehicles({
    preferredVans,
    drivers,
} : ConfigurationsProps) {

    const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);

    const addPreferredVans = (vans: PreferredVan[]) => {
        setVanList(vans);
    }

  return (
    <DashboardLayout title="Manage Vehicles" href="/configurations/vehicles">
      <Head title="Manage Vehicles" />

      <div className="space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Preferred Vans</h2>
          <VanSelection
              preferredVans={vanList}
              drivers={drivers ?? []}
              textLabel="Edit Vans"
              onSave={(newVans) => addPreferredVans(newVans)}
              required={true}
              editable
              small={true}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
