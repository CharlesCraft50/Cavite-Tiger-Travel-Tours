import { Booking, OtherService, OtherServiceTourPackage, PreferredVan, TourPackage } from '@/types'
import { Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {  Mail, Pencil, Phone } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputError from './input-error';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Textarea } from '@headlessui/react';
import OtherServiceSelection from './other-service-selection';
import PriceSign from './price-sign';
import VanSelection from './van-selection';
import { formatStatus } from '@/lib/utils';

type BookingDetailsProp = {
    booking: Booking;
    otherServices?: OtherService[];
    packages?: TourPackage;
    vans?: PreferredVan[];
    editable?: boolean;
}

export default function BookingDetails({ booking, otherServices, packages, vans, editable }: BookingDetailsProp) {
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedOtherServiceIds, setSelectedOtherServiceIds] = useState<number[]>(
        booking.other_services?.map((s) => s.id) ?? []
    );

    useEffect(() => {
        const today = new Date();
        const departureDate = new Date(booking.departure_date);

        today.setHours(0, 0, 0, 0);
        departureDate.setHours(0, 0, 0, 0);

        if (departureDate < today) {
            if(data.status !== 'past_due') {
                const formData = new FormData();
                formData.append('preferred_van_id', String(booking.preferred_van?.id ?? ''));
                formData.append('departure_date', booking.departure_date);
                formData.append('return_date', booking.return_date);
                formData.append('status', 'past_due');
                formData.append('notes', booking.notes ?? '');
                formData.append('total_amount', Math.floor(booking.total_amount).toString());

                selectedOtherServiceIds.forEach((id) => {
                    formData.append('other_services[]', id.toString());
                });

                formData.append('_method', 'put');
                setTimeout(() => {
                    router.post(
                        route('bookings.update', booking.id),
                        formData,
                        {
                            forceFormData: true,
                            preserveScroll: true,
                            preserveState: true,
                            onFinish: () => {
                                setData('status', 'past_due');
                            },
                        }
                    );
                }, 100);
            }
            
        }
    }, [booking.departure_date, booking.status]);

    const [selectedVanIds, setSelectedVanIds] = useState<number[]>(
        booking.preferred_van ? [booking.preferred_van.id] : []
    );

    type OtherServiceWithPivot = OtherService & {
        pivot?: OtherServiceTourPackage;
    };

    const mergedOtherServices: OtherServiceWithPivot[] = useMemo(() => {
        const withPivot = otherServices?.map(service => {
            const match = packages?.other_services?.find(p => p.id === service.id);
            return {
                ...service,
                pivot: match?.pivot,
            };
    }) || [];

    // Sort: recommended first, then by sort_order (if available), then fallback to name
    return withPivot.sort((a, b) => {
        const aRec = a.pivot?.is_recommended ? 1 : 0;
        const bRec = b.pivot?.is_recommended ? 1 : 0;

        if (bRec !== aRec) return bRec - aRec;

        // If both have same recommended status, use sort_order if available
        const aOrder = a.pivot?.sort_order ?? 9999;
        const bOrder = b.pivot?.sort_order ?? 9999;

        if (aOrder !== bOrder) return aOrder - bOrder;

        // Fallback to name
        return a.name.localeCompare(b.name);
    });
    }, [otherServices, packages]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(date);
    }

    type BookingDetailForm = {
        preferred_van_id: number | null | undefined;
        departure_date: string;
        return_date: string;
        status: string;
        notes: string;
        other_services: number[] | undefined;
        total_amount: number;
        pax_adult: number;
        pax_kids: number;
        payment_status: string;
    }

    const { data, setData, processing, errors } = useForm<BookingDetailForm>({
        preferred_van_id: booking.preferred_van?.id,
        departure_date: booking.departure_date,
        return_date: booking.return_date,
        status: booking.status ?? '',
        notes: booking.notes ?? '',
        other_services: booking.other_services?.map((s) => s.id),
        total_amount: booking.total_amount,
        pax_adult: booking.pax_adult,
        pax_kids: booking.pax_kids,
        payment_status: booking.payment?.status,
    });

    const toggleVanSelection = (vanId: number) => {
        if(selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setData('preferred_van_id', null);
            setAvailableDates(null);
        } else {
            setSelectedVanIds([vanId]);
            setData('preferred_van_id', vanId);
        }
        
        setData('pax_adult', 0);
        setData('pax_kids', 0);
    }

    const toggleServiceSelection = (serviceId: number) => {
        let updatedIds: number[];
        if (selectedOtherServiceIds.includes(serviceId)) {
            updatedIds = selectedOtherServiceIds.filter(id => id !== serviceId);
        } else {
            updatedIds = [...selectedOtherServiceIds, serviceId];
        }

        setSelectedOtherServiceIds(updatedIds);
        setData('other_services', updatedIds);
    };

    const arraysEqual = (a?: number[], b?: number[]) => {
        if (!a || !b) return false;
        if (a.length !== b.length) return false;
        const aSorted = [...a].sort();
        const bSorted = [...b].sort();
        return aSorted.every((val, index) => val === bSorted[index]);
    };

    useEffect(() => {
        const changed =
            data.departure_date !== booking.departure_date ||
            data.return_date !== booking.return_date ||
            data.status !== booking.status ||
            data.notes !== booking.notes ||
            !arraysEqual(data.other_services, booking.other_services?.map(s => s.id)) ||
            data.preferred_van_id !== booking.preferred_van?.id ||
            data.payment_status !== booking.payment?.status;

        setHasChanges(changed);
    }, [data, booking]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('preferred_van_id', String(data.preferred_van_id ?? ''));
        formData.append('departure_date', data.departure_date);
        formData.append('return_date', data.return_date);
        formData.append('status', data.status);
        formData.append('notes', data.notes);
        formData.append('total_amount', data.total_amount.toString());
        formData.append('payment_status', data.payment_status || 'pending');

        selectedOtherServiceIds.forEach((id) => {
            formData.append('other_services[]', id.toString());
        });

        formData.append('_method', 'put');
        router.post(route('bookings.update', booking.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onFinish: toggleIsEditing,
        });
    }

    const cancelChanges = () => {
        setData('departure_date', booking.departure_date);
        setData('return_date', booking.return_date);
        setData('status', booking.status);
        setData('notes', booking.notes || '');
        setData('payment_status', booking.payment?.status || 'pending');

        const otherServiceIds = booking.other_services?.map((s) => s.id) ?? [];
        setData('other_services', otherServiceIds);
        setSelectedOtherServiceIds(otherServiceIds); // ✅ sync UI state

        const preferredVanId = booking.preferred_van?.id ?? null;
        setData('preferred_van_id', preferredVanId);
        setSelectedVanIds(preferredVanId ? [preferredVanId] : []); // ✅ sync UI state

        toggleIsEditing();
    }

    const [availableDates, setAvailableDates] = useState<{
        from: string;
        until: string;
        fully_booked_dates: string[];
    } | null>(null);

    useEffect(() => {
        if (data.preferred_van_id) {
            fetch(`/api/van/${data.preferred_van_id}/availability`)
            .then(res => res.json())
            .then(data => {
                setAvailableDates({
                    from: data.available_from,
                    until: data.available_until,
                    fully_booked_dates: data.fully_booked_dates,
                });
            }) 
        }
    }, [data.preferred_van_id]);

    const toggleIsEditing = () => {
        const enabled = !isEditing;
        setIsEditing(enabled);
    }

    useEffect(() => {
        let total = packages?.base_price ?? 0;

        // Add custom price from selected category if applicable
        const selectedCategory = packages?.package_categories?.find(cat => cat.id === booking.package_category_id);
        if (selectedCategory?.use_custom_price && selectedCategory.custom_price) {
            total += Number(selectedCategory.custom_price);
        }

        // Add preferred van additional fee
        const selectedVan = vans?.find(v => v.id === data.preferred_van_id);
        if (selectedVan?.additional_fee) {
            total += Number(selectedVan.additional_fee);
        }

        // Add selected other service prices
        for (const serviceId of selectedOtherServiceIds) {
            const service = mergedOtherServices.find(s => s.id === serviceId);
            if (service) {
                const price =
                    service.pivot?.package_specific_price && service.pivot.package_specific_price > 0
                        ? service.pivot.package_specific_price
                        : service.price ?? 0;

                total += Number(price);
            }
        }

        // Prevent setting NaN
        if (!isNaN(total)) {
            setData('total_amount', total);
        }
    }, [
        selectedOtherServiceIds,
        booking.package_category_id,
        data.preferred_van_id,
        packages?.base_price,
        packages?.package_categories,
        mergedOtherServices
    ]);

  return (
    <form className={clsx("flex flex-col gap-6 p-4", booking.status == 'past_due' && "bg-red-200")} onSubmit={submit}>
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between top-0 right-0 items-center">
                <div className="grid gap-2">
                    <p className="text-sm text-gray-500">Booking Number</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                        {booking.booking_number}
                    </h3>
                </div>

                <Button type="button" className={clsx("btn-primary cursor-pointer", isEditing && "bg-gray-100 text-black")} onClick={toggleIsEditing}>
                    <Pencil className="w-4 h-4" />
                </Button>
            </div>

            

            <div className="mt-8">
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                            Guest Details ({booking.pax_adult} Adults, {booking.pax_kids} Kids)
                        </p>
                    </div>

                    <div className="bg-white p-4 space-y-2">
                        <div>
                            <p className="text-sm text-gray-600">Full Name</p>
                            <p className="text-base text-gray-900 font-medium">
                                {booking.first_name} {booking.last_name}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Phone className="w-4 h-4" />
                            <span>{booking.contact_number}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{booking.email}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                            Package Summary
                        </p>
                    </div>

                    <div className="bg-white p-4 space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">Tour Package</p>
                            <p className="text-base font-medium">{booking.tour_package?.title}</p>

                            <p className="text-sm text-gray-600 mt-2">Selected Option</p>
                            <p className="text-base font-medium">{booking.package_category?.name}</p>
                        </div>

                        <hr />

                        <div>
                            <p className="text-sm text-gray-600">Preferred Van</p>
                            {editable && isEditing ? (
                                <>
                                    <VanSelection 
                                        preferredVans={vans || []}
                                        selectedVanIds={selectedVanIds}
                                        onSelect={toggleVanSelection}
                                    />
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between border-1 border-t-0 border-r-0 border-l-0 border-b-gray-200">
                                        <p className="text-base font-medium">{booking.preferred_van?.name}</p>
                                        <span className="flex flex-row items-center text-sm text-gray-600">
                                            <PriceSign />
                                            <p>{booking.preferred_van?.additional_fee}</p>
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-800">({booking.pax_adult} Adults, {booking.pax_kids} Kids)</p>
                                </>
                            )}
                        </div>

                        <hr />
                        
                        <div>
                            {/* Departure Date */}
                            <p className="text-sm text-gray-600">Departure Date</p>
                            {editable && isEditing ? (
                                <div className="flex flex-row items-center p-2">
                                    <DatePicker
                                        disabled={processing}
                                        selected={data.departure_date ? new Date(data.departure_date) : null}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                                const isoDate = format(date, 'yyyy-MM-dd');
                                                setData("departure_date", isoDate);
            
                                                // Clear return_date if it becomes invalid
                                                if (data.return_date && new Date(data.return_date) < date) {
                                                    setData("return_date", "");
                                                }
                                            }
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={availableDates?.from ? new Date(availableDates.from) : undefined}
                                        maxDate={availableDates?.until ? new Date(availableDates.until) : undefined}
                                        excludeDates={
                                            availableDates?.fully_booked_dates?.map(date => new Date(date)) ?? []
                                        }
                                        placeholderText="Select a departure date"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <InputError message={errors.departure_date} className="mt-2" />
                                </div>
                            ) : (
                                <p className="text-base font-medium">{formatDate(booking.departure_date)}</p>
                            )}

                            {/* Return Date */}
                            <p className="text-sm text-gray-600 mt-2">Return Date</p>
                            {editable && isEditing ? (
                                <div className="flex flex-row items-center p-2">
                                    <DatePicker
                                        disabled={processing}
                                        selected={data.return_date ? new Date(data.return_date) : null}
                                        onChange={(date: Date | null) => {
                                            if (date) {
                                            const isoDate = format(date, 'yyyy-MM-dd');
                                                setData("return_date", isoDate);
                                            }
                                        }}
                                        dateFormat="yyyy-MM-dd"
                                        minDate={data.departure_date ? new Date(data.departure_date) : (availableDates?.from ? new Date(availableDates.from) : undefined)}
                                        maxDate={availableDates?.until ? new Date(availableDates.until) : undefined}
                                        excludeDates={
                                            availableDates?.fully_booked_dates?.map(date => new Date(date)) ?? []
                                        }
                                        placeholderText="Select a return date"
                                        className="w-full border px-3 py-2 rounded-md"
                                    />
                                    <InputError message={errors.departure_date} className="mt-2" />
                                </div>
                            ) : (
                                <p className="text-base font-medium">{formatDate(booking.return_date)}</p>
                            )}
                        </div>

                        <hr />

                        <div>
                            <p className="text-sm text-gray-600">Add-On Services</p>
                            {editable && isEditing ? (
                                <OtherServiceSelection
                                    otherServices={mergedOtherServices}
                                    selectedOtherServiceIds={selectedOtherServiceIds}
                                    onSelect={toggleServiceSelection}
                                    selectable
                                    editable={editable}
                                />
                            ) : (
                                <ul className="text-sm divide-y">
                                    {booking.other_services && booking.other_services.length > 0 && (
                                        booking.other_services.map((s) => {
                                        const pivotPrice = s.pivot?.package_specific_price;
                                        const price = pivotPrice && pivotPrice > 0 ? pivotPrice : s.price ?? 0;

                                        return (
                                            <li key={s.id} className="flex justify-between py-1">
                                                <span>{s.name}</span>
                                                <span className="flex flex-row items-center text-gray-600">
                                                    <PriceSign />
                                                    {Number(price).toLocaleString()}
                                                </span>
                                            </li>
                                        );
                                        })
                                    )}
                                </ul>
                            )}
                        </div>
                        
                        <hr />

                        <div>
                            <p className="text-sm text-gray-600">Notes</p>
                            {editable && isEditing ? (
                                <Textarea
                                    className="w-full p-2"
                                    rows={4}
                                    placeholder="Add additional note"
                                    onChange={(e) => setData('notes', e.target.value)}
                                >
                                    {booking.notes}
                                </Textarea>
                            ) : (
                                <p className="px-2">{booking.notes}</p>
                            )}
                        </div>
                        
                        <hr/>

                        <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md">
                            <div>
                                {!booking.payment?.status && (
                                    <>
                                        <p className="text-sm text-gray-600">Status</p>
                                        {editable && isEditing ? (
                                            <>
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => setData('status', e.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="declined">Declined</option>
                                                    <option value="past_due">Past Due</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-base font-medium text-primary">{formatStatus(booking.status)}</p>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Total Amount</p>
                                {editable && isEditing ? (
                                    <div className="flex flex-row items-center text-primary">
                                        <PriceSign />
                                        <p className="text-base font-medium">{Number(data.total_amount).toLocaleString()}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center text-primary">
                                        <PriceSign />
                                        <p className="text-base font-medium">{Number(booking.total_amount).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                                
                        <div id="booking_payment_area">

                            {!booking.payment ? (
                                    booking.status !== 'past_due' && booking.status !== 'cancelled' && (
                                        <div className="border rounded-lg p-4 mt-4 bg-yellow-50 border-yellow-300">
                                            <p className="text-sm text-yellow-800">
                                                You haven't completed the payment yet.
                                            </p>
                                            <Link
                                                href={route('booking.payment', booking.id)}
                                                className="inline-block mt-2 text-sm font-medium text-yellow-900 underline hover:text-yellow-700"
                                            >
                                                Pay Now → {window.location.origin}/book-now/payment/{booking.id}
                                            </Link>
                                        </div>
                                    )
                                ) : (
                                    <div>
                                        {booking.payment && (
                                            <div
                                                className={clsx(
                                                    'rounded-lg p-4 mt-4 border',
                                                    booking.payment.status === 'accepted' && 'bg-green-50 border-green-300 text-green-800',
                                                    booking.payment.status === 'pending' && 'bg-yellow-50 border-yellow-300 text-yellow-800',
                                                    booking.payment.status === 'declined' && 'bg-red-50 border-red-300 text-red-800'
                                                )}
                                            >
                                                {booking.payment.status === 'accepted' && (
                                                    <>
                                                        <p className="text-sm">
                                                            ✅ Payment <strong>accepted</strong> via <strong>{booking.payment.payment_method}</strong>.
                                                        </p>
                                                        <p className="text-sm">
                                                            Reference: <strong>{booking.payment.reference_number}</strong>
                                                        </p>
                                                        <p className="text-sm">
                                                            <a
                                                                href={booking.payment.payment_proof_path}
                                                                target="_blank"
                                                                className="underline hover:text-green-700"
                                                            >
                                                                View Payment Proof
                                                            </a>
                                                        </p>
                                                    </>
                                                )}

                                                {booking.payment.status === 'pending' && (
                                                    <>
                                                        <p className="text-sm">
                                                            ⏳ Payment is <strong>pending review</strong> via <strong>{booking.payment.payment_method}</strong>.
                                                        </p>
                                                        <p className="text-sm">
                                                            Reference: <strong>{booking.payment.reference_number}</strong>
                                                        </p>
                                                        <p className="text-sm">
                                                            <a
                                                                href={booking.payment.payment_proof_path}
                                                                target="_blank"
                                                                className="underline hover:text-yellow-700"
                                                            >
                                                                View Submitted Proof
                                                            </a>
                                                        </p>
                                                    </>
                                                )}

                                                {booking.payment.status === 'declined' && (
                                                    <>
                                                        <p className="text-sm">
                                                            ❌ Payment was <strong>declined</strong>. Please resubmit or contact support.
                                                        </p>
                                                        <p className="text-sm">
                                                            Reference: <strong>{booking.payment.reference_number}</strong>
                                                        </p>
                                                        <p className="text-sm">
                                                            <a
                                                                href={booking.payment.payment_proof_path}
                                                                target="_blank"
                                                                className="underline hover:text-red-700"
                                                            >
                                                                View Submitted Proof
                                                            </a>
                                                        </p>

                                                        <Link
                                                            href={route('booking.payment', booking.id)}
                                                            className="inline-block mt-2 text-sm font-medium text-red-900 underline hover:text-red-700"
                                                        >
                                                            Resubmit here → {window.location.origin}/book-now/payment/{booking.id}
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                )}

                                {editable && isEditing ? (
                                    <div className="mb-2 mt-2">
                                        <label className="text-sm text-gray-700 font-medium">Update Payment Status</label>
                                        <select
                                            value={data.payment_status}
                                            onChange={(e) => setData('payment_status', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md mt-1"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="declined">Declined</option>
                                        </select>
                                    </div>
                                ) : (
                                    booking.payment?.status && (
                                        <p className="flex flex-col text-md p-2 text-gray-600">
                                            Payment Status
                                            <strong className="capitalize text-primary">{booking.payment?.status}</strong>
                                        </p>
                                    )
                                )}

                            </div>

                        </div>
                </div>
            </div>

            {hasChanges && (
                <div className="flex justify-end gap-2 p-4">
                    <Button
                        type="submit"
                        className="btn-primary cursor-pointer"
                    >
                        Save
                    </Button>

                    <Button
                        type="button"
                        className="btn-primary bg-gray-100 text-gray-800 cursor-pointer"
                        onClick={cancelChanges}
                    >
                        Cancel
                    </Button>
                </div>
            )}

        </div>
        
    </form>
  )
}
