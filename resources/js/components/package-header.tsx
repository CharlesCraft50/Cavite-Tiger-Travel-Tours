import { Button } from "@headlessui/react";
import clsx from "clsx";
import dayjs from "dayjs";
import { FilePlus } from "lucide-react";

type PackageBannerProps = {
    title?: string;
    imageBanner?: string;
    size?: Array<string>;
    handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    created_at?: string;
    updated_at?: string;
    bookingLink?: string;
    textSize?: 'small' | 'medium' | 'large'
}

export default function PackageHeader({
    title,
    imageBanner,
    size = ["h-64", "md:h-96"],
    handleImageUpload,
    created_at = (new Date()).toISOString(),
    updated_at = (new Date()).toISOString(),
    bookingLink,
    textSize = 'small'
}: PackageBannerProps) {
  return (
    <header className="mb-6">
        <div className={clsx("relative w-full ", size, " rounded-xl overflow-hidden mb-6")}>
            {handleImageUpload && (
                <input
                    id="image-banner"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            )}
                
            <label htmlFor="image-banner" className="absolute inset-0 cursor-pointer">
                <img
                    src={imageBanner}
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
                        {imageBanner ? (
                            <>Package Tours</>
                        ) : (
                            <span className="flex flex-col text-sm text-gray-600 p-8 gap-2 items-center">
                            Upload your banner photo here
                            <FilePlus className="w-8 h-8 text-gray-600" />
                            </span>
                        )}
                        </h1>
                    </div>
                    </div>
            </label>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-4xl font-bold">{title ? title : (<>Title Placeholder</>)}</h1>
            
            <Button
                onClick={() => bookingLink && window.open(bookingLink, '_blank')}
                className="btn-primary cursor-pointer"
            >
                Book Now
            </Button>
        </div>

        <p className="text-sm text-gray-500">
            Created: {dayjs(created_at).format('MMMM D, YYYY h:mm A')} | Updated:{' '}
            {dayjs(updated_at).format('MMMM D, YYYY h:mm A')}
        </p>
    </header>
  )
}
