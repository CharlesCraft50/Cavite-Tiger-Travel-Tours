import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData, User, PreferredVan, VanCategory } from '@/types';
import { Link, usePage, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import '../../../css/dashboard.css';
import { LayoutDashboard, Plane, Truck } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import VanSelection from "@/components/van-selection";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import InputError from "@/components/input-error";
import TripRatesInfo from '@/components/trip-rates-info';
import ModalLarge from '@/components/ui/modal-large';
import TermsAndConditions from './about/terms-and-conditions';
import PrivacyPolicy from './about/privacy-policy';
import CancellationPolicy from './about/cancellation-policy';

type DashboardProps = {
  bookingCount: number;
  userBookings: Booking[];
  preferredVans: PreferredVan[];
  vanCategories: VanCategory[];
};

type CustomTripForm = {
  first_name: string;
  last_name: string;
  contact_number: string;
  email: string;
  date_of_trip: string;
  pickup_time: string;
  dropoff_time: string;
  pickup_address: string;
  destination: string;
  preferred_van_id: number | null;
  notes: string;
  driver_id: number | null;
  pax_adult: string | number;
};

export default function CustomTrip({ bookingCount, userBookings, preferredVans, vanCategories }: DashboardProps) {
  const { auth } = usePage<SharedData>().props;
  const isAdmins = isAdmin(auth.user);
  const isDrivers = isDriver(auth.user);

  const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
  const [drivers, setDrivers] = useState<User[]>([]);
  const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);
  const [vanCategoryList, setVanCategoryList] = useState<VanCategory[]>(vanCategories);
  const [formError, setFormError] = useState<string>('');
  const [formSuccess, setFormSuccess] = useState<string>('');

  const { data, setData, post, processing, reset, errors } = useForm<CustomTripForm>({
    first_name: auth.user.first_name || '',
    last_name: auth.user.last_name || '',
    contact_number: auth.user.contact_number || '',
    email: auth.user.email || '',
    date_of_trip: '',
    pickup_time: '',
    dropoff_time: '',
    pickup_address: auth.user.address || '',
    destination: '',
    preferred_van_id: null,
    notes: '',
    driver_id: null,
    pax_adult: '',
  });

  const toggleVanSelection = (vanId: number) => {
    if (selectedVanIds.includes(vanId)) {
      setSelectedVanIds([]);
      setData('preferred_van_id', null);
    } else {
      setSelectedVanIds([vanId]);
      setData('preferred_van_id', vanId);
    }
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (data.preferred_van_id == null) {
      setFormError('Van is required.')
      return;
    }
    setFormError('');
    setFormSuccess('');

    post(route('customTrips.store'), {
      preserveScroll: true,
      onSuccess: () => {
        setFormSuccess('Custom trip submitted successfully!');
        reset(
          'date_of_trip',
          'pickup_time',
          'dropoff_time',
          'pickup_address',
          'destination',
          'preferred_van_id',
          'notes',
          'pax_adult'
        );
        setSelectedVanIds([]);
      },
      onError: () => setFormError('Please check the required fields.'),
    });
  };

  const selectedVan = vanList.find(v => v.id === data.preferred_van_id);

  useEffect(() => {
    if (selectedVan) {
      setData('driver_id', selectedVan.user_id ? selectedVan.user_id : null);
    }
  }, [selectedVan]);

  const [checked, setChecked] = useState({
      terms: false,
      privacy: false,
      cancellation: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked: isChecked } = e.target;
      setChecked((prev) => ({ ...prev, [name]: isChecked }));
  };

  const allChecked = checked.terms && checked.privacy && checked.cancellation;

  const [ activeModal, setActiveModal ] = useState(false);

  const [ agreementIndex, setAgreementIndex ] = useState(0);

  return (
    <DashboardLayout title="" href="/dashboard">
      <div className="flex mb-2 gap-2">
        <Link href="/dashboard" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <LayoutDashboard /> Dashboard
        </Link>
        <Link href="/custom-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-[#f1c5c3]">
          <Truck className="fill-black" /> Custom Trip
        </Link>
        <Link href="/local-trip" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <Plane className="fill-black" /> Local Trip
        </Link>
      </div>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Custom Trip!</h1>
              {!(isAdmins || isDrivers) && (
                <p className="text-gray-600 dark:text-gray-300">
                  Choose your desired trips and vehicles.
                </p>
              )}
              <TripRatesInfo />
            </div>
          </div>

          <div className="p-4">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input value={data.first_name} disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input value={data.last_name} disabled />
                </div>
              </div>

              {/* Contact & Email */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label>Contact Number</Label>
                  <Input value={data.contact_number} disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={data.email} disabled />
                </div>
              </div>

              {/* Date of Trip */}
              <div className="grid gap-2">
                <Label required>Date of Trip</Label>
                <DatePicker
                  selected={data.date_of_trip ? new Date(data.date_of_trip) : null}
                  onChange={(date: Date | null) =>
                    date && setData('date_of_trip', date.toISOString().split('T')[0])
                  }
                  className="w-full border px-3 py-2 rounded-md"
                  placeholderText="Select date of trip"
                  minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
                  disabled={processing}
                />
                <InputError message={errors.date_of_trip} className="mt-2" />
              </div>

              {/* Pick-up & Drop-off Time */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label required>Pick-up Time</Label>
                  <Input
                    type="time"
                    value={data.pickup_time}
                    onChange={(e) => setData('pickup_time', e.target.value)}
                    disabled={processing}
                  />
                  <InputError message={errors.pickup_time} className="mt-2" />
                </div>
                <div className="grid gap-2">
                  <Label required>Drop-off Time</Label>
                  <Input
                    type="time"
                    value={data.dropoff_time}
                    onChange={(e) => setData('dropoff_time', e.target.value)}
                    disabled={processing}
                  />
                  <InputError message={errors.dropoff_time} className="mt-2" />
                </div>
              </div>

              {/* Pickup & Destination */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label required>Pickup Address</Label>
                  <Input
                    type="text"
                    value={data.pickup_address}
                    onChange={(e) => setData('pickup_address', e.target.value)}
                    disabled={processing}
                  />
                  <InputError message={errors.pickup_address} className="mt-2" />
                </div>
                <div className="grid gap-2">
                  <Label required>Destination</Label>
                  <Input
                    type="text"
                    value={data.destination}
                    onChange={(e) => setData('destination', e.target.value)}
                    disabled={processing}
                  />
                  <InputError message={errors.destination} className="mt-2" />
                </div>
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label>Notes</Label>
                <textarea
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                  placeholder="Any additional notes..."
                  rows={4}
                  disabled={processing}
                />
                <InputError message={errors.notes} className="mt-2" />
              </div>

              {/* Preferred Van */}
              <div className="space-y-4">
                <Label className="text-xl font-semibold mb-4" required>Preferred Vans</Label>
                <VanSelection
                  preferredVans={vanList}
                  drivers={drivers ?? []}
                  small={true}
                  vanCategories={vanCategoryList}
                  selectedVanIds={selectedVanIds}
                  onSelect={toggleVanSelection}
                />
                <InputError message={errors.preferred_van_id} className="mt-2" />
              </div>

              {/* Pax Count */}
              <div className="grid grid-cols-1 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="pax_adult">No. of Pax</Label>
                  <Input
                    id="pax_adult"
                    type="number"
                    required
                    value={data.pax_adult}
                    placeholder="1"
                    max={selectedVan?.pax_adult}
                    min={1}
                    onChange={(e) =>
                      setData('pax_adult', e.target.value === '' ? '1' : e.target.value)
                    }
                    disabled={processing || selectedVanIds.length === 0}
                  />
                  <InputError message={errors.pax_adult} className="mt-2" />
                </div>
              </div>

               <div className="flex flex-col gap-2">
                  <h2>Agreements</h2>
                  <label>
                      <input
                          type="checkbox"
                          name="terms"
                          className="cursor-pointer"
                          checked={checked.terms}
                          onChange={handleChange}
                      />{" "}
                          I have read and agree to the&nbsp;
                      <strong 
                          className="underline cursor-pointer text-blue-500"
                          onClick={() => {
                              setAgreementIndex(0);
                              setActiveModal(true);
                          }}
                      >
                          Terms and Conditions
                      </strong>.
                  </label>

                  <label>
                      <input
                          type="checkbox"
                          name="privacy"
                          className="cursor-pointer"
                          checked={checked.privacy}
                          onChange={handleChange}
                      />{" "}
                          I have read and agree to the&nbsp;
                          <strong
                              className="underline cursor-pointer text-blue-500"
                              onClick={() => {
                                  setAgreementIndex(1);
                                  setActiveModal(true);
                              }}
                          >
                              Privacy Policy
                          </strong>.
                  </label>

                  <label>
                      <input
                          type="checkbox"
                          name="cancellation"
                          className="cursor-pointer"
                          checked={checked.cancellation}
                          onChange={handleChange}
                      />{" "}
                      I have read and agree to the&nbsp;
                      <strong
                          className="underline cursor-pointer text-blue-500"
                          onClick={() => {
                              setAgreementIndex(2);
                              setActiveModal(true);
                          }}
                      >
                          Cancellation Policy
                      </strong>.
                  </label>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={!(allChecked) || processing}>
                {processing ? 'Submitting...' : 'SUBMIT'}
              </Button>

              {/* Form Messages */}
              {formError && (
                <div className="bg-red-100 text-red-800 p-3 rounded mt-2 text-center">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="bg-green-100 text-green-800 p-3 rounded mt-2 text-center">
                  {formSuccess}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <ModalLarge activeModal={activeModal} setActiveModal={setActiveModal}>
          {agreementIndex == 0 && <TermsAndConditions disableNav />}
          {agreementIndex == 1 && <PrivacyPolicy disableNav />}
          {agreementIndex == 2 && <CancellationPolicy disableNav />}
      </ModalLarge>
    </DashboardLayout>
  );
}
