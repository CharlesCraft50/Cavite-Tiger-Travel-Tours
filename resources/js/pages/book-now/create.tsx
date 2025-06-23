import FormLayout from "@/layouts/form-layout";
import { PackageCategory, TourPackage } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import InputError from "@/components/input-error";
import { Select } from "@headlessui/react";

type BookNowCreateProps = {
    packages: TourPackage;
    categories: PackageCategory[];
    selectedCategoryId: number;
    categorySlug: string;
}

export default function Create({ packages, categories, selectedCategoryId, categorySlug }: BookNowCreateProps) {
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
        travel_insurance: boolean;
        notes: string;
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
        travel_insurance: true,
        notes: '',
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


    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/book-now/booked', {
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
        setData('package_category_id', val === '' ? null : Number(val));

        const baseSlug = packages.slug; // package slug from props
        const categorySlug = val === ''
            ? ''
            : categories.find(cat => cat.id === Number(val))?.slug ?? '';

        let newUrl = `/book-now/${baseSlug}`;

        if (categorySlug) {
            newUrl += `/category/${categorySlug}`;
        }

        window.history.replaceState({}, '', newUrl);
    }

    console.log("Selected category: " + categorySlug);



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

                {/* Departure and Return Dates */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="departure_date">Departure Date</Label>
                        <Input
                            id="departure_date"
                            type="date"
                            required
                            value={data.departure_date}
                            disabled={processing}
                            onChange={(e) => setData('departure_date', e.target.value)}
                        />
                        <InputError message={errors.departure_date} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="return_date">Return Date</Label>
                        <Input
                            id="return_date"
                            type="date"
                            required
                            value={data.return_date}
                            disabled={processing}
                            onChange={(e) => setData('return_date', e.target.value)}
                        />
                        <InputError message={errors.return_date} className="mt-2" />
                    </div>
                </div>

                {/* Pax (Adults and Kids) */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="pax_kids">No. of Pax (Kids)</Label>
                        <Input
                            id="pax_kids"
                            type="number"
                            required
                            value={data.pax_kids}
                            disabled={processing}
                            placeholder="0"
                            onChange={(e) => setData('pax_kids', Number(e.target.value))}
                        />
                        <InputError message={errors.pax_kids} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="pax_adult">No. of Pax (Adults)</Label>
                        <Input
                            id="pax_adult"
                            type="number"
                            required
                            value={data.pax_adult}
                            disabled={processing}
                            placeholder="0"
                            onChange={(e) => setData('pax_adult', Number(e.target.value))}
                        />
                        <InputError message={errors.pax_adult} className="mt-2" />
                    </div>
                </div>

                {/* Travel Insurance */}
                <div className="grid gap-2">
                    <Label>Travel Insurance</Label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="travel_insurance"
                                value="yes"
                                checked={data.travel_insurance === true}
                                disabled={processing}
                                onChange={() => setData("travel_insurance", true)}
                            />
                            Yes
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="travel_insurance"
                                value="no"
                                checked={data.travel_insurance === false}
                                disabled={processing}
                                onChange={() => setData("travel_insurance", false)}
                            />
                            No
                        </label>
                    </div>
                    <InputError message={errors.travel_insurance} className="mt-2" />
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

                <Button type="submit" className="mt-2 w-full btn-primary text-md cursor-pointer" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    SUBMIT
                </Button>
            </form>
        </FormLayout>
    );
}
