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
    otherServices: OtherService[];
}

export default function OtherServices({
    otherServices,
} : ConfigurationsProps) {


    const [otherServiceList, setOtherServiceList] = useState<EditableOtherService[]>(otherServices);

    const addOtherServices = (otherServices: EditableOtherService[]) => {
        setOtherServiceList(otherServices);
    }

  return (
    <DashboardLayout title="Manage Services" href="/configurations/other-services">
      <Head title="ManageServices" />

      <div className="space-y-10">
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
