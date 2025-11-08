import { CustomTrip, PreferredVan, VanCategory, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, FormEventHandler, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@headlessui/react';
import VanSelection from '@/components/van-selection';
import PriceSign from './price-sign';
import { Mail, Pencil, Phone } from 'lucide-react';
import InputError from '@/components/input-error';
import { formatStatus, isAdmin, isDriver, isStaff } from '@/lib/utils';
import NoteMessage from './ui/note-message';

type CustomTripDetailsProps = {
  trip: CustomTrip;
  preferredVans: PreferredVan[];
  vanCategories: VanCategory[];
  editable?: boolean;
};

export default function CustomTripDetails({
  trip,
  preferredVans,
  vanCategories,
  editable,
}: CustomTripDetailsProps) {
  const { auth } = usePage<SharedData>().props;
  const isAdmins = isAdmin(auth.user);
  const isDrivers = isDriver(auth.user);
  const isStaffs = isStaff(auth.user);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedVanIds, setSelectedVanIds] = useState<number[]>(
    trip.preferred_van_id ? [trip.preferred_van_id] : []
  );

  const [data, setData] = useState({
    first_name: trip.first_name ?? '',
    last_name: trip.last_name ?? '',
    contact_number: trip.contact_number ?? '',
    email: trip.email ?? '',
    date_of_trip: trip.date_of_trip ?? '',
    pickup_time: trip.pickup_time ?? '',
    pickup_address: trip.pickup_address ?? '',
    destination: trip.destination ?? '',
    preferred_van_id: trip.preferred_van_id ?? null,
    status: trip.status ?? '',
    notes: trip.notes ?? '',
    payment_status: trip.payment?.status ?? 'pending',
    payment: trip.payment ?? null,
    total_amount: trip.total_amount,
    is_final_total: trip.is_final_total,
    pax_adult: trip.pax_adult,
    trip_type: trip.trip_type,
    costing_type: trip.costing_type,
    duration: trip.duration,
  });

  const toggleVanSelection = (vanId: number) => {
    if (selectedVanIds.includes(vanId)) {
      setSelectedVanIds([]);
      setData({ ...data, preferred_van_id: null, pax_adult: 0 });
    } else {
      setSelectedVanIds([vanId]);
      setData({ ...data, preferred_van_id: vanId });
    }
  };

  useEffect(() => {
    if (!editable || !isEditing) return;

    switch (data.payment_status) {
        case 'accepted':
        setData(prev => ({ ...prev, status: 'accepted' }));
        break;
        case 'pending':
        case 'on_process':
        setData(prev => ({ ...prev, status: 'on_process' }));
        break;
        case 'declined':
        setData(prev => ({ ...prev, status: 'declined' }));
        break;
        default:
        break;
    }
    }, [data.payment_status, editable, isEditing]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const formDataObj = {
      ...data,
      pickup_time: data.pickup_time ? data.pickup_time.slice(0, 5) : '',
      is_final_total: data.is_final_total ? '1' : '0',
    };

    const formData = new FormData();
    Object.entries(formDataObj).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // if (data.payment_status && data.payment_status !== '') {
    //   formData.append('status', data.payment_status);
    // }

    formData.append('_method', 'PUT');

    router.post(route('customTrips.update', { id: trip.id }), formData, {
      forceFormData: true,
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setIsEditing(false);
        router.visit(route('customTrips.show', trip.id));
      },
    });
  };

  const totalAmount = useMemo(() => data.total_amount ?? 0, [data.total_amount]);

  const [availableDates, setAvailableDates] = useState<{
    from: string;
    until: string;
    fully_booked_dates: string[];
  } | null>(null);

  useEffect(() => {
    if (data.preferred_van_id) {
      fetch(`/api/van/${data.preferred_van_id}/availability`)
        .then((res) => res.json())
        .then((result) => {
          setAvailableDates({
            from: result.available_from,
            until: result.available_until,
            fully_booked_dates: result.fully_booked_dates,
          });
        })
        .catch(() => setAvailableDates(null));
    }
  }, [data.preferred_van_id]);

  const selectedVan = preferredVans.find((v) => v.id === data.preferred_van_id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const tripOptions = [
    { value: "single_trip", label: "Single Trip" },
    { value: "round_trip", label: "Round Trip" },
  ];

  const costingOptions = [
    { value: "all_in", label: "All-In" },
    { value: "all_out", label: "All-Out" },
  ];

  const handleMarkCompletion = () => {
    try {
      router.post(route('customTrips.markCompletion', trip.id));
    } catch (e) {
      console.log(e);
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(
        'flex flex-col gap-6 p-4',
        trip.status === 'past_due' && 'bg-red-200',
        trip.status === 'completed' && 'bg-green-200'
      )}
    >
      <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex flex-row gap-4 items-center">
            <div>
              <p className="text-sm text-gray-500">Trip Number</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                {trip.booking_number ?? '-'}
              </h3>
            </div>
            <div>
              {!editable && <div className="card text-sm p-3">Custom Trip</div>}
            </div>
            <div>
                {trip.status == 'completed' && <div className="card text-sm p-3 bg-green-100 border-green-400">{trip.is_completed ? 'Confirmed Completed' : 'Completed'}</div>}
            </div>
            {trip.is_completed == false && trip.status == 'completed' && isAdmins && (
                <Button className="btn-primary cursor-pointer" onClick={handleMarkCompletion}>
                    Mark Completion
                </Button>
            )}
          </div>

          {(isAdmins || isStaffs) && editable && (
            <Button
              type="button"
              className={clsx(
                'btn-primary cursor-pointer',
                isEditing && 'bg-gray-100 text-black'
              )}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
          
        {/* Admin Review Reminder */}
        {!(!!trip.is_final_total) && (
            <div className="mt-4">
                <NoteMessage
                    type="important"
                    message="Your booking request is being reviewed by our team. Please wait for the confirmation and total amount of your trip."
                    leading="Admin review pending"
                />
            </div>
        )}

        {/* Customer Details */}
        <div className="mt-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Guest Details ({trip.pax_adult} Pax)
              </p>
            </div>

            <div className="bg-white p-4 space-y-2">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="text-base text-gray-900 font-medium">
                  {trip.first_name} {trip.last_name}
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Phone className="w-4 h-4" />
                <span>{trip.contact_number}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <Mail className="w-4 h-4" />
                <span>{trip.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Trip Summary */}
        <div className="mt-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4">
              <p className="text-sm text-gray-600">Custom Trip Summary</p>
            </div>

            <div className="bg-white p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Trip Type</p>
                {editable && isEditing ? (
                  <select
                    id="trip_type"
                    className="border p-2 rounded cursor-pointer"
                    value={data.trip_type ?? tripOptions[0].value}
                    onChange={(e) => setData({ ...data, trip_type: e.target.value })}
                  >
                    <option value="">Select Trip Type</option>
                    {tripOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-base font-medium">{trip.trip_type === 'single_trip' ? 'Single Trip' : 'Round Trip'}</p>
                )}

                <p className="text-sm text-gray-600 mt-2">Costing Type</p>
                {editable && isEditing ? (
                  <select
                    id="costing_type"
                    className="border p-2 rounded cursor-pointer"
                    value={data.costing_type ?? costingOptions[0].value}
                    onChange={(e) => setData({ ...data, costing_type: e.target.value })}
                  >
                    <option value="">Select Costing Type</option>
                    {costingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                    <p className="text-base font-medium">{trip.costing_type === 'all_in' ? 'All-In' : 'All-Out'}</p>
                )}

                {data.duration && (
                  <div>
                    <p className="text-sm text-gray-600 mt-2">Duration</p>
                      {editable && isEditing ? (
                        <select
                            id="duration"
                            name="duration"
                            value={data.duration}
                            onChange={(e) => setData({ ...data, duration: e.target.value })}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">[ Select duration ]</option>
                            <option value="2 Days 1 Night">2 Day 1 Night</option>
                            <option value="3 Days 2 Nights">3 Days 2 Nights</option>
                            <option value="4 Days 3 Nights">4 Days 3 Nights</option>
                            <option value="5 Days 4 Nights">5 Days 4 Nights</option>
                            <option value="6 Days 5 Nights">6 Days 5 Nights</option>
                            <option value="7 Days 6 Nights">7 Days 6 Nights</option>
                            <option value="8 Days 7 Nights">8 Days 7 Nights</option>
                            <option value="9 Days 8 Nights">9 Days 8 Nights</option>
                            <option value="10 Days 9 Nights">10 Days 9 Nights</option>
                        </select>
                      ) : (
                        <p className="text-base font-medium">{trip.duration}</p>
                      )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-4 space-y-4">
              {/* Date of Trip */}
              <div>
                <p className="text-sm text-gray-600">Date of Trip</p>
                {editable && isEditing ? (
                  <div className="flex flex-row items-center p-2">
                    <DatePicker
                      selected={
                        data.date_of_trip ? new Date(data.date_of_trip) : null
                      }
                      onChange={(date: Date | null) => {
                        if (date) {
                          const isoDate = format(date, 'yyyy-MM-dd');
                          setData({ ...data, date_of_trip: isoDate });
                        }
                      }}
                      dateFormat="yyyy-MM-dd"
                      minDate={
                        availableDates?.from
                          ? new Date(
                              Math.max(
                                new Date(availableDates.from).getTime(),
                                addDays(new Date(), 3).getTime()
                              )
                            )
                          : addDays(new Date(), 3)
                      }
                      maxDate={
                        availableDates?.until
                          ? new Date(availableDates.until)
                          : undefined
                      }
                      excludeDates={
                        availableDates?.fully_booked_dates?.map(
                          (d) => new Date(d)
                        ) ?? []
                      }
                      placeholderText="Select a date"
                      className="w-full border px-3 py-2 rounded-md"
                    />
                  </div>
                ) : (
                  <p className="text-base font-medium">{formatDate(trip.date_of_trip)}</p>
                )}
              </div>

              <hr />

              {/* Pickup & Dropoff Times */}
              <div>
                <p className="text-sm text-gray-600">Pickup Time</p>
                {editable && isEditing ? (
                  <Input
                    type="time"
                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
                    value={data.pickup_time}
                    onChange={(e) =>
                      setData({ ...data, pickup_time: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-base font-medium">
                    {trip.pickup_time
                      ? new Date(`1970-01-01T${trip.pickup_time}`).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      : '-'}
                  </p>
                )}
              </div>

              <hr />

              {/* Pickup Address & Destination */}
              <div>
                <p className="text-sm text-gray-600">Pickup Address</p>
                {editable && isEditing ? (
                  <Input
                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
                    value={data.pickup_address}
                    placeholder="Enter pickup address"
                    onChange={(e) =>
                      setData({ ...data, pickup_address: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-base font-medium">{trip.pickup_address}</p>
                )}

                <p className="text-sm text-gray-600 mt-2">Destination</p>
                {editable && isEditing ? (
                  <Input
                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
                    value={data.destination}
                    placeholder="Enter destination"
                    onChange={(e) =>
                      setData({ ...data, destination: e.target.value })
                    }
                  />
                ) : (
                  <p className="text-base font-medium">{trip.destination}</p>
                )}
              </div>

              <hr />

              {/* Preferred Van */}
              <div>
                <p className="text-sm text-gray-600">Preferred Van {!(editable && isEditing) && (<span className="text-sm text-gray-800">({trip.pax_adult} Pax)</span>)}</p> 
                {editable && isEditing ? (
                  <>
                    <VanSelection
                      preferredVans={preferredVans}
                      selectedVanIds={selectedVanIds}
                      onSelect={toggleVanSelection}
                      vanCategories={vanCategories}
                      small
                    />

                    <div className="grid gap-2 mt-2">
                      <Label htmlFor="pax_adult">No. of Pax</Label>
                      <Input
                        id="pax_adult"
                        type="number"
                        required
                        className="w-full p-2 border-1 border-gray-200 rounded-lg"
                        value={selectedVanIds.length === 0 ? '' : data.pax_adult}
                        disabled={selectedVanIds.length === 0}
                        placeholder="1"
                        max={selectedVan?.pax_adult}
                        min={1}
                        onChange={(e) => {
                          const value = e.target.value;
                          setData({
                            ...data,
                            pax_adult: value === '' ? 1 : Number(value),
                          });
                        }}
                      />
                      <InputError message={''} className="mt-2" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between border-1 border-t-0 border-r-0 border-l-0 border-b-gray-200">
                      <p className="text-base font-medium">{trip.preferred_van?.name}</p>
                      <span className="flex flex-row items-center text-sm text-gray-600">
                        <PriceSign />
                        <p>{trip.preferred_van?.additional_fee}</p>
                      </span>
                    </div>                 

                    {trip.is_final_total == true ? (
                      <>
                        {trip.preferred_van?.plate_number != null && (
                          <>
                            <p className="text-sm text-gray-800 mt-2">Plate Number</p>
                            <span className="text-black font-semibold">
                              {trip.preferred_van?.plate_number}
                            </span>
                          </>
                        )}

                        {(trip.preferred_van?.driver?.first_name != null ||
                          trip.preferred_van?.driver?.last_name != null) && (
                          <>
                            <p className="text-sm text-gray-800 mt-2">Assigned Driver</p>
                            <span className="text-black font-semibold">
                              {trip.preferred_van?.driver?.first_name}{' '}
                              {trip.preferred_van?.driver?.last_name}
                            </span>
                          </>
                        )}
                      </>
                    ): (
                      <div className="mt-2 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded-md text-sm">
                        Please wait for admin approval.
                      </div>
                    )}
                  </>
                )}
              </div>

              <hr />

              {/* Notes */}
              <div>
                <p className="text-sm text-gray-600">Notes</p>
                {editable && isEditing ? (
                  <Textarea
                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
                    rows={4}
                    placeholder="Add additional note"
                    value={data.notes}
                    onChange={(e) => setData({ ...data, notes: e.target.value })}
                  />
                ) : (
                  <p className="px-2">{trip.notes || '-'}</p>
                )}
              </div>

              <hr />

              {/* Status & Total Amount */}
              <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {editable && isEditing ? (
                    <select
                      value={trip.status}
                      onChange={(e) => setData({ ...data, status: e.target.value })}
                      className="text-base font-medium text-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="on_process">On Process</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                      <option value="past_due">Past Due</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  ) : (
                    <p className="text-base font-medium text-primary">
                      {formatStatus(trip.status)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    {editable && isEditing ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <PriceSign />
                            <Input
                                type="number"
                                className="w-32 border border-gray-300 rounded-md px-2 py-1"
                                value={data.total_amount ?? ''}
                                min={0}
                                step="0.01"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setData({
                                    ...data,
                                        total_amount: value === '' ? undefined : Number(value),
                                    });
                                }}
                                disabled={data.is_final_total}
                            />
                          </div>
                          {!(data.total_amount === null || data.total_amount === undefined || Number(data.total_amount) === 0) && (
                            <Button type="button" onClick={() => setData({...data, is_final_total: !data.is_final_total})}>{data.is_final_total == true ? 'Unset Final' : 'Set as Final'}</Button>
                          )}
                        </div>
                    ) : (
                        <div className="flex flex-row items-center text-primary">
                        <PriceSign />
                        <p className="text-base font-medium">
                            {Number(totalAmount).toLocaleString()}
                        </p>
                        </div>
                    )}
                    </div>
              </div>

              {/* Payment Status */}
              <div className={clsx(isDrivers && "hidden", "mt-4")}>
                  {!!trip.is_final_total == true && (
                    <>
                      {!data.payment ? (
                        data.status !== 'past_due' && data.status !== 'cancelled' && (
                            <div className="border rounded-lg p-4 mt-2 bg-yellow-50 border-yellow-300">
                            <p className="text-sm text-yellow-800">
                                {auth.user.is_admin || auth.user.is_driver
                                ? "The user hasn't completed the payment yet."
                                : "You haven't completed the payment yet."}
                            </p>
                            <Link
                                href={route('customTrips.payment', trip.id)}
                                className="inline-block mt-2 text-sm font-medium text-yellow-900 underline hover:text-yellow-700"
                            >
                                Pay Now → {window.location.origin}/custom-trips/payment/{trip.id}
                            </Link>
                        </div>
                        )
                    ) : (
                        <div
                            className={clsx(
                            'rounded-lg p-4 mt-2 border',
                            data.payment.status === 'accepted' && 'bg-green-50 border-green-300 text-green-800',
                            data.payment.status === 'pending' && 'bg-yellow-50 border-yellow-300 text-yellow-800',
                            data.payment.status === 'declined' && 'bg-red-50 border-red-300 text-red-800'
                            )}
                        >
                            {data.payment.status === 'accepted' && (
                                <>
                                    <p className="text-sm">
                                        Payment <strong>accepted</strong> via <strong>{data.payment.payment_method}</strong>.
                                    </p>
                                    <p className="text-sm">
                                        Reference: <strong>{data.payment.reference_number}</strong>
                                    </p>
                                    <p className="text-sm">
                                    <a
                                        href={data.payment.payment_proof_path}
                                        target="_blank"
                                        className="underline hover:text-green-700"
                                    >
                                        View Payment Proof
                                    </a>
                                    </p>
                                </>
                            )}

                            {data.payment.status === 'pending' && (
                                <>
                                    <p className="text-sm">
                                        ⏳ Payment is <strong>pending review</strong> via <strong>{data.payment.payment_method}</strong>.
                                    </p>
                                    <p className="text-sm">
                                        Reference: <strong>{data.payment.reference_number}</strong>
                                    </p>
                                    <p className="text-sm">
                                    <a
                                        href={data.payment.payment_proof_path}
                                        target="_blank"
                                        className="underline hover:text-yellow-700"
                                    >
                                        View Submitted Proof
                                    </a>
                                    </p>
                                </>
                            )}

                            {data.payment.status === 'declined' && (
                                <>
                                    <p className="text-sm">
                                        ❌ Payment was <strong>declined</strong>. Please resubmit or contact support.
                                    </p>
                                    <p className="text-sm">
                                        Reference: <strong>{data.payment.reference_number}</strong>
                                    </p>
                                    <p className="text-sm">
                                    <a
                                        href={data.payment.payment_proof_path}
                                        target="_blank"
                                        className="underline hover:text-red-700"
                                    >
                                        View Submitted Proof
                                    </a>
                                    </p>

                                    <Link
                                        href={route('customTrips.payment', trip.id)}
                                        className="inline-block mt-2 text-sm font-medium text-red-900 underline hover:text-red-700"
                                    >
                                        Resubmit here → {window.location.origin}/custom-trips/payment/{trip.id}
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Editable Payment Status */}
                    {editable && isEditing && (
                        <div className="mt-2">
                            <label className="text-sm text-gray-700 font-medium">Update Payment Status</label>
                            <select
                                value={data.payment_status || ''}
                                onChange={e => setData({ ...data, payment_status: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                            >
                            <option value="pending">Pending</option>
                            <option value="on_process">On Process</option>
                            <option value="accepted">Accepted</option>
                            <option value="declined">Declined</option>
                            </select>
                        </div>
                    )}
                    </>
                  )}
              </div>

              
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {editable && isEditing && (
          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" className="btn-primary cursor-pointer">
              Save
            </Button>
            <Button
              type="button"
              className="btn-primary bg-gray-100 text-gray-800 cursor-pointer"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}