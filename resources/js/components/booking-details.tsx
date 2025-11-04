import { Booking, OtherService, OtherServiceTourPackage, PreferredVan, SharedData, TourPackage, VanCategory } from '@/types'
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { addDays, format } from 'date-fns';
import {  Mail, Pencil, Phone } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import InputError from './input-error';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@headlessui/react';
import OtherServiceSelection from './other-service-selection';
import PriceSign from './price-sign';
import VanSelection from './van-selection';
import { formatStatus, isAdmin, isDriver, isStaff } from '@/lib/utils';
import { Label } from './ui/label';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StarRating from './star-rating';
import FadePopup from './ui/fade-popup';
import { AnimatePresence } from 'framer-motion';
import UserReview from './user-review';

type BookingDetailsProp = {
    booking: Booking;
    otherServices?: OtherService[];
    packages?: TourPackage;
    vans?: PreferredVan[];
    vanCategories?: VanCategory[];
    editable?: boolean;
}

export default function BookingDetails({ booking, otherServices, packages, vans, vanCategories, editable }: BookingDetailsProp) {
    const [hasChanges, setHasChanges] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [ rating, setRating ] = useState<number | null>(null);
    const [ errorRating, setErrorRating ] = useState<string>('');
    const [ comment, setComment ] = useState<string | null>(null);
    const userReview = packages?.reviews?.[0] ?? null;
    const [hasReview, setHasReview] = useState<boolean>(!!userReview?.id);
    const [selectedOtherServiceIds, setSelectedOtherServiceIds] = useState<number[]>(
        booking.other_services?.map((s) => s.id) ?? []
    );

    useEffect(() => {
        console.log(packages);
    }, []);

    const { auth } = usePage<SharedData>().props;
    const isAdmins = isAdmin(auth.user);
    const isDrivers = isDriver(auth.user);
    const isStaffs = isStaff(auth.user);

    useEffect(()=>{
        console.log(`isAdmin ${isAdmins} || ${isDrivers} Editable: ${editable} `);
    }, []);

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
                formData.append('pax_kids', data.pax_kids.toString());
                formData.append('pax_adult', data.pax_adult.toString());
                formData.append('return_date', booking.return_date);
                if (booking.payment == null || booking.payment?.status == 'pending' || booking.payment?.status == 'declined') {
                    formData.append('status', 'past_due');
                } else {
                    formData.append('status', 'completed');
                }

                formData.append('notes', booking.notes ?? '');
                formData.append('pickup_address', booking.pickup_address ?? '');
                formData.append('total_amount', Math.floor(data.total_amount).toString());

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
        pickup_address: string;
        other_services: number[] | undefined;
        total_amount: number;
        is_final_total: boolean;
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
        pickup_address: booking.pickup_address ?? '',
        other_services: booking.other_services?.map((s) => s.id),
        total_amount: booking.total_amount,
        is_final_total: booking.is_final_total,
        pax_adult: booking.pax_adult,
        pax_kids: booking.pax_kids,
        payment_status: booking.payment?.status,
    });

    const toggleVanSelection = (vanId: number) => {
        if (selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setData('preferred_van_id', null);
            setAvailableDates(null);
            setData('pax_adult', 0);
            setData('pax_kids', 0);
            // Reset total when van is deselected
            setData('total_amount', booking.total_amount);
        } else {
            setSelectedVanIds([vanId]);
            setData('preferred_van_id', vanId);
            // Recalculate total based on the new van selection
            const selectedVan = vans?.find(v => v.id === vanId);
            let total = 0;
            const adults = Number(data.pax_adult) || 1;
            const kids = Number(data.pax_kids) || 0;
            const people = adults + kids;

            total += people * (packages?.base_price ?? 0);

            const selectedCategory = packages?.package_categories?.find(cat => cat.id === booking.package_category_id);
            if (selectedCategory?.use_custom_price && selectedCategory.custom_price) {
                total += Number(selectedCategory.custom_price);
            }

            if (selectedVan?.additional_fee) {
                total += Number(selectedVan.additional_fee);
            }

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

            setData('total_amount', total);
        }
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
             (data.departure_date || '') !== (booking.departure_date || '') ||
            (data.return_date || '') !== (booking.return_date || '') ||
            (data.status || '') !== (booking.status || '') ||
            (data.notes || '') !== (booking.notes || '') ||
            (data.pickup_address || '') !== (booking.pickup_address || '') ||
            !arraysEqual(data.other_services, booking.other_services?.map(s => s.id)) ||
            (data.preferred_van_id || null) !== (booking.preferred_van?.id || null) ||
            (data.payment_status) !== (booking.payment?.status) ||
            (data.pax_adult) !== (booking.pax_adult) ||
            (data.pax_kids) !== (booking.pax_kids) ||
            (data.total_amount) !== (booking.total_amount) ||
            (data.is_final_total) !== (booking.is_final_total);

        setHasChanges(changed);
    }, [data, booking]);

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('preferred_van_id', String(data.preferred_van_id ?? ''));
        formData.append('departure_date', data.departure_date);
        formData.append('return_date', data.return_date);
        formData.append('status', data.status);
        formData.append('notes', data.notes);
        formData.append('pickup_address', data.pickup_address);
        formData.append('pax_kids', data.pax_kids.toString());
        formData.append('pax_adult', data.pax_adult.toString());
        formData.append('total_amount', Math.floor(data.total_amount).toString());
        formData.append('is_final_total', data.is_final_total ? '1' : '0');

        if (data.payment_status && data.payment_status !== '') {
            formData.append('payment_status', data.payment_status);
        }

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

    const [popupMessage, setPopupMessage] = useState('');
    const [popupDuration, setPopupDuration] = useState(2000);

    const submitReview = () => {
        if (rating == null) {
            setErrorRating('You must give at least one star.');
            return;
        }

        router.post(route('packageReviews.store', booking.id), {
            tour_package_id: booking.tour_package_id,
            rating: rating,
            comment: comment ?? '',
        }, {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setPopupMessage('Thank you!');
                setPopupDuration(2000);
                setHasReview(true);
            }
        });
    }

    const cancelChanges = () => {
        setData('departure_date', booking.departure_date);
        setData('return_date', booking.return_date);
        setData('status', booking.status);
        setData('notes', booking.notes || '');
        setData('pickup_address', booking.pickup_address || '');
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

    const computedTotal = useMemo(() => {
        const adults = Number(data.pax_adult) || 1; // default to 1
        const kids = Number(data.pax_kids) || 0;

        // Package price (per person)
        const people = adults + kids;
        let total = 0;

        console.log(people);

        total += people * packages!.base_price;

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

        return total;
    }, [
        selectedOtherServiceIds,
        booking.package_category_id,
        data.preferred_van_id,
        packages?.base_price,
        packages?.package_categories,
        mergedOtherServices,
        data.pax_adult,
        data.pax_kids,
    ]);

    // useEffect(() => {
    //     setData('total_amount', computedTotal);
    // }, [computedTotal]);

    const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <form className={clsx("flex flex-col gap-6 p-4", booking.status == 'past_due' && "bg-red-200", booking.status == 'completed' && "bg-green-200")} onSubmit={submit}>
        <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex justify-between top-0 right-0 items-center">
                <div className="grid gap-2">
                    <p className="text-sm text-gray-500">Booking Number</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                        {booking.booking_number}
                    </h3>
                </div>
                
                {(isAdmins || isDrivers || isStaffs) ? (
                    <div className="flex flex-row gap-2">
                        <Button type="button" className={clsx("btn-primary cursor-pointer", isEditing && "bg-gray-100 text-black")} onClick={toggleIsEditing}>
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-row gap-2">
                        <Link 
                            href={route('localTrip', { package: packages?.slug })}
                            className="btn-primary cursor-pointer text-xs py-2 flex items-center justify-center"
                        >
                            Visit Package
                        </Link>
                    </div>
                )}
            </div>

            {!(!!booking.is_final_total) && (
                <div className="mt-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5 mt-[2px] flex-shrink-0 text-blue-600"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                        />
                        </svg>
                        <p className="text-sm leading-relaxed">
                        <span className="font-medium">Admin review pending:</span>{' '}
                            Your booking request is being reviewed by our team. Please wait for the
                            confirmation and total amount of your trip.
                        </p>
                    </div>
                </div>
            )}

            

            <div className="mt-8">
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                        <p className="text-sm text-gray-600">
                            Guest Details ({booking.pax_adult} Pax)
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

                            {/* <p className="text-sm text-gray-600 mt-2">Selected Option</p>
                            <p className="text-base font-medium">{booking.package_category?.name}</p> */}
                            <p className="text-sm text-gray-600 mt-2">Selected Preferred Preparation</p>
                            <p className="text-base font-medium">{booking.preferred_preparation?.label}</p>

                            {!!booking.preferred_preparation?.requires_valid_id && (booking.valid_id_paths || []).length > 0 && (
                                <>
                                    <p className="text-sm text-gray-600 mt-2">Valid ID</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(booking.valid_id_paths || []).map((path, idx) => (
                                            <div
                                                key={idx}
                                                className="w-40 h-52 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden cursor-pointer"
                                                onClick={() => setOpenImage(path)}
                                            >
                                                <img
                                                    alt={`Valid ID ${idx + 1}`}
                                                    className="max-w-full max-h-full object-contain cursor-pointer"
                                                    src={path}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <Dialog open={!!openImage} onOpenChange={(open) => !open && setOpenImage(null)}>
                                        <DialogContent className="p-0 max-w-md sm:max-w-lg bg-transparent rounded-none">
                                            {openImage && (
                                                <img
                                                    src={openImage}
                                                    alt="Valid ID Fullscreen"
                                                    className="w-full h-full object-contain cursor-pointer"
                                                    onClick={() => setOpenImage(null)}
                                                />
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </div>

                        

                        <hr />

                        <div>
                            {booking.preferred_van && (<p className="text-sm text-gray-600">Preferred Van {!(editable && isEditing) && (<span className="text-sm text-gray-800">({booking.pax_adult} Pax)</span>)}</p>)}
                            {editable && isEditing ? (
                                <>
                                    <VanSelection 
                                        preferredVans={vans || []}
                                        selectedVanIds={selectedVanIds}
                                        onSelect={toggleVanSelection}
                                        vanCategories={vanCategories}
                                        small
                                    />

                                    <div className="grid gap-2">
                                        <Label htmlFor="pax_adult">No. of Pax</Label>
                                        <Input
                                            id="pax_adult"
                                            type="number"
                                            required
                                            className="w-full p-2 border-1 border-gray-200 rounded-lg"
                                            value={selectedVanIds.length === 0 ? '' : data.pax_adult}
                                            disabled={processing || selectedVanIds.length === 0}
                                            placeholder="1"
                                            max={vans?.find(v => v.id === selectedVanIds[0])?.pax_adult}
                                            min={1}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // If cleared, always reset to 1
                                                setData('pax_adult', value === '' ? 1 : Number(value));
                                            }}
                                            />
                                        <InputError message={errors.pax_adult} className="mt-2" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {booking.preferred_van && (<div className="flex justify-between border-1 border-t-0 border-r-0 border-l-0 border-b-gray-200">
                                        <p className="text-base font-medium">{booking.preferred_van?.name}</p>
                                        <span className="flex flex-row items-center text-sm text-gray-600">
                                            <PriceSign />
                                            <p>{booking.preferred_van?.additional_fee}</p>
                                        </span>
                                    </div>)}
                                    
                                    {booking.preferred_van?.plate_number != null && (
                                        <>
                                            <p className="text-sm text-gray-800">Plate Number</p>
                                            <span className="text-black font-semibold">{booking.preferred_van?.plate_number}</span>
                                        </>
                                    )}

                                    {booking.preferred_van && (
                                        <>
                                            <p className="text-sm text-gray-800">Assigned Driver</p>
                                            <span className="text-black font-semibold">{booking?.preferred_van.driver?.first_name} {booking?.preferred_van.driver?.last_name}</span>
                                        </>
                                    )}

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
                                        minDate={
                                            availableDates?.from
                                                ? new Date(
                                                    Math.max(
                                                        new Date(availableDates.from).getTime(),
                                                        addDays(new Date(), 3).getTime() // 3 days from today
                                                    )
                                                )
                                                : addDays(new Date(), 3) // fallback: 3 days from today
                                        }
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

                        {/* <div>
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
                        </div> */}
                        
                        <hr />

                        <div>
                            <p className="text-sm text-gray-600">Pickup Address</p>
                            {editable && isEditing ? (
                                <Input
                                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
                                    value={data.pickup_address}
                                    placeholder="Add additional note"
                                    onChange={(e) => setData('pickup_address', e.target.value)}
                                />
                            ) : (
                                <p className="px-2">{booking.pickup_address}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-sm text-gray-600">Notes</p>
                            {editable && isEditing ? (
                                <Textarea
                                    className="w-full p-2 border-1 border-gray-200 rounded-lg"
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

                        {(!(isAdmins || isDrivers || isStaffs) && !(booking.is_final_total)) && (
                            <div className="flex items-start gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-800">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5 mt-[2px] flex-shrink-0 text-blue-600"
                                >
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                    />
                                </svg>
                                <p className="text-sm leading-relaxed">
                                    <span className="font-semibold uppercase tracking-wide">Important!</span>{' '}
                                    Please wait for the admin to finalize your total amount before proceeding with payment.
                                </p>
                            </div>
                        )}


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
                                                    <option value="on_process">On Process</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="declined">Declined</option>
                                                    <option value="past_due">Past Due</option>
                                                    <option value="cancelled">Cancelled</option>
                                                    <option value="completed">Completed</option>
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
                                
                                <div className="flex flex-row items-center text-primary">
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
                                                        setData('total_amount', Number(value));
                                                    }}
                                                    disabled={data.is_final_total}
                                                />
                                            </div>
                                            <Button type="button" onClick={() => setData('is_final_total', !data.is_final_total)}>{data.is_final_total == true ? 'Unset Final' : 'Set as Final'}</Button>
                                        </div>
                                    ) 
                                    : (
                                        <div className="flex flex-row">
                                            <PriceSign />
                                            <p className="text-base font-medium">{Number(booking.total_amount).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                                
                        <div id="booking_payment_area">

                            {!!booking.is_final_total && (
                                <>
                                    {!booking.payment ? (
                                        booking.status !== 'past_due' && booking.status !== 'cancelled' && (
                                            <div className="border rounded-lg p-4 mt-4 bg-yellow-50 border-yellow-300">
                                                <p className="text-sm text-yellow-800">
                                                    {isAdmins || isDrivers || isStaffs ? "The user haven't completed the payment yet." : "You haven't completed the payment yet."}
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
                                                <option value="on_process">On Process</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="declined">Declined</option>
                                            </select>
                                        </div>
                                    ) : (
                                        booking.payment?.status && (
                                            <p className="flex flex-col text-md p-2 text-gray-600">
                                                Payment Status
                                                <strong className="capitalize text-primary">{booking.payment?.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</strong>
                                            </p>
                                        )
                                    )}
                                </>
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

            {(booking.user_id === auth.user.id || isAdmins) && (
                <>
                    {(!hasReview && booking.status )=== 'completed' ? (
                        <div className="mt-10 p-6 bg-white shadow rounded-2xl border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Share your experience
                            </h3>

                            <StarRating
                                onChange={(rating, comment) => {
                                    setRating(rating);
                                    setComment(comment);
                                }}
                            />

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Your feedback helps us improve future tours.
                                </p>
                                <Button
                                    type="button"
                                    className="btn-primary cursor-pointer"
                                    onClick={submitReview}
                                >
                                    Submit Review
                                </Button>
                            </div>

                            <InputError message={errorRating} className="mt-2" />
                        </div>
                    ) : (
                        <div className="mt-10 p-6 bg-white shadow rounded-2xl border">
                            <UserReview
                                userName={userReview?.user?.first_name ?? ''}
                                rating={userReview?.rating ?? 0}
                                comment={userReview?.comment}
                                isCompleted={booking.status == 'completed' ? true : false}
                            />
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {popupMessage && (
                    <FadePopup 
                        message={popupMessage} 
                        duration={popupDuration} 
                        onClose={() => setPopupMessage('')} 
                    />
                )}
            </AnimatePresence>

        </div>
        
    </form>
  )
}
