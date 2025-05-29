import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { LoaderCircle } from 'lucide-react';
import FormLayout from "@/layouts/form-layout";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { City } from "@/types";
import { Head } from '@inertiajs/react';
import { Textarea } from "@headlessui/react";
import clsx from "clsx";
import ImageUploadBox from "@/components/ui/ImageUploadBox";
import PackageContentEditor from "@/components/package-content-editor";

export default function Index({ cities }: { cities: City[] }) {
    const [contentError, setContentError] = useState('');
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        subtitle: '',
        imageUrl: '',
        overview: '',
        location: '',
        city_id: 0,
        content: ''
    });
    const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

    const processContent = (input: string) => {

        // 1. Extract the <p> after <h2>Short Description [*]</h2>
        const shortDescMatch = input.match(/<h2>Short Description \[\*\]<\/h2>\s*(<p>.*?<\/p>)/i);
        const shortDescription = shortDescMatch ? shortDescMatch[1] : null;

        // 2. Remove the <h2>Short Description [*]</h2> from the input
        const cleanedInput = input.replace(/<h2>Short Description \[\*\]<\/h2>/i, '');

        return [shortDescription, cleanedInput];
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if(!data.content.trim()) {
            setContentError('Content is required.');
            return;
        }

        setContentError('');

        post('/create-packages');
    }

    return (
        <FormLayout title="Create a Package" description="Enter the package details below to create a new package">
            <Head title="Create a Package" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
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
                    <Label>Overview</Label>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="grid gap-2">
                            {data.imageUrl && data.imageUrl.trim() !== "" ? (
                            <div className="border border-gray-300 w-42 h-26">
                                <img src={data.imageUrl} />
                            </div>
                            ):
                            (
                                <ImageUploadBox imagePreview={imagePreview} setImagePreview={setImagePreview} />
                            )}
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                            <div className="flex flex-col gap-1">
                                <span className="text-base font-medium">{data.title ? data.title : (<span>Title Placeholder</span>)}</span>
                                <span className="text-sm text-gray-600">{data.subtitle ? data.subtitle : (<span className="text-sm text-gray-600">Subtitle Placeholder</span>)}</span>
                            </div>
                            <Textarea
                                name="overview"
                                className={clsx("w-full max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl h-22 overflow-hidden resize-none text-sm",
                                    data.overview ? "bg-white" : "border bg-gray-100 focus:bg-blue-100 hover:shadow"
                                )}
                                placeholder="📝 This is a placeholder overview. Please enter a concise summary of the tour package here to give customers a quick insight into what your package offers. - Change this"
                                maxLength={250}
                                value={data.overview}
                                onChange={(e) => setData('overview', e.target.value)}
                                >

                            </Textarea>
                            <Button
                                type="button"
                                className="btn btn-primary text-xs w-20 px-12 py-2 rounded-none cursor-pointer"
                                >
                                View Tour
                            </Button>
                        </div>
                    </div>
                    
                </div>

                <div className="grid gap-2">
                    
                    <PackageContentEditor 
                        value={data.content} 
                        onChange={(value) => {
                            const [shortDescription, cleanedInput] = processContent(value);
                            setData('content', cleanedInput ?? '');
                            setData('overview', shortDescription ?? '');
                        }}
                    />
                    { contentError && (<InputError message={contentError} className="mt-2" />) }
                </div>

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
                    className="border rounded p-2"
                    required
                >
                    <option value="">Choose a City</option>
                    {cities.map((city: City) => (
                        <option value={city.id} key={city.id} data-name={city.name}>{city.name}</option>
                    ))

                    }
                </select>
                <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create
                </Button>
        </form>
        </FormLayout>
        
    );
}