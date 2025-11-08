import DashboardLayout from '@/layouts/dashboard-layout';
import { isAdmin, isDriver } from '@/lib/utils';
import { Booking, SharedData, User, PreferredVan, VanCategory, TourPackage } from '@/types';
import { Link, usePage, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import '../../../css/dashboard.css';
import { LayoutDashboard, Loader2Icon, PartyPopper, Plane, Truck } from 'lucide-react';
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
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import CardImageBackground from '@/components/ui/card-image-bg';
import PackagesOverview from '@/components/packages-overview';
import NoteMessage from '@/components/ui/note-message';


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
  pickup_address: string;
  destination: string;
  preferred_van_id: number | null;
  notes: string;
  driver_id: number | null;
  pax_adult: string | number;
  trip_type: string;
  costing_type: string;
  duration: string;
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
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [ tripTypeNotes, setTripTypeNotes ] = useState<string | null>(null);
  const [ costingTypeNotes, setCostingTypeNotes ] = useState<string | null>(null);
  
  // View All modal states
  const [viewAllModal, setViewAllModal] = useState(false);
  const [viewAllPackages, setViewAllPackages] = useState<TourPackage[]>([]);
  const [viewAllTitle, setViewAllTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const ITEMS_PER_PAGE = 2;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const fetchPackages = async () => {
          try {
              setIsLoading(true);
              const response = await fetch('/api/events/latest');
              const packages = response.json();
              setPackages(await packages);
          } catch (error) {
              console.error('Error fetching packages: ', error);
          } finally {
            setIsLoading(false);
          }
      }

      fetchPackages();
  }, []);

  const { data, setData, post, processing, reset, errors } = useForm<CustomTripForm>({
    first_name: auth.user.first_name || '',
    last_name: auth.user.last_name || '',
    contact_number: auth.user.contact_number || '',
    email: auth.user.email || '',
    date_of_trip: '',
    pickup_time: '',
    pickup_address: auth.user.address || '',
    destination: '',
    preferred_van_id: null,
    notes: '',
    driver_id: null,
    pax_adult: '',
    trip_type: '',
    costing_type: '',
    duration: '',
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
          'pickup_address',
          'destination',
          'preferred_van_id',
          'notes',
          'pax_adult',
          'trip_type',
          'costing_type',
          'duration',
        );
        setSelectedVanIds([]);
        setActiveModal(false);
        setActiveAgreementModal(false);
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

  const [ activeAgreementModal, setActiveAgreementModal ] = useState(false);
  const [ activeModal, setActiveModal ] = useState(false);

  const [ agreementIndex, setAgreementIndex ] = useState(0);

  const tripOptions = [
    { value: "single_trip", label: "Single Trip" },
    { value: "round_trip", label: "Round Trip" },
  ];

  const costingOptions = [
    { value: "all_in", label: "All-In" },
    { value: "all_out", label: "All-Out" },
  ];

  // Handle View All click
  const handleViewAll = (eventType: string, allPackages: TourPackage[]) => {
    setViewAllTitle(eventType.replace(/_/g, " "));
    setViewAllPackages(allPackages);
    setCurrentPage(0);
    setViewAllModal(true);
  };

  // Group packages by event type
  const groupedPackages = packages.reduce((groups: Record<string, TourPackage[]>, pkg) => {
    const type = pkg.event_type || "other";
    if (!groups[type]) groups[type] = [];
    groups[type].push(pkg);
    return groups;
  }, {});

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
        <Link href="/events" className="border rounded-lg px-4 py-2 flex gap-2 bg-accent">
          <PartyPopper className="fill-black" /> Events
        </Link>
      </div>

      <div className="border border-gray-300 dark:border-gray-700 min-h-screen rounded-2xl p-6 bg-white dark:bg-accent shadow-sm max-w-7xl mx-auto">
        <div className="flex flex-row mb-8 justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">Customized Trip!</h1>
            <h1 className="text-1xl">Now is the time to gather, travel, and savor favorite places and new destinations!</h1>
          </div>
          <div className="flex flex-col justify-center">
            <Button
              className="bg-[#5c1f1d] cursor-pointer hover:bg-[#3d1514]"
              onClick={() => setActiveModal(true)}
            >
              Create Own
            </Button>
          </div>
        </div>
        <div className="flex flex-col justify-center mt-4 px-4">
          <div className="container mx-auto px-4 mt-4 max-w-4xl">
              <Swiper
                  modules={[Autoplay, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                  }}
                  pagination={{
                      clickable: true,
                      dynamicBullets: true,
                  }}
                  className="rounded-xl overflow-hidden shadow-md"
                  >
                  {[
                      "images/bg/Untitled-9.png",
                      "images/bg/Untitled-7.png",
                      "images/bg/Untitled-2.png",
                      "images/bg/Untitled-12.png",
                      "images/bg/Untitled-11.png",
                      "images/bg/Untitled-10.png",
                      "images/bg/Untitled-8.png",
                      "images/bg/Untitled-6.png",
                      "images/bg/Untitled-5.png",
                      "images/bg/Untitled-4.png",
                      "images/bg/Untitled-3.png",
                      "images/bg/Untitled-1.png",
                  ].map((url, index) => (
                      <SwiperSlide key={index}>
                      <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-64 sm:h-64 md:h-72 lg:h-120 object-cover"
                      />
                      </SwiperSlide>
                  ))}
              </Swiper>
          </div>

          <div className="text-center mt-6 mb-0 px-6">
            <p className="text-gray-700 dark:text-white text-md sm:text-base leading-relaxed">
              Here, you can create your very own <span className="font-semibold text-blue-600">custom trip</span> — simply click the <span className="font-semibold">“Create Own”</span> button at the top left to start planning your adventure!
            </p>
          </div>
        </div>


      {/* <section className="mt-8 rounded-3xl text-center">
        <h2 className="text-3xl font-bold mb-8">Events</h2>

        {isLoading && (
          <div className="flex items-center justify-center">
              <Loader2Icon className="w-18 h-18 animate-spin text-primary" />
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-12">
          {Object.entries(groupedPackages).map(([type, group]) => (
            <div key={type} className="text-left">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h3 className="text-2xl font-semibold capitalize">
                  {type.replace(/_/g, " ")}
                </h3>
                <Button
                  variant="link"
                  className="btn-primary cursor-pointer text-white"
                  onClick={() => handleViewAll(type, group)}
                >
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.slice(0, 3).map((pkg) => (
                  <div key={pkg.id} className="relative">
                    <CardImageBackground
                      id={pkg.id}
                      inputId="image-overview-edit"
                      title={pkg.title}
                      src={pkg.image_overview ?? ""}
                      size="smallWide"
                      editable={false}
                      onClick={() =>
                        router.get(route("events", { package: pkg.slug }))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section> */}
      </div>

      {/* Custom Trip Form Modal */}
      <ModalLarge
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      >
        <div className="container mx-auto px-24 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Custom Trip!</h1>
              {!(isAdmins || isDrivers) && (
                <p className="text-gray-600 dark:text-gray-300">
                  Choose your desired trips and vehicles.
                </p>
              )}
              <TripRatesInfo />

              <NoteMessage
                type="important"
                message="Regular Vans already have fixed price based on Distance (KM) acquired by the Customer. Add ₱1000 to upgrade your Van into Premium Van (Optional). 12 hours is the Maximum Hours for all the trips. Trips exceeding 12 hours will be charged by ₱350/hour. Trip time will start when Customers are picked-up on their address. Duration's cost under Round Trip is set by Cavite Tiger depends on the day/s and night/s selected."
              />
              
            </div>
          </div>

          <div className="p-4">
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Trip type */}
              <div className="grid gap-4">
                <Label htmlFor="trip_type" required>
                  Trip Type
                </Label>
                <select
                  id="trip_type"
                  className="border p-2 rounded cursor-pointer dark:bg-accent"
                  value={data.trip_type ?? tripOptions[0].value}
                  onChange={(e) =>{
                    setData('trip_type', e.target.value);
                    if (e.target.value == 'single_trip') {
                      setTripTypeNotes('Only Pick-up at preferred address until Drop-off at preferred destination.');
                    } else if (e.target.value  == 'round_trip') {
                      setTripTypeNotes('Pick-up at preferred address until Drop-off at preferred destination and Vice Versa.');
                    } else {
                      setTripTypeNotes(null);
                    }
                  }}
                  required
                >
                  <option value="">Select Trip Type</option>
                  {tripOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {tripTypeNotes && (
                <NoteMessage
                  type="note"
                  message={tripTypeNotes}
                />
              )}

              {/* Costing Type */}
              <div className="grid gap-4">
                <Label htmlFor="costing_type" required>
                  Costing Type
                </Label>
                <select
                  id="costing_type"
                  className="border p-2 rounded cursor-pointer dark:bg-accent"
                  value={data.costing_type ?? costingOptions[0].value}
                  onChange={(e) => {
                    setData('costing_type', e.target.value);
                    if (e.target.value == 'all_in') {
                      setCostingTypeNotes('Customer must pay the overall amount provided by Cavite Tiger. It includes other charges (Fuel/Toll/Driver\'s Meal).');
                    } else if (e.target.value == 'all_out') {
                      setCostingTypeNotes('Down payment is Required. Customer will shoulder other charges (Fuel/Toll/Driver\'s Meal). Customer must pay the overall amount to the driver after their trip.');
                    } else {
                      setCostingTypeNotes(null);
                    }
                  }}
                  required
                >
                  <option value="">Select Costing Type</option>
                  {costingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {costingTypeNotes && (
                <NoteMessage
                  type="important"
                  message={costingTypeNotes}
                />
              )}

              {/* Duration */}
              {data.trip_type == 'round_trip' && (
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (Optional)</Label>
                  <select
                      id="duration"
                      name="duration"
                      value={data.duration}
                      onChange={(e) => setData('duration', e.target.value)}
                      className="w-full border rounded px-3 py-2"
                  >
                      <option value="">[ Select duration ]</option>
                      <option value="2 Days 1 Night">2 Days 1 Night</option>
                      <option value="3 Days 2 Nights">3 Days 2 Nights</option>
                      <option value="4 Days 3 Nights">4 Days 3 Nights</option>
                      <option value="5 Days 4 Nights">5 Days 4 Nights</option>
                      <option value="6 Days 5 Nights">6 Days 5 Nights</option>
                      <option value="7 Days 6 Nights">7 Days 6 Nights</option>
                      <option value="8 Days 7 Nights">8 Days 7 Nights</option>
                      <option value="9 Days 8 Nights">9 Days 8 Nights</option>
                      <option value="10 Days 9 Nights">10 Days 9 Nights</option>
                  </select>
                </div>
              )}

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label>First Name</Label>
                  <Input value={data.first_name} className="dark:bg-accent" disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Last Name</Label>
                  <Input value={data.last_name} className="dark:bg-accent" disabled />
                </div>
              </div>

              {/* Contact & Email */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label>Contact Number</Label>
                  <Input value={data.contact_number} className="dark:bg-accent" disabled />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input value={data.email} className="dark:bg-accent" disabled />
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
                  className="w-full border px-3 py-2 rounded-md dark:bg-accent"
                  placeholderText="Select date of trip"
                  minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
                  disabled={processing}
                />
                <InputError message={errors.date_of_trip} className="mt-2" />
              </div>

              {/* Pick-up */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label required>Pick-up Time</Label>
                  <Input
                    type="time"
                    value={data.pickup_time}
                    onChange={(e) => setData('pickup_time', e.target.value)}
                    disabled={processing}
                    className="dark:bg-accent"
                  />
                  <InputError message={errors.pickup_time} className="mt-2" />
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
                    required
                    className="dark:bg-accent"
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
                    className="dark:bg-accent"
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
                  className="w-full border px-3 py-2 rounded-md dark:bg-accent"
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
                              setActiveAgreementModal(true);
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
                                  setActiveAgreementModal(true);
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
                              setActiveAgreementModal(true);
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
      </ModalLarge>

      {/* View All Modal */}
      <ModalLarge activeModal={viewAllModal} setActiveModal={setViewAllModal} wrapContent>
        <h2 className="text-3xl font-bold mb-6 capitalize">{viewAllTitle}</h2>

        {viewAllPackages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No events found for this category.
          </p>
        ) : (
          <PackagesOverview
            currentPackages={viewAllPackages.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)}
            totalPages={Math.ceil(viewAllPackages.length / ITEMS_PER_PAGE)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onLocalTrip
            isAdmin={!!isAdmins}
          />
        )}
      </ModalLarge>

      {/* Agreement Modal */}
      <ModalLarge activeModal={activeAgreementModal} setActiveModal={setActiveAgreementModal}>
          {agreementIndex == 0 && <TermsAndConditions disableNav />}
          {agreementIndex == 1 && <PrivacyPolicy disableNav />}
          {agreementIndex == 2 && <CancellationPolicy disableNav />}
      </ModalLarge>
    </DashboardLayout>
  );
}