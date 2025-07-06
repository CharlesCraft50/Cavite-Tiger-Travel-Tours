import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import FormLayout from "@/layouts/form-layout";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City, PackageCategory, TourPackage, PreferredVan } from "@/types";
import { Head } from '@inertiajs/react';
import PackageContentEditor from "@/components/package-content-editor";
import 'react-datepicker/dist/react-datepicker.css';
import DateRangePicker from "@/components/ui/data-range-picker";
import InputSuggestions from "@/components/ui/input-suggestions";
import AddCategories from "@/components/add-categories";
import OverviewContent, { stripHtmlTags } from "@/components/overview-content";
import { OVERVIEW_COUNT } from "@/config/constants";
import VanSelection from "@/components/van-selection";

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
};

type PackagesCreateProps = {
    cities: City[],
    editMode?: boolean;
    packages?: TourPackage,
    packageCategories?: PackageCategory[];
    preferredVans: PreferredVan[];
    vanIds: number[];
};

export default function Index({
     cities,
     editMode,
     packages,
     packageCategories,
     preferredVans,
     vanIds,
    }: PackagesCreateProps ) {

    const [contentError, setContentError] = useState('');
      
    const [ automaticShortDescription, setAutomaticShortDescription ] = useState(false);
    
    const { data, 
        setData, 
        //post,
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
        available_until: null

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

    useEffect(() => {
        if(editMode && packages) {
            setData('title', packages.title);
            setData('subtitle', packages.subtitle || '');
            setData('overview', packages.overview || '');
            setData('content', packages.content || '');
            setData('city_id', packages.city_id);
            setData('duration', packages.duration || '');
            setData('location', packages.location);
            
            if(packages.available_from || packages.available_until) {
                setActiveExpiry(true);
                setData('available_from', packages.available_from ? new Date(packages.available_from) : null);
                setData('available_until', packages.available_until ? new Date(packages.available_until) : null);
            }

            setExistingImageOverview(packages.image_overview || '');
            setExistingImageBanner(packages.image_banner || '');
            setCategories(packageCategories ?? []);

            setSelectedVanIds(vanIds);
        }
    }, [editMode, packages]);

    const addCategory = (newCategory: Omit<PackageCategory, 'id' | 'has_button' | 'button_text' | 'created_at' | 'updated_at'>) => {
        setCategories(prev => {
            const newId = prev.length > 0 ? Math.max(...prev.map(c => c.id)) + 1 : 1;
            
            return [...prev, {
                ...newCategory,
                id: newId,
                has_button: 0,
                button_text: 'Book',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
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
                formData.append(key, value instanceof Date ? value.toISOString() : value.toString());
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

        if(editMode) {

            formData.append("_method", "PUT");
            
            router.post(`/packages/${packages?.id}`, formData, {
                forceFormData: true,
                // onSuccess: () => {
                    
                // }
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
                    <select
                        id="cities"
                        name="cities"
                        value={data.city_id}
                        onChange={(e) => {
                            const selectedCityId = Number(e.target.value);
                            const selectedCity = cities.find(city => city.id === selectedCityId);
                            setData('city_id', Number(selectedCityId));
                            setData('location', selectedCity?.name ?? '');
                        }}
                        disabled={processing}
                        className="border rounded p-2 dark:bg-gray-950 text-black dark:text-white"
                        required
                    >
                        <option value="">Choose a City</option>
                        {cities.map((city: City) => (
                            <option value={city.id} key={city.id} data-name={city.name}>{city.name}</option>
                        ))

                        }
                    </select>
                </div>

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

                <hr />

                <div className="grid gap-2 mb-12">
                    <VanSelection
                        parentId={packages?.id}
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

                <div className="grid gap-2">
                    <AddCategories 
                        categories={categories} 
                        onAddCategory={addCategory} 
                        onRemoveCategory={removeCategory} 
                        onUpdateCategory={updateCategory}
                        editable
                    />
                </div>

                <InputError message={categoriesContentError} className="mt-2" />

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