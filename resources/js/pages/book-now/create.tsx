import FormLayout from "@/layouts/form-layout";
import { OtherService, PackageCategory, PreferredVan, SharedData, TourPackage } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import InputError from "@/components/input-error";
import { Select } from "@headlessui/react";
import VanSelection from "@/components/van-selection";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import OtherServiceSelection from "@/components/other-service-selection";
import PriceSign from "@/components/price-sign";
import { format } from "date-fns";

type BookNowCreateProps = {
    packages: TourPackage;
    categories: PackageCategory[];
    selectedCategoryId: number;
    preferredVans: PreferredVan[];
    otherServices: OtherService[];
}

export default function Create({ 
    packages, 
    categories, 
    selectedCategoryId, 
    preferredVans,
    otherServices,
}: BookNowCreateProps) {
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
        pax_kids: number;
        pax_adult: number;
        notes: string;
        preferred_van_id: number | null;
        other_services: number[],
    }>({
        package_title: packages.title,
        tour_package_id: packages.id,
        package_category_id: selectedCategoryId ?? null,
        first_name: '',
        last_name: '',
        departure_date: '',
        return_date: '',
        contact_number: '',
        email: '',
        pax_kids: 0,
        pax_adult: 1,
        notes: '',
        preferred_van_id: null,
        other_services: [],
    });

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

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
    const [selectedOtherServiceIds, setSelectedOtherServiceIds] = useState<number[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>();
    const [reminderSignUp, setReminderSignUp] = useState(false);

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // if(!data.preferred_van_id) {
        //     setPreferredVanError("Please choose a van")
        //     return;
        // }

        post('/book-now/booked', {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error("Booking error:", errors);
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
        let total = packages.base_price;

        const selectedCategory = categories.find(cat => cat.id === data.package_category_id);

        if(selectedCategory?.use_custom_price && selectedCategory.custom_price) {
            total += Number(selectedCategory.custom_price);
        }

        const selectedVan = preferredVans.find(v => v.id === data.preferred_van_id);

        if(selectedVan) {
            total += Number(selectedVan.additional_fee) ?? 0;
        }

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
        otherServices
    ]);
    
    return (
        <FormLayout>
            <Head title="Book Now" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* Hero Image Header */}
                {packages.image_banner && (
                    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl mb-6">
                        <img
                            src={packages.image_banner}
                            alt="Tour Package Banner"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4">
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

                <div className="grid gap-4">
                    <Label htmlFor="package_title">Selected Package</Label>
                    <p id="package_title" className="p-2 border rounded bg-gray-100">
                        {packages.title}
                    </p>
                </div>

                <div className="grid gap-4">
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
                </div>

                {/* Form Inputs */}
                <div className="grid grid-cols-1 gap-6">
                    {/* First Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First Name</Label>
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
                        <Label htmlFor="last_name">Last Name</Label>
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
                        <Label htmlFor="contact_number">Contact No.</Label>
                        <Input
                            id="contact_number"
                            type="number"
                            required
                            value={data.contact_number}
                            disabled={processing}
                            placeholder="Ex. +639123456789"
                            onChange={(e) => setData('contact_number', e.target.value)}
                        />
                        <InputError message={errors.contact_number} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email_address">Email Address</Label>
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

                {/* Additional Notes */}
                <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                        id="notes"
                        rows={4}
                        placeholder="Any special requests or notes..."
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
                        selectedVanIds={selectedVanIds}
                        onSelect={toggleVanSelection}
                        textLabel="Select your preferred van"
                        required={true}
                    />
                    <InputError message={errors.preferred_van_id} className="mt-2" />
                </div>

                {/* Pax (Adults and Kids) */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="pax_adult">No. of Pax (Adults)</Label>
                        <Input
                            id="pax_adult"
                            type="number"
                            required
                            value={selectedVanIds.length == 0 ? 0 : data.pax_adult}
                            disabled={processing || selectedVanIds.length == 0}
                            placeholder="0"
                            max={selectedVan?.pax_adult}
                            min={0}
                            onChange={(e) => setData('pax_adult', Number(e.target.value))}
                        />
                        <InputError message={errors.pax_adult} className="mt-2" />
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="pax_kids">No. of Pax (Kids)</Label>
                        <Input
                            id="pax_kids"
                            type="number"
                            required
                            value={selectedVanIds.length == 0 ? 0 : data.pax_kids}
                            disabled={processing || selectedVanIds.length == 0}
                            placeholder="0"
                            max={selectedVan?.pax_kids}
                            min={0}
                            onChange={(e) => setData('pax_kids', Number(e.target.value))}
                        />
                        <InputError message={errors.pax_kids} className="mt-2" />
                    </div>
                </div>

                {/* Departure and Return Dates */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Departure Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="departure_date">Departure Date</Label>
                        <DatePicker
                            disabled={selectedVanIds.length === 0}
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

                    {/* Return Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="return_date">Return Date</Label>
                        <DatePicker
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
                        />
                        <InputError message={errors.return_date} className="mt-2" />
                    </div>
                </div>

                {/* Other Services */}
                <div className="grid gap-2">
                    <OtherServiceSelection
                        otherServices={sortedOtherServices}
                        selectedOtherServiceIds={selectedOtherServiceIds}
                        onSelect={toggleServiceSelection}
                        textLabel="You can choose other services:"
                    />
                </div>

                <div className="flex justify-end">
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total Amount</p>
                        <div className="flex flex-row items-center font-semibold text-primary text-2xl">
                            <PriceSign />
                            <p>{totalAmount}</p>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="mt-2 w-full btn-primary -md cursor-pointer" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    SUBMIT
                </Button>
            </form>
        </FormLayout>
    );
}
