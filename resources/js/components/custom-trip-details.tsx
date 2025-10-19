import { CustomTrip, PreferredVan, VanCategory, SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, FormEventHandler } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import VanSelection from '@/components/van-selection';
import PriceSign from './price-sign';
import { Pencil } from 'lucide-react';

type CustomTripDetailsProps = {
    trip: CustomTrip;
    preferredVans: PreferredVan[];
    vanCategories: VanCategory[];
    editable?: boolean;
};

export default function CustomTripDetails({ trip, preferredVans, vanCategories, editable }: CustomTripDetailsProps) {
    const { auth } = usePage<SharedData>().props;
    const [isEditing, setIsEditing] = useState(false);
    const [selectedVanIds, setSelectedVanIds] = useState<number[]>(trip.preferred_van_id ? [trip.preferred_van_id] : []);
    const [data, setData] = useState({
        first_name: trip.first_name ?? '',
        last_name: trip.last_name ?? '',
        contact_number: trip.contact_number ?? '',
        email: trip.email ?? '',
        date_of_trip: trip.date_of_trip ?? '',
        pickup_time: trip.pickup_time ?? '',
        dropoff_time: trip.dropoff_time ?? '',
        pickup_address: trip.pickup_address ?? '',
        destination: trip.destination ?? '',
        preferred_van_id: trip.preferred_van_id ?? null,
        status: trip.status ?? '',
        notes: trip.notes ?? '',
        payment_status: trip.payment?.status ?? 'pending',
        payment: trip.payment ?? null,
        total_amount: trip.total_amount ?? 0,
    });

    const toggleVanSelection = (vanId: number) => {
        if (selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setData({ ...data, preferred_van_id: null });
        } else {
            setSelectedVanIds([vanId]);
            setData({ ...data, preferred_van_id: vanId });
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        const formDataObj = {
            ...data,
            pickup_time: data.pickup_time ? data.pickup_time.slice(0, 5) : '',
            dropoff_time: data.dropoff_time ? data.dropoff_time.slice(0, 5) : '',
        };

        const formData = new FormData();
        Object.entries(formDataObj).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => formData.append(`${key}[]`, String(v)));
            } else formData.append(key, String(value ?? ''));
        });

        if(data.payment_status != null || data.payment_status != '') {
            const tripStatus = data.payment_status;
            formData.append('status', tripStatus);
        }

        formData.append('_method', 'PUT');

        router.post(route('customTrips.update', { id: trip.id }), formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                router.visit(route('customTrips.show', trip.id));
            }
        });
    };

    const totalAmount = useMemo(() => data.total_amount ?? 0, [data.total_amount]);

    return (
        <form
            onSubmit={handleSubmit}
            className={clsx(
                'flex flex-col gap-6 p-4',
                trip.status === 'past_due' && 'bg-red-50',
                trip.status === 'completed' && 'bg-green-50'
            )}
        >
            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Trip Number</p>
                        <h3 className="text-2xl font-semibold text-gray-900">{trip.booking_number ?? '-'}</h3>
                    </div>
                    {editable && (
                        <Button type="button" onClick={() => setIsEditing(!isEditing)}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Customer Details */}
                <div className="mt-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 text-sm text-gray-600">Customer Details</div>
                    <div className="bg-white p-4 grid grid-cols-2 gap-4">
                        <div>
                            <Label>First Name</Label>
                            <Input value={data.first_name} disabled />
                        </div>
                        <div>
                            <Label>Last Name</Label>
                            <Input value={data.last_name} disabled />
                        </div>
                        <div>
                            <Label>Contact Number</Label>
                            <Input value={data.contact_number} disabled />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value={data.email} disabled />
                        </div>
                    </div>
                </div>

                {/* Trip Details */}
                <div className="mt-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 text-sm text-gray-600">Trip Details</div>
                    <div className="bg-white p-4 grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Date of Trip</Label>
                            {editable && isEditing ? (
                                <DatePicker
                                    selected={data.date_of_trip ? new Date(data.date_of_trip) : null}
                                    onChange={(date: Date | null) => date && setData({ ...data, date_of_trip: date.toISOString().split('T')[0] })}
                                    className="w-full border px-3 py-2 rounded-md"
                                />
                            ) : (
                                <Input value={data.date_of_trip} disabled />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Pickup Time</Label>
                            {editable && isEditing ? (
                                <Input type="time" value={data.pickup_time} onChange={e => setData({ ...data, pickup_time: e.target.value })} />
                            ) : (
                                <Input value={data.pickup_time} disabled />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Dropoff Time</Label>
                            {editable && isEditing ? (
                                <Input type="time" value={data.dropoff_time} onChange={e => setData({ ...data, dropoff_time: e.target.value })} />
                            ) : (
                                <Input value={data.dropoff_time} disabled />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Pickup Address</Label>
                            {editable && isEditing ? (
                                <Input value={data.pickup_address} onChange={e => setData({ ...data, pickup_address: e.target.value })} />
                            ) : (
                                <Input value={data.pickup_address} disabled />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Destination</Label>
                            {editable && isEditing ? (
                                <Input value={data.destination} onChange={e => setData({ ...data, destination: e.target.value })} />
                            ) : (
                                <Input value={data.destination} disabled />
                            )}
                        </div>
                    </div>
                </div>

                {/* Van Selection */}
                <div className="mt-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 text-sm text-gray-600">Preferred Van</div>
                    <div className="bg-white p-4">
                        {editable && isEditing ? (
                            <VanSelection
                                preferredVans={preferredVans}
                                vanCategories={vanCategories}
                                small
                                selectedVanIds={selectedVanIds}
                                onSelect={toggleVanSelection}
                            />
                        ) : (
                            <p>{trip.preferred_van?.name ?? '-'}</p>
                        )}
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-6 border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 text-sm text-gray-600">Notes</div>
                    <div className="bg-white p-4">
                        {editable && isEditing ? (
                            <textarea
                                value={data.notes}
                                onChange={e => setData({ ...data, notes: e.target.value })}
                                className="w-full border px-3 py-2 rounded-md"
                                rows={4}
                            />
                        ) : (
                            <p>{data.notes || '-'}</p>
                        )}
                    </div>
                </div>

                {/* Payment & Status */}
                <div className="mt-6 border rounded-lg overflow-hidden p-4 bg-gray-50">

                {/* Trip Status */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">Trip Status</p>
                    {editable && isEditing ? (
                    <select
                        value={data.status}
                        onChange={e => setData({ ...data, status: e.target.value })}
                        className="border p-2 rounded-md"
                    >
                        <option value="pending">Pending</option>
                        <option value="on_process">On Process</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="past_due">Past Due</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    ) : (
                    <p className="font-medium capitalize">{data.status.replace(/_/g, ' ')}</p>
                    )}
                </div>

                    {/* Payment Status */}
                    <div>
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
                                    ✅ Payment <strong>accepted</strong> via <strong>{data.payment.payment_method}</strong>.
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
                    </div>
                    </div>


                {/* Total Amount */}
                <div className="mt-6 flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md">
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <div className="flex items-center text-primary">
                        <PriceSign />
                        {editable && isEditing ? (
                            <input
                                type="number"
                                value={data.total_amount}
                                onChange={(e) => setData({ ...data, total_amount: Number(e.target.value) })}
                                className="ml-2 w-24 border px-2 py-1 rounded-md text-right"
                            />
                        ) : (
                            <p className="text-base font-medium">{Number(trip.total_amount).toLocaleString()}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                {editable && isEditing && (
                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="submit">Save Changes</Button>
                        <Button type="button" className="bg-gray-200 text-gray-800" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                )}
            </div>
        </form>
    );
}
