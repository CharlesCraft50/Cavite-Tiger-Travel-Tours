import FormLayout from "@/layouts/form-layout";
import { OtherService, PackageCategory, PreferredPreparation, PreferredVan, SharedData, TourPackage, User, VanCategory } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import React, { FormEventHandler, useEffect, useState } from "react";
import InputError from "@/components/input-error";
import VanSelection from "@/components/van-selection";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import PriceSign from "@/components/price-sign";
import { format, addDays } from "date-fns";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Select } from "@headlessui/react";
import ModalLarge from "@/components/ui/modal-large";
import TermsAndConditions from "../dashboard/about/terms-and-conditions";
import PrivacyPolicy from "../dashboard/about/privacy-policy";
import CancellationPolicy from "../dashboard/about/cancellation-policy";
import StyledFileUpload from "@/components/styled-file-upload";
import { error } from "console";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import NoteMessage from "@/components/ui/note-message";

type BookNowCreateProps = {
    packages: TourPackage;
    drivers: User[];
    categories: PackageCategory[];
    selectedCategoryId: number;
    preferredVans: PreferredVan[];
    otherServices: OtherService[];
    vanCategories: VanCategory[];
    preferredPreparations: PreferredPreparation[];
}

export default function Create({ 
    packages,
    drivers,
    categories, 
    selectedCategoryId, 
    preferredVans,
    otherServices,
    vanCategories,
    preferredPreparations,
}: BookNowCreateProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm<{
        package_title: string;
        tour_package_id: number;
        package_category_id: number | null;
        first_name: string;
        last_name: string;
        departure_date: string;
        return_date: string;
        contact_number: string;
        email: string;
        pax_kids: string | number;
        pax_adult: string | number;
        notes: string;
        pickup_address: string;
        preferred_van_id: number | null;
        other_services: number[];
        driver_id: number | null;
        preferred_preparation_id: number;
        valid_id: File[] | null;
    }>({
        package_title: packages.title,
        tour_package_id: packages.id,
        package_category_id: selectedCategoryId ?? null,
        first_name: user.first_name,
        last_name: user.last_name,
        departure_date: '',
        return_date: '',
        contact_number: user.contact_number 
            ? (user.contact_number.startsWith('+') 
                ? user.contact_number 
                : `+${user.contact_number}`)
            : '',
        email: user.email,
        pax_kids: '',
        pax_adult: '1',
        notes: '',
        pickup_address: user.address,
        preferred_van_id: null,
        other_services: [],
        driver_id: null,
        preferred_preparation_id: 0,
        valid_id: [],
    });

    const [imagePreview, setImagePreview] = useState<string[]>([]);

    useEffect(() => {
        const url = new URL(window.location.href);
        const segments = url.pathname.split('/').filter(Boolean);

        const categoryIndex = segments.indexOf('category');
            if (categoryIndex !== -1 && segments.length > categoryIndex + 1) {
                const slugFromUrl = segments[categoryIndex + 1];

                const matchedCategory = categories.find(cat => cat.slug === slugFromUrl);
                if (matchedCategory) {
                    setData('package_category_id', matchedCategory.id);
                }
            }
    }, [categories, setData]);

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

    const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
    const [selectedOtherServiceIds, setSelectedOtherServiceIds] = useState<number[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>();
    const [reminderSignUp, setReminderSignUp] = useState(false);
    const [contactNumberError, setContactNumberError] = useState('');
    const [bookedVanIdsToday, setBookedVanIdsToday] = useState<number[]>([]);
    useEffect(() => {
        const todayStr = format(new Date(), "yyyy-MM-dd");

        async function checkAllVans() {
            const results: number[] = [];

            await Promise.all(
            preferredVans.map(async (van) => {
                try {
                const res = await fetch(`/api/van/${van.id}/availability`);
                const data = await res.json();

                // normalize the booked dates
                const bookedDates = (data.fully_booked_dates || []).map(
                    (d: string) => format(new Date(d), "yyyy-MM-dd")
                );

                if (bookedDates.includes(todayStr)) {
                    results.push(van.id);
                }
                } catch (err) {
                console.error(`Error checking van ${van.id}:`, err);
                }
            })
            );

            setBookedVanIdsToday(results);
        }

        checkAllVans();
        }, [preferredVans]);


    useEffect(() => {
        if (!user) {
            const alreadyReminded = sessionStorage.getItem('signUpReminderShown');
            if (!alreadyReminded) {
            setReminderSignUp(true);
            sessionStorage.setItem('signUpReminderShown', 'true');
            }
        }
    }, [user]);

    const toggleVanSelection = (vanId: number) => {
        if(selectedVanIds.includes(vanId)) {
            setSelectedVanIds([]);
            setData('preferred_van_id', null);
            setAvailableDates(null);
            setData('driver_id', null);
        } else {
            setSelectedVanIds([vanId]);
            setData('preferred_van_id', vanId);
        }
        
        setData('pax_adult', '1'); // always start at 1
        setData('pax_kids', '0');  // kids default 0
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

    const [formError, setFormError] = useState('');
    
    const [currentCountryCode, setCurrentCountryCode] = useState('');


    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        setFormError('');

        // if(!data.preferred_van_id) {
        //     setPreferredVanError("Please choose a van")
        //     return;
        // }

        if (currentCountryCode == null) {
            setContactNumberError('Please choose your country code.');
            setFormError('Please check the required fields.');
            return;
        }

         const normalized = data.contact_number.startsWith('+')
            ? data.contact_number
            : `+${data.contact_number}`;

        if (currentCountryCode === 'PH') {
            const digits = normalized.replace(/\D/g, '');
            if (digits.length !== 12 && digits.length !== 13) {
            setContactNumberError('Contact Number must be exactly 11 digits after +63.');
            setFormError('Please check the required fields.');
            return;
            }
        }

        setData('contact_number', normalized);

        post('/book-now/booked', {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error("Booking error:", errors);
                setFormError('Please check the required fields.');
            }
        });
    }

    useEffect(() => {
        document.body.style.overflow = 'auto';
    }, []);

    const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const selectedId = val === '' ? null : Number(val);
        setData('package_category_id', selectedId);

        const baseSlug = packages.slug;
        const categorySlug = val === ''
            ? ''
            : categories.find(cat => cat.id === selectedId)?.slug ?? '';

        let newUrl = `/book-now/${baseSlug}`;
        if (categorySlug) {
            newUrl += `/category/${categorySlug}`;
        }
        
        window.history.replaceState({}, '', newUrl);
    };

    const selectedVan = preferredVans.find(v => v.id === data.preferred_van_id);

    const sortedOtherServices = [...otherServices].sort((a, b) => {
        const aRecommended = a.pivot?.is_recommended ? 1 : 0;
        const bRecommended = b.pivot?.is_recommended ? 1 : 0;
        return bRecommended - aRecommended;
    });

    useEffect(() => {
        const adults = Number(data.pax_adult) || 1; // default to 1
        const kids = Number(data.pax_kids) || 0;

        let total = 0;

        // Package price (per person)
        const people = adults + kids;
        total += people * packages.base_price;

        // Custom category price
        const selectedCategory = categories.find(cat => cat.id === data.package_category_id);
        if(selectedCategory?.use_custom_price && selectedCategory.custom_price) {
            total += Number(selectedCategory.custom_price);
        }

        // Van additional fee
        const selectedVan = preferredVans.find(v => v.id === data.preferred_van_id);
        if(selectedVan) {
            total += Number(selectedVan.additional_fee) ?? 0;
        }

        // Other services
        for (const serviceId of selectedOtherServiceIds) {
            const service = otherServices.find(s => s.id === serviceId);
            if (service) {
                const price = service.pivot?.package_specific_price && service.pivot?.package_specific_price > 0 ? service.pivot?.package_specific_price : service.price;
                total += Number(price);
            }
        }

        setTotalAmount(total);
    }, [
        data.package_category_id,
        data.preferred_van_id,
        selectedOtherServiceIds,
        packages.base_price,
        categories,
        preferredVans,
        otherServices,
        data.pax_adult,
        data.pax_kids,
    ]);

    useEffect(() => {
        if (selectedVan) {
            setData('driver_id', selectedVan.user_id ? selectedVan.user_id : null);
        }
    }, [selectedVan]);
    
    const handleReturnDate = (): string => {
        const durationDays = parseInt(packages.duration?.split(' ')[0] || "1", 10);

        if (!data.departure_date) return "";

        const departure = new Date(data.departure_date);
        const returnDate = addDays(departure, durationDays - 1);

        return format(returnDate, "yyyy-MM-dd");
    }

    function formatPHNumber(number: string) {
        // remove non-digits except +
        let digits = number.replace(/[^\d+]/g, '');

        if (!digits.startsWith('+63')) return number;

        // remove +63 temporarily
        let local = digits.slice(3);

        // format as 3-3-4 digits
        if (local.length === 10) {
            return `+63 ${local.slice(0,3)} ${local.slice(3,6)} ${local.slice(6)}`;
        }

        return number; // fallback
    }

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

    const [ requiresValidId, setRequiresValidId ] = useState(false);

    const bannerImages: string[] = Array.isArray(packages.image_banner)
        ? packages.image_banner
        : typeof packages.image_banner === 'string'
        ? JSON.parse(packages.image_banner)
        : [];
    
    return (
        <FormLayout removeNavItems hasBackButton backButtonHref={`/packages/${packages.slug}`}>
            <Head title="Book Now" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* Hero Image Header */}
                {packages.image_banner && (
                    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl mb-6">
                         {bannerImages.length > 0 ? (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                pagination={{ clickable: true }}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                loop={bannerImages.length > 1}
                                className="w-full h-full"
                            >
                                {bannerImages.map((imgSrc, idx) => (
                                <SwiperSlide key={idx}>
                                    <img
                                    src={imgSrc}
                                    alt={`Banner ${idx + 1}`}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                                <img
                                    src="https://via.placeholder.com/300x300?text=No+Image"
                                    alt="Placeholder"
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                        )}

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 z-1 pointer-events-none">
                            <div className="bg-white/80 backdrop-blur-md p-6 rounded-lg text-center max-w-2xl">
                                <h1 className="text-2xl md:text-4xl font-bold mb-2 text-gray-900">
                                    Book Now - {packages.title}
                                </h1>
                                {packages.overview && (
                                    <p className="text-gray-700 text-sm md:text-base">{packages.overview}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <NoteMessage
                        type="important"
                        message="Preferred van for drop-off/pick-up at the airport has different costs, and it's optional if you have your own vehicle for transportation."
                    />
                </div>

                <div className="grid gap-4">
                    <p className="font-semibold">Required Fields <span className="text-red-500">*</span></p>
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="package_title">Selected Package</Label>
                    <p id="package_title" className="p-2 border rounded bg-gray-100">
                        {packages.title}
                    </p>
                </div>

                <div className="grid gap-4">
                    <Label htmlFor="preferred_preparation_id" required>Selected Preferred Preparation</Label>
                    <select
                        id="preferred_preparation_id"
                        className="border p-2 rounded cursor-pointer"
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const selectedPrep = preferredPreparations.find(p => p.id === selectedId);

                            setData('preferred_preparation_id', selectedId);
                            setRequiresValidId(selectedPrep?.requires_valid_id || false);
                            setImagePreview([]);
                            setData('valid_id', null);
                        }}
                    >
                        <option value="">Select Preparation</option>
                        {preferredPreparations?.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.preferred_preparation_id} className="mt-2" />

                    {requiresValidId && (
                        <StyledFileUpload
                            id="valid_id"
                            label="Upload valid IDs"
                            required
                            accept="image/*"
                            multiple
                            value={data.valid_id}
                            error={errors.valid_id}
                            description="Upload clear photos for your valid IDs."
                            supportedFormats="JPG, PNG"
                            maxSize="10MB"
                            onChange={(fileOrFiles: File | File[] | null) => {
                                const files = Array.isArray(fileOrFiles)
                                    ? fileOrFiles
                                    : fileOrFiles
                                    ? [fileOrFiles]
                                    : [];

                                setData('valid_id', files);

                                if (files.length > 0) {
                                    const urls = files.map(file => URL.createObjectURL(file));
                                    setImagePreview(urls);
                                } else {
                                    setImagePreview([]);
                                }
                            }}
                        />
                    )}

                    {data.preferred_preparation_id != 0 && (
                        <div className="mt-4">
                            <NoteMessage
                                type="note"
                                message={data.preferred_preparation_id == 1 ? "The cost of the selected tour package is included, while flight tickets are not." : data.preferred_preparation_id == 2 ? "The cost of the selected tour package and flight tickets are included." : ""}
                                leading={data.preferred_preparation_id == 1 ? "Land Arrangement/Preparation" : data.preferred_preparation_id == 2 ? "All-in Arrangement/Preparation" : ""}
                            />
                        </div>
                    )}

                </div>

                {/* <div className="grid gap-4">
                    <Label htmlFor="package_category_id">Select Package Option</Label>
                    <Select
                        id="package_category_id"
                        value={data.package_category_id ?? ''}
                        className="border p-2 rounded cursor-pointer"
                        onChange={handleCategorySelect}                 
                    >
                        <option value="">No option selected</option>
                        {
                            categories.map((category) => (
                                <option key={category.id} value={category.id} data-slug={category.slug}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </Select>
                </div> */}

                {/* Form Inputs */}
                <div className="grid grid-cols-1 gap-6">
                    {/* First Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="first_name" required>First Name</Label>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            autoFocus
                            value={data.first_name}
                            disabled={processing}
                            placeholder="First Name"
                            onChange={(e) => setData('first_name', e.target.value)}
                        />
                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    {/* Last Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="last_name" required>Last Name</Label>
                        <Input
                            id="last_name"
                            type="text"
                            required
                            value={data.last_name}
                            disabled={processing}
                            placeholder="Last Name"
                            onChange={(e) => setData('last_name', e.target.value)}
                        />
                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                

                {/* Other Fields */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="contact_number" required>Contact No.</Label>
                        <PhoneInput
                            country={'ph'}
                            value={data.contact_number}
                            disabled={processing}
                            placeholder="Ex. +63 9954 6821992"
                            onChange={(fullValue: string, data: any) => {
                                setData('contact_number', fullValue);
                                setCurrentCountryCode(data.countryCode?.toUpperCase() || 'PH');
                                setContactNumberError('');
                            }}
                            isValid={(value, country) => {
                                const digits = value.replace(/\D/g, '');
                                return digits.length >= 10;
                            }}
                            countryCodeEditable={false}
                            enableSearch={true}
                        />
                        <InputError message={contactNumberError} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email_address" required>Email Address</Label>
                        <Input
                            id="email_address"
                            type="email"
                            required
                            value={data.email}
                            disabled={processing}
                            placeholder="Ex. juan@gmail.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                </div>
                
                {/* Pickup Address */}
                <div className="grid gap-2">
                    <Label htmlFor="pickup_address" required>Pickup Address</Label>
                    <Input
                        type="text"
                        required
                        value={data.pickup_address}
                        disabled={processing}
                        placeholder="Pickup Address"
                        onChange={(e) => setData('pickup_address', e.target.value)}
                    />
                    <InputError message={errors.pickup_address} className="mt-2" />
                </div>

                {/* Additional Notes */}
                <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                        id="notes"
                        rows={4}
                        placeholder=" Any special request, notes, or landmarks..."
                        value={data.notes}
                        disabled={processing}
                        onChange={(e) => setData("notes", e.target.value)}
                        className="border border-gray-300 rounded-md p-2 resize-none"
                    />
                    <InputError message={errors.notes} className="mt-2" />
                </div>

                {/* Preferred Vans */}
                <div className="grid gap-2">
                    <VanSelection
                        preferredVans={preferredVans}
                        drivers={drivers ?? []}
                        selectedVanIds={selectedVanIds}
                        onSelect={toggleVanSelection}
                        textLabel="Select your preferred van (Optional)"
                        vanCategories={vanCategories}
                        bookedVanIdsToday={bookedVanIdsToday}
                    />
                    <InputError message={errors.preferred_van_id} className="mt-2" />
                </div>

                {/* Pax (Adults and Kids) */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="pax_adult">No. of Pax</Label>
                        <Input
                            id="pax_adult"
                            type="number"
                            required
                            value={data.pax_adult}
                            disabled={processing}
                            placeholder="1"
                            max={selectedVan?.pax_adult ?? 20}
                            min={1}
                            onChange={(e) => {
                                const value = e.target.value;
                                // If cleared, always reset to 1
                                setData('pax_adult', value === '' ? '1' : value);
                            }}
                            />
                        <InputError message={errors.pax_adult} className="mt-2" />
                    </div>
                    
                    {/* <div className="grid gap-2">
                        <Label htmlFor="pax_kids">No. of Pax (Kids)</Label>
                        <Input
                            id="pax_kids"
                            type="number"
                            value={selectedVanIds.length == 0 ? 0 : data.pax_kids}
                            disabled={processing || selectedVanIds.length == 0}
                            placeholder="0"
                            max={selectedVan?.pax_kids}
                            min={0}
                            onChange={(e) => setData('pax_kids', e.target.value)}
                        />
                        <InputError message={errors.pax_kids} className="mt-2" />
                    </div> */}
                </div>

                {packages.duration != null && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label>Duration</Label>
                            <p className="font-semibold">( {packages.duration} )</p>
                        </div>
                    </div>
                )}

                {/* Departure and Return Dates */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Departure Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="departure_date">Departure Date</Label>
                        <DatePicker
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

                    {/* Return Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="return_date">Return Date</Label>
                        {/* <DatePicker
                            disabled={selectedVanIds.length === 0}
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
                        /> */}
                        <div className="w-full border-b border-b-red-500">
                            <p>{handleReturnDate()}</p>
                        </div>
                        <InputError message={errors.return_date} className="mt-2" />
                    </div>
                </div>

                {/* Other Services */}
                {/* <div className="grid gap-2">
                    <OtherServiceSelection
                        otherServices={sortedOtherServices}
                        selectedOtherServiceIds={selectedOtherServiceIds}
                        onSelect={toggleServiceSelection}
                        textLabel="You can choose other services:"
                    />
                </div> */}

                <div className="flex justify-end">
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total Amount</p>
                        <div className="flex flex-row items-center font-semibold text-primary text-2xl">
                            <PriceSign />
                            <p>{totalAmount}</p>
                        </div>
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

                <Button type="submit" className="mt-2 w-full btn-primary -md cursor-pointer" tabIndex={5} disabled={!(allChecked) || processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    SUBMIT
                </Button>

                {formError && (
                    <div className="bg-red-100 text-red-800 p-3 rounded mb-4 text-center">
                        {formError}
                    </div>
                )}
            </form>
        
            <ModalLarge activeModal={activeModal} setActiveModal={setActiveModal}>
                {agreementIndex == 0 && <TermsAndConditions disableNav />}
                {agreementIndex == 1 && <PrivacyPolicy disableNav />}
                {agreementIndex == 2 && <CancellationPolicy disableNav />}
            </ModalLarge>
        </FormLayout>
    );
}
