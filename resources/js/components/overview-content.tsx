import { Textarea } from '@headlessui/react'
import { PackageForm } from '@/pages/packages/create'
import clsx from 'clsx'
import ImageSimpleBox from './ui/image-simple-box'
import { TourPackage } from '@/types'
import { useEffect } from 'react'
import { OVERVIEW_COUNT } from '@/config/constants'
import LinkLoading from './link-loading'
import { PencilIcon } from 'lucide-react'
import { Link } from '@inertiajs/react'

type SetDataFunction<T> = (key: keyof T, value: T[keyof T]) => void;

type OverviewContentProps = {
    data?: PackageForm;
    setData?: SetDataFunction<PackageForm>;
    packageData?: TourPackage;
    setImageOverview?: React.Dispatch<React.SetStateAction<File | null>>;
    existingImageOverview?: string;
    automaticShortDescription?: boolean;
    setAutomaticShortDescription?: (e: boolean) => void;
    editable?: boolean;
}

export function stripHtmlTags(html?: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

export default function OverviewContent({ 
    data, 
    setData, 
    packageData, 
    setImageOverview, 
    existingImageOverview, 
    automaticShortDescription, 
    setAutomaticShortDescription, 
    editable,
 }: OverviewContentProps) {
  
    useEffect(() => {
        if(automaticShortDescription && data?.content) {
            const clean = stripHtmlTags(data.content);

            const trimmed = clean.slice(0, OVERVIEW_COUNT);

            setData?.('overview', trimmed.trim());
        }
    }, [automaticShortDescription, data?.content, setData]);
 return (
    <div>
        {editable && (
            <label className="label-sm">Overview</label>
        )}
        <div className="flex flex-row gap-4 items-center">
            <div className="grid gap-2">
                <ImageSimpleBox
                    id="image-overview"
                    imagePreview={data?.image_overview || packageData?.image_overview || existingImageOverview || ''}
                    setImagePreview={(e) => setData?.('image_overview', e)}
                    setImageFile={setImageOverview}
                    editable={editable}
                />
            </div>
            <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col gap-1">
                    {editable ? (
                        <>
                            <span className="text-base font-medium">{data?.title ? data?.title : (<span>Title Placeholder</span>)}</span>
                            <span className="text-sm text-gray-600">{data?.subtitle ? data?.subtitle : (<span className="text-sm text-gray-600">Subtitle Placeholder</span>)}</span>
                        </>
                        
                    ) : (
                        <>
                            <Link
                                href={!editable ? route('packages.show', {
                                    slug: packageData?.slug
                                }) : ""}
                            >
                                <span className="text-base font-medium">{packageData?.title}</span>
                            </Link>
                            <span className="text-sm text-gray-600">{packageData?.subtitle}</span>
                        </>
                        
                    )}
                </div>
                <div className="relative h-[88px] overflow-hidden">
                    {editable ? (
                        automaticShortDescription && (
                            <div
                                className="absolute inset-0 w-full max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden text-sm p-2 line-clamp-4"
                            >
                                {stripHtmlTags(data?.content)?.replace(/\.$/, '')}
                            </div>
                        )
                    ) : (
                        <div 
                            className="h-[88px] w-full max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl whitespace-pre-wrap break-words text-sm p-2"
                        >
                            {packageData?.overview}
                        </div>
                    )}

                    {editable && (
                        <Textarea
                            name="overview"
                            className={clsx(
                                "absolute inset-0 w-full max-w-xl sm:max-w-lg md:max-w-xl lg:max-w-2xl resize-none text-sm p-2 overflow-hidden",
                                data?.overview
                                    ? "bg-white"
                                    : "border bg-gray-100 focus:bg-blue-100 hover:shadow dark:bg-gray-900 text-black dark:text-white",
                                automaticShortDescription ? "disabled opacity-0 -z-10" : "opacity-100"
                            )}
                            placeholder="📝 This is a placeholder overview..."
                            maxLength={OVERVIEW_COUNT}
                            value={data?.overview || ''}
                            onChange={(e) => {
                                const input = e.target.value;
                                const lineBreaks = (input.match(/\n/g) || []).length;
                                if (lineBreaks < 4) {
                                    setData?.('overview', input);
                                }
                            }}
                        />
                    )}
                </div>

                    <div className="flex justify-end">
                        <LinkLoading
                            href={!editable ? route('packages.show', {
                                slug: packageData?.slug
                            }) : ""}
                            useUI={false}
                            loadingVisible={!editable}
                            className="btn-primary text-sm flex"
                        >
                            View Tour
                        </LinkLoading>
                    </div>

                {editable && (
                    <span className="text-gray-400 text-sm">{data?.overview.length}/{OVERVIEW_COUNT}</span>
                )}
            </div>
        </div>

        {editable && (
            <div className="gray-card">
                <label>
                    <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        onChange={(e) => {
                            setAutomaticShortDescription?.(e.target.checked)
                        }}
                        checked={automaticShortDescription}
                    />
                    <div>
                        <span className="text-sm font-medium text-gray-700">
                            Automatic Short Description
                        </span>
                        <p className="text-xs text-gray-500">
                            When enabled, Auto-generates a brief summary with an ellipsis (…).
                        </p>
                    </div>
                </label>
            </div>
        )}
    </div>
  )
}