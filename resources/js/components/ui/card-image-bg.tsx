import { Check, FilePlus, Image, PencilIcon } from "lucide-react";
import { Button } from "./button";
import React, { useState } from "react";
import clsx from "clsx";
import { router } from "@inertiajs/react";
import { useLoading } from "./loading-provider";

type CardImageBackgroundProps = {
    id?: number;
    src?: string;
    onClick?: () => void;
    title?: string;
    editable?: boolean;
};

export default function CardImageBackground({
    id,
    src,
    onClick,
    title,
    editable,
}: CardImageBackgroundProps) {

    const { start, stop } = useLoading();

    const handleEditBtn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setImagePreview("");
    }

    const handleSaveBtn = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const formData = new FormData();

        if(imageFile) {
            formData.append('image_url', imageFile);
        }

        formData.append("_method", "PUT");

        if(imagePreview) {
            start();
            
            router.post(`/cities/${id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditing(false);
                    stop();
                }
            });

            return;
        }

        setIsEditing(false);
    }

    const [ imagePreview, setImagePreview ] = useState<string>();
    const [ imageFile, setImageFile ] = useState<File | null>(null);

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();

        const file = e.target.files?.[0];

        if(file && setImagePreview) {
            const url = URL.createObjectURL(file);
            setImageFile(file);
            setImagePreview(url);
        }
    }

    const [ isEditing, setIsEditing ] = useState(false);

  return (
    <div
        className="relative w-76 h-84 rounded-xl overflow-hidden flex items-center justify-center text-center cursor-pointer transition-shadow duration-300"
        style={{
            backgroundImage: `url(${src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 0, 0, 0.5)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
        }}
        
        onClick={(e) => {
            e.stopPropagation();
            onClick?.()
        }}
    >
        {isEditing && (
            <label
                htmlFor="image-overview-edit"
                className={clsx(
                "absolute inset-0 z-[30] flex w-full h-full items-center justify-center text-center",
                !imagePreview && "bg-gray-400 border border-gray-600 border-dashed",
                editable && "cursor-pointer"
                )}
                style={{
                    backgroundImage: imagePreview
                        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${imagePreview})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                onClick={(e) => e.stopPropagation()} // Optional: prevent triggering parent
            >
                {!imagePreview && (
                editable ? (
                    <span className="text-gray-600 text-sm flex p-8 flex-col items-center gap-2">
                    Upload your photo here
                    <FilePlus className="w-8 h-8 text-gray-600" />
                    </span>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                    <Image className="w-12 h-12" />
                    <p>No Image</p>
                    </div>
                )
                )}
                <input
                id="image-overview-edit"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadImage}
                />
            </label>
            )}

            {/* Keep the top-right buttons separate and above everything */}
            {isEditing && (
            <div className="flex justify-end top-4 right-4 absolute z-[40] gap-2">
                <Button className="btn-primary cursor-pointer" onClick={handleSaveBtn}>
                <Check className="w-4 h-4 text-white" />
                </Button>
            </div>
        )}

        
        {editable && (
            <div className="flex justify-end top-4 right-4 absolute z-[10]">
                <Button className="btn-primary cursor-pointer" onClick={handleEditBtn}>
                    <PencilIcon className="w-4 h-4 text-white" />
                </Button>
            </div>
        )}

        <div className="absolute inset-0 bg-black/40" />
        
        <p className={clsx("relative text-white text-3xl font-bold uppercase", imagePreview && "z-40")}>
            {title}
        </p>
    </div>
  )
}
