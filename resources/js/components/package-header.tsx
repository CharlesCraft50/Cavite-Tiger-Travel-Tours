import clsx from "clsx";
import dayjs from "dayjs";
import { Check, FilePlus, Plus } from "lucide-react";
import LinkLoading from "./link-loading";
import { PropsWithChildren, useState, useRef, useEffect } from "react";
import PriceSign from "./price-sign";
import { Auth } from "@/types";
import { router } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';

type PackageBannerProps = {
  id?: number;
  title?: string;
  imageBanner?: string | string[];
  base_price?: number;
  size?: Array<string>;
  handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  created_at?: string;
  updated_at?: string;
  slug?: string;
  textSize?: "small" | "medium" | "large";
  auth?: Auth;
  isWishlisted?: boolean;
  editable?: boolean;
  hasBookNow?: boolean;
};

export default function PackageHeader({
  id,
  title,
  imageBanner,
  base_price,
  size = ["h-64", "md:h-96"],
  handleImageUpload,
  created_at = dayjs().format("YYYY-MM-DD[T]HH:mm:ss"),
  updated_at = dayjs().format("YYYY-MM-DD[T]HH:mm:ss"),
  slug,
  textSize = "small",
  editable = false,
  auth,
  isWishlisted: initialWishlisted = false,
  children,
  hasBookNow = true,
}: PropsWithChildren<PackageBannerProps>) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const swiperRef = useRef<SwiperType | null>(null);

  // Convert imageBanner to array
  let parsedBanner: string[] = [];

  try {
    if (typeof imageBanner === "string") {
      const maybeArray = JSON.parse(imageBanner);
      parsedBanner = Array.isArray(maybeArray) ? maybeArray : [imageBanner];
    } else if (Array.isArray(imageBanner)) {
      parsedBanner = imageBanner;
    }
  } catch {
    parsedBanner = [imageBanner as string];
  }

  const images = parsedBanner.length
    ? parsedBanner
    : ["https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/290875293_713107549780355_8510002955865993783_n.jpg"];

  const handleWishlistClick = () => {
    setIsWishlisted((prev) => !prev);

    router.post(
      route("wishlists.store"),
      {
        tour_package_id: id,
        user_id: auth?.user.id,
      },
      {
        forceFormData: true,
        preserveScroll: true,
        preserveState: true,
        onError: () => setIsWishlisted(initialWishlisted),
      }
    );
  };

  const handleImageUploadWithDebug = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // alert(`Files uploaded: ${files.length}\nFile names: ${Array.from(files).map(f => f.name).join(', ')}`);
    }
    if (handleImageUpload) {
      handleImageUpload(e);
    }
  };

  useEffect(() => {
    console.log(images.length);
  }, []);

    const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Refresh once all images are loaded
  useEffect(() => {
    if (!swiperRef.current) return;
    let loaded = 0;
    const total = images.length;
    const handleImgLoad = () => {
      loaded++;
      if (loaded === total && swiperRef.current) {
        swiperRef.current.update();
        swiperRef.current.slideTo(0);
      }
    };
    images.forEach((src) => {
      const img = new Image();
      img.onload = handleImgLoad;
      img.src = src;
    });
  }, [images]);

  return (
    <header className="mb-6">
      {/* Debug Info */}
      {/* <div className="mb-2 p-2 bg-yellow-100 border border-yellow-400 rounded text-xs">
        <p><strong>Debug Info:</strong></p>
        <p>Images array length: {images.length}</p>
        <p>Images: {images.join(', ')}</p>
        <p>Is Array: {Array.isArray(imageBanner) ? 'Yes' : 'No'}</p>
      </div> */}

      <div className={clsx("relative w-full rounded-xl overflow-hidden mb-6 group", size)}>
        {handleImageUpload && editable && (
          <input
            id="image-banner"
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleImageUploadWithDebug}
          />
        )}
        
        {ready && (
          <Swiper
            key={images.join(",")}
            modules={[Pagination, Autoplay]}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            pagination={images.length > 1 ? { clickable: true } : false}
            autoplay={
              images.length > 1
                ? {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                    stopOnLastSlide: false,
                  }
                : false
            }
            loop={images.length > 1}
            observer={true}
            observeParents={true}
            className="w-full h-full"
            style={{ height: "100%" }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="!w-full flex-shrink-0 relative">
                <label 
                  htmlFor={editable ? "image-banner" : undefined}
                  className={clsx("relative block w-full h-full", editable && "cursor-pointer")}
                >
                  <img
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />

                  {index === 0 && children}
                </label>
              </SwiperSlide>
            ))}

            {/* Custom Navigation Arrows - Outside the loop */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (swiperRef.current && !swiperRef.current.destroyed) {
                      swiperRef.current?.slidePrev();
                    }
                  }}
                  className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto duration-300"
                >
                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (swiperRef.current && !swiperRef.current.destroyed) {
                      swiperRef.current?.slideNext();
                    }
                  }}
                  className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto duration-300"
                >

                  <svg
                    className="w-6 h-6 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}
          </Swiper>
        )}

        {/* Fixed overlay text */}
        <div className="absolute inset-0 z-20 bg-black/40 flex items-center p-12 pointer-events-none">
          <div
            className={clsx(
              textSize === "small" && "w-full md:w-[50%]",
              textSize === "large" && "w-full md:w-[30%]",
              textSize === "medium" && "w-full md:w-[40%]",
              !["small", "medium", "large"].includes(textSize) && "w-full md:w-[40%]",
              "text-white"
            )}
          >
            <p className="text-sm md:text-base text-white mb-1 uppercase">
              {title ? title : <>Title Placeholder</>}
            </p>
            <h1
              className={clsx(
                textSize === "small" && "text-3xl md:text-5xl",
                textSize === "large" && "text-4xl md:text-6xl",
                "font-bold leading-tight uppercase"
              )}
            >
              Package Tours
            </h1>
          </div>
        </div>

      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-bold">{title || <>Title Placeholder</>}</h1>

          {base_price && (
            <p className="text-xl text-green-700 font-semibold mt-1">
              <PriceSign />
              {Number(base_price).toLocaleString()}{" "}
              <span className="text-sm text-gray-500">/ person</span>
            </p>
          )}
        </div>

        <div className="flex flex-row gap-2">
          {hasBookNow && (
            <LinkLoading
              href={slug ? route("booking.create", { slug }) : undefined}
              useUI={false}
              className="btn-primary"
            >
              Book Now
            </LinkLoading>
          )}

          {auth?.user && (
            <div className="flex flex-row items-center gap-2">
              <button
                type="button"
                onClick={handleWishlistClick}
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
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Created: {dayjs(created_at).format("MMMM D, YYYY h:mm A")} | Updated:{" "}
        {dayjs(updated_at).format("MMMM D, YYYY h:mm A")}
      </p>
    </header>
  );
}