import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { LoaderCircle, X } from 'lucide-react';
import FormLayout from "@/layouts/form-layout";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City, PackageCategory, TourPackage, PreferredVan, OtherService } from "@/types";
import { Head } from '@inertiajs/react';
import PackageContentEditor from "@/components/package-content-editor";
import 'react-datepicker/dist/react-datepicker.css';
import DateRangePicker from "@/components/ui/data-range-picker";
import InputSuggestions from "@/components/ui/input-suggestions";
import AddCategories from "@/components/add-categories";
import OverviewContent, { stripHtmlTags } from "@/components/overview-content";
import { OVERVIEW_COUNT } from "@/config/constants";
import VanSelection from "@/components/van-selection";
import OtherServiceSelection, { EditableOtherService } from "@/components/other-service-selection";
import PriceSign from "@/components/price-sign";
import { format } from "date-fns";
import CityList from "@/components/city-list";
import CardImageBackground from "@/components/ui/card-image-bg";

export type PackageForm = {
    title: string;
    subtitle: string;
    overview: string;
    location: string;
    city_id: number;
    content: string;
    duration: string;
    image_overview: string;
    image_banner: string;
    available_from: Date | null;
    available_until: Date | null;
    base_price: number;
};

type PackagesCreateProps = {
    cities: City[],
    editMode?: boolean;
    packages?: TourPackage,
    packageCategories?: PackageCategory[];
    preferredVans: PreferredVan[];
    otherServices: OtherService[];
    vanIds: number[];
    serviceIds: number[];
};

export default function Index({
     cities,
     editMode,
     packages,
     packageCategories,
     preferredVans,
     otherServices,
     vanIds,
     serviceIds,
    }: PackagesCreateProps ) {

    const [contentError, setContentError] = useState('');
      
    const [ automaticShortDescription, setAutomaticShortDescription ] = useState(false);
    
    const { data, 
        setData,
        processing, 
        errors 
    } = useForm<PackageForm>({
        title: '',
        subtitle: '',
        overview: '',
        location: '',
        city_id: 0,
        content: '',
        duration: '',
        image_overview: '',
        image_banner: '',
        available_from: null,
        available_until: null,
        base_price: 0,

    });
    
    const [activeExpiry, setActiveExpiry] = useState<boolean>(false);
    const [imageOverview, setImageOverview] = useState<File | null>(null);
    const [imageBanner, setImageBanner] = useState<File | null>(null);
    const [categories, setCategories] = useState<PackageCategory[]>([]);
    const [categoriesContentError, setCategoriesContentError] = useState('');
    const [existingImageOverview, setExistingImageOverview] = useState<string>('');
    const [existingImageBanner, setExistingImageBanner] = useState<string>('');
    const [selectedVanIds, setSelectedVanIds] = useState<number[]>([]);
    const [vanList, setVanList] = useState<PreferredVan[]>(preferredVans);
    const [otherServiceList, setOtherServiceList] = useState<EditableOtherService[]>(otherServices);
    const [selectedOtherServiceIds, setSelectedOtherServiceIds] = useState<number[]>([]);
    const [showNewCityInput, setShowNewCityInput] = useState(false);
    const [newCityName, setNewCityName] = useState('');
    const [activeCity, setActiveCity] = useState('');

    const selectedCityId = (e: string) => {
      setActiveCity(e);
    }

    const displayedCities = activeCity.trim() === '' || activeCity === '__new'
      ? []
      : cities.filter(c => c.id === Number(activeCity));

    const addPreferredVans = (vans: PreferredVan[]) => {
        setVanList(vans);
    }

    const toggleVanSelection = (vanId: number) => {
        setSelectedVanIds((prev) => {
            if (prev.includes(vanId)) {
                return prev.filter((id) => id !== vanId);
            } else {
                return [...prev, vanId];
            }
        });
    };

    const addOtherServices = (otherServices: EditableOtherService[]) => {
        setOtherServiceList(otherServices);
    }

    const toggleOtherServiceSelection = (otherServiceId: number) => {
        setSelectedOtherServiceIds((prev) => {
            if (prev.includes(otherServiceId)) {
                setOtherServiceList((prevList) =>
                    prevList.map((service) =>
                        service.id === otherServiceId
                            ? {
                                ...service,
                                package_specific_price: undefined,
                                is_recommended: false,
                                sort_order: undefined,
                            }
                            : service
                    )
                );

                return prev.filter((id) => id !== otherServiceId);
            } else {
                return [...prev, otherServiceId];
            }
        });
    };

    useEffect(() => {
        if(editMode && packages) {
            setData('title', packages.title);
            setData('subtitle', packages.subtitle || '');
            setData('overview', packages.overview || '');
            setData('content', packages.content || '');
            setData('city_id', packages.city_id);
            setData('duration', packages.duration || '');
            setData('location', packages.location);
            setData('base_price', packages.base_price);
            
            if(packages.available_from || packages.available_until) {
                setActiveExpiry(true);
                setData('available_from', packages.available_from ? new Date(packages.available_from) : null);
                setData('available_until', packages.available_until ? new Date(packages.available_until) : null);
            }

            setExistingImageOverview(packages.image_overview || '');
            setExistingImageBanner(packages.image_banner || '');
            setCategories(packageCategories ?? []);

            setSelectedVanIds(vanIds);
            setSelectedOtherServiceIds(serviceIds);
        }
    }, [editMode, packages]);

    const addCategory = (newCategory: Omit<PackageCategory, 'id' | 'has_button' | 'use_custom_price' | 'custom_price' | 'button_text' | 'created_at' | 'updated_at'>) => {
        setCategories(prev => {
            const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
            
            return [...prev, {
                ...newCategory,
                id: newId,
                has_button: 0,
                use_custom_price: false,
                custom_price: 0,
                button_text: `Select Category ${newId}`,
                created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
                updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            }];
        });
    }

    const removeCategory = (id: number) => {
        setCategories(prev => prev.filter(cateegory => cateegory.id !== id));
    }

    const updateCategory = (id: number, data: string, value: string | number | boolean) => {
        setCategories(prev => 
            prev.map(category => category.id == id
                ? {...category, [data]: value}
                : category
            )

        );
    }

    function formatDateForForm(value: Date | string): string {
        if (value instanceof Date) {
            return format(value, "yyyy-MM-dd");
        }
        return value;
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if(!data.content.trim()) {
            setContentError('Content is required.');
            return;
        }

        for (let i = 0; i < categories.length; i++) {
            if (!categories[i].content || !categories[i].content.trim()) {
                setCategoriesContentError(`Content is required in category "${categories[i].name}"`);
                return;
            }
        }

        const trimmedNames = new Set<string>();

        for (let i = 0; i < categories.length; i++) {
            const trimmedName = categories[i].name.trim();

            if (!trimmedName) {
                setCategoriesContentError(`Category name at position ${i + 1} is empty.`);
                return;
            }

            if (trimmedNames.has(trimmedName.toLowerCase())) {
                setCategoriesContentError(`Duplicate category name "${trimmedName}" is not allowed.`);
                return;
            }

            trimmedNames.add(trimmedName.toLowerCase());
            categories[i].name = trimmedName; // sanitize
        }

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if(value != null) {
                formData.append(key, value instanceof Date ? formatDateForForm(value) : value.toString());
            }
        });

        if(imageOverview) {
            formData.append('image_overview', imageOverview);
        }

        if(imageBanner) {
            formData.append('image_banner', imageBanner);
        }

        setContentError('');

        if(categories.length > 0) {
            categories.forEach((category, index) => {
                Object.entries(category).forEach(([key, value]) => {
                    if (['id', 'created_at', 'updated_at'].includes(key)) return;
                    formData.append(`categories[${index}][${key}]`, value?.toString() ?? '');
                });
            });
        }

        if(selectedVanIds.length > 0) {
            selectedVanIds.forEach((id, index) => {
                formData.append(`preferred_van_ids[${index}]`, id.toString());
            });
        }

        if (selectedOtherServiceIds.length > 0) {
            selectedOtherServiceIds.forEach((id, index) => {
                const service = otherServiceList.find(s => s.id === id);
                if (service) {
                    formData.append(`other_services[${index}][id]`, service.id.toString());
                    formData.append(`other_services[${index}][package_specific_price]`, service.package_specific_price?.toString() ?? '0');
                    formData.append(`other_services[${index}][is_recommended]`, service.is_recommended ? '1' : '0');
                    formData.append(`other_services[${index}][sort_order]`, service.sort_order?.toString() ?? '0');
                }
            });
        }

        if(editMode) {

            formData.append("_method", "PUT");
            
            router.post(`/packages/${packages?.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.post('/packages', formData, {
                forceFormData: true,
                onSuccess: () => {
                    
                }
            });
        }

    }

    const handleDateRange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setData('available_from', start);
        setData('available_until', end);
    }

    const clearContent = () => {
        setData('content', " ");
    }

    const handleSelectAllVan = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedVanIds(vanList.map((van) => van.id) || []);
        } else {
            setSelectedVanIds([]);
        }
    }

    const handleSelectAllServices = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedOtherServiceIds(otherServiceList.map((service) => service.id) || []);
        } else {
            setSelectedOtherServiceIds([]);
        }
    }

    const handleAddCity = () => {

        router.post(route('cities.store'), {
            name: newCityName.toString(),
        }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setShowNewCityInput(false);
            },
        });
    }

    const handleDeletionCity = (cityId: number) => {
        if (!cityId) return;

        router.delete(route('cities.destroy', cityId), {
            preserveScroll: true,
            onSuccess: () => {
                // Optional: reset city selection or show a toast
                console.log('City deleted successfully');
            },
            onError: (errors) => {
                console.error('Failed to delete city', errors);
            }
        });
    };

    return (
        <FormLayout title="Create a Package" description="Enter the package details below to create a new package">
            <Head title="Create a Package" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="title" required>Title</Label>
                        <Input
                            id="title"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="title"
                            value={data.title}
                            disabled={processing}
                            placeholder="Title"
                            maxLength={70}
                            onChange={(e) => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                            id="subtitle"
                            type="text"
                            autoFocus
                            tabIndex={1}
                            autoComplete="subtitle"
                            value={data.subtitle}
                            disabled={processing}
                            placeholder="Subtitle"
                            maxLength={50}
                            onChange={(e) => setData('subtitle', e.target.value)}
                            />
                            <InputError message={errors.subtitle} className="mt-2" />
                    </div>
                </div>

                <div className="grid gap-2">
                    <OverviewContent 
                        data={data} 
                        setData={setData}
                        existingImageOverview={existingImageOverview}
                        setImageOverview={setImageOverview} 
                        automaticShortDescription={automaticShortDescription} 
                        setAutomaticShortDescription={setAutomaticShortDescription} 
                        editable 
                    />
                </div>

                <div className="grid gap-2">
                    <PackageContentEditor 
                        value={data.content} 
                        onChange={(value) => {
                            setData('content', value ?? '');
                            if(automaticShortDescription) {
                                const clean = stripHtmlTags(value);
                                const trimmed = clean.slice(0, OVERVIEW_COUNT);
                                setData('overview', trimmed);
                            }
                        }}
                        title={data.title}
                        imageBanner={data.image_banner}
                        existingImageBanner={existingImageBanner}
                        setImageBanner={(e) => setData('image_banner', e)}
                        setImageFile={setImageBanner}
                        onClearContent={clearContent}
                    />
                    { contentError && (<InputError message={contentError} className="mt-2" />) }
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="cities" required>City</Label>
                    <CityList 
                        cities={cities}
                        data={data}
                        setData={setData}
                        showNewCityInput={showNewCityInput}
                        setShowNewCityInput={setShowNewCityInput}
                        newCityName={newCityName}
                        setNewCityName={setNewCityName}
                        handleAddCity={handleAddCity}
                        processing={processing}
                        handleDeletionCity={handleDeletionCity}
                        selectedCityId={selectedCityId}
                    />

                    <div className="flex flex-wrap gap-4 p-4">
                        {displayedCities.map((city => (
                        <CardImageBackground
                            id={city.id}
                            inputId="image-overview-edit"
                            key={city.id}
                            title={city.name}
                            src={city.image_url}
                            editable={true}
                        />
                        )))}
                    </div>
                </div>

                {/* Duration */}
                <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    
                    <InputSuggestions
                        type="text"
                        list="durations"
                        name="duration"
                        placeholder="e.g. 3D2N"
                        value={data.duration}
                        onChange={(e) => setData('duration', e.target.value)}
                        >
                        <option value="2D1N" />
                        <option value="3D2N" />
                        <option value="4D3N" />
                        <option value="5D4N" />
                    </InputSuggestions>
                </div>

                <div className="grid gap-2">
                    <div className="gray-card">
                        <label>
                            <input
                                type="checkbox"
                                className="w-4 h-4 cursor-pointer"
                                onChange={(e) => {
                                    setActiveExpiry(e.target.checked);
                                    setData('available_from', null);
                                    setData('available_until', null);
                                }}
                                checked={activeExpiry}
                            />
                            <div>
                                <span className="text-sm font-medium text-gray-700">
                                    Add Expiry Date
                                </span>
                                <p className="text-xs text-gray-500">
                                    When enabled, post will be unavailable within certain date
                                </p>
                            </div>
                        </label>
                    </div>
                    {activeExpiry && (
                        <DateRangePicker
                            startDate={data.available_from} 
                            endDate={data.available_until}
                            onChange={handleDateRange}
                            disabled={!activeExpiry}
                        />
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="base_price" required>Base Price</Label>
                    <div className="flex flex-row items-center">
                        <PriceSign />
                        <Input
                            type="number"
                            id="base_price"
                            value={data.base_price}
                            onChange={(e) => setData('base_price', Number(e.target.value))}
                            className="w-full border rounded"
                        />
                    </div>
                </div>

                <hr />

                <div className="grid gap-2 mb-12">
                    <VanSelection
                        preferredVans={vanList}
                        selectedVanIds={selectedVanIds}
                        onSelect={toggleVanSelection}
                        onChange={handleSelectAllVan}
                        textLabel="Select vans users can book"
                        onSave={(newVans) => addPreferredVans(newVans)}
                        required={true}
                        editable
                    />
                </div>

                <hr />
                <div className="mt-16 border-t-4 border-dashed border-pink-600 pt-12">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                        More About This Package
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                        You can add detailed sections such as inclusions, itineraries, options, and more for <span className="font-medium">{data.title}</span>.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <AddCategories 
                            categories={categories} 
                            onAddCategory={addCategory} 
                            onRemoveCategory={removeCategory} 
                            onUpdateCategory={updateCategory}
                            packageTitle={data.title}
                            editable
                        />

                        <InputError message={categoriesContentError} className="mt-2" />
                    </div>
                </div>

                <hr />

                <div className="grid gap-2">
                    <OtherServiceSelection
                        otherServices={otherServiceList}
                        selectedOtherServiceIds={selectedOtherServiceIds}
                        onSelect={toggleOtherServiceSelection}
                        textLabel="Select services users can add"
                        onChange={handleSelectAllServices}
                        onSave={(newServices) => addOtherServices(newServices)}
                        editable
                    />
                </div>

                <Button type="submit" className="mt-2 w-full btn-primary cursor-pointer text-md" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    {editMode ? 'Update' : 'Create'}
                </Button>

                <div className="flex flex-row text-center justify-center">
                    <span className="text-red-500 ml-1">*</span>
                    <p className="text-sm ml-2">Required Fields</p>
                </div>
        </form>
        
        </FormLayout>
        
    );
}