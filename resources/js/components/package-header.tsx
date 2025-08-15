import clsx from "clsx";
import dayjs from "dayjs";
import { Check, FilePlus, Plus } from "lucide-react";
import LinkLoading from "./link-loading";
import { PropsWithChildren, useEffect, useState } from "react";
import PriceSign from "./price-sign";
import { format } from "date-fns";
import { Auth } from "@/types";
import { router } from "@inertiajs/react";
import { Button } from "@headlessui/react";

type PackageBannerProps = {
    id?: number;
    title?: string;
    imageBanner?: string;
    base_price?: number;
    size?: Array<string>;
    handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    created_at?: string;
    updated_at?: string;
    slug?: string;
    textSize?: 'small' | 'medium' | 'large';
    auth?: Auth;
    isWishlisted?: boolean;
    editable?: boolean;
}

export default function PackageHeader({
    id,
    title,
    imageBanner,
    base_price,
    size = ["h-64", "md:h-96"],
    handleImageUpload,
    created_at = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    updated_at = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
    slug,
    textSize = 'small',
    editable = false,
    auth,
    isWishlisted,
    children,
}: PropsWithChildren<PackageBannerProps>) {

  return (
    <header className="mb-6">
        <div className={clsx("relative w-full ", size, " rounded-xl overflow-hidden mb-6")}>
            {handleImageUpload && editable && (
                <input
                    id="image-banner"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            )}
                
            <label htmlFor="image-banner" className={clsx("absolute inset-0", editable && "cursor-pointer")}>
                <img
                    src={imageBanner || "https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/290875293_713107549780355_8510002955865993783_n.jpg"}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                    <div
                        className={clsx(
                            textSize === "small" && "w-full md:w-[50%]",
                            textSize === "large" && "w-full md:w-[30%]",
                            "text-white"
                        )}
                    >
                        <p className="text-sm md:text-base text-white mb-1 uppercase">
                            {title ? title : imageBanner && <>Title Placeholder</>}
                        </p>
                        <h1
                        className={clsx(
                            textSize === "small" && "text-3xl md:text-5xl",
                            textSize === "large" && "text-4xl md:text-6xl",
                            "font-bold leading-tight uppercase"
                        )}
                        >
                        <>Package Tours</>
                        
                        {editable && (
                                <span className="flex flex-col text-sm text-gray-600 p-8 gap-2 items-center">
                                    Upload your banner photo here
                                    <FilePlus className="w-8 h-8 text-gray-600" />
                                </span>
                        )}
                        </h1>
                    </div>
                </div>
                
                {children}
            </label>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <div>
                <h1 className="text-4xl font-bold">
                    {title ? title : (<>Title Placeholder</>)}
                </h1>

                {base_price && (
                    <p className="text-xl text-green-700 font-semibold mt-1">
                        <PriceSign />
                        {Number(base_price).toLocaleString()} <span className="text-sm text-gray-500">/ package</span>
                    </p>
                )}
            </div>

            <div className="flex flex-row gap-2">
                <LinkLoading
                    href={slug ? route("booking.create", { slug: slug }) : undefined}
                    useUI={false}
                    className="btn-primary"
                >
                    Book Now
                </LinkLoading>

                {auth?.user && (
                    <div className="flex flex-row items-center gap-2">
                        <Button
                            onClick={() => {
                                router.post(route('wishlists.store'), {
                                    tour_package_id: id,
                                    user_id: auth?.user.id
                                }, {
                                    forceFormData: true,
                                    preserveScroll: true,
                                    preserveState: true,
                                });
                            }}
                            className={`btn-primary text-sm px-3 py-2 ${
                                isWishlisted ? "bg-green-500 cursor-pointer" : "bg-gray-500 cursor-pointer"
                            }`}
                        >
                            {isWishlisted ? (
                                <span className="flex flex-row items-center mt-1 mb-1">
                                    <Check className="mr-1" />
                                    <p>Wishlisted</p>
                                </span>
                            ) : (
                                <span className="flex flex-row items-center mt-1 mb-1">
                                    <Plus className="mr-1" />
                                    <p>Wishlist</p>
                                </span>
                            )}
                        </Button>
                    </div>
                )}


            </div>
        </div>

        <p className="text-sm text-gray-500">
            Created: {dayjs(created_at).format('MMMM D, YYYY h:mm A')} | Updated:{' '}
            {dayjs(updated_at).format('MMMM D, YYYY h:mm A')}
        </p>
    </header>
  )
}
