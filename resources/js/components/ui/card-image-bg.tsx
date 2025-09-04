import { Check, FilePlus, PencilIcon } from "lucide-react";
import { Button } from "./button";
import React, { useState } from "react";
import clsx from "clsx";
import { router } from "@inertiajs/react";
import { useLoading } from "./loading-provider";
import { Input } from "./input";

type CardImageBackgroundProps = {
    id?: number;
    inputId?: string;
    src?: string;
    onClick?: () => void;
    title?: string;
    editable?: boolean;
    editableText?: boolean;
    size?: "small" | "medium" | "large";
};

export default function CardImageBackground({
    id,
    inputId,
    src,
    onClick,
    title,
    editable,
    editableText,
    size = "medium",
}: CardImageBackgroundProps) {

    const { start, stop } = useLoading();

    const [imagePreview, setImagePreview] = useState<string>();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [cityTitle, setCityTitle] = useState(title ?? '');
    const [isEditing, setIsEditing] = useState(false);

    const handleEditBtn = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
        setImagePreview("");
    }

    const handleSaveBtn = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const formData = new FormData();
        if (imageFile) formData.append('image_url', imageFile);
        if (cityTitle != title && cityTitle.trim() != '') formData.append('name', cityTitle);
        formData.append("_method", "PUT");

        if (imagePreview || (cityTitle != title && cityTitle.trim() != '')) {
            start();
            router.post(`/cities/${id}`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditing(false);
                    stop();
                },
            });
            return;
        }
        setIsEditing(false);
    }

    const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    // Size mapping
    const sizeClasses = {
        small: "w-62 h-76",
        medium: "w-76 h-84",
        large: "w-96 h-96"
    };
    const sizeClass = sizeClasses[size];

    return (
        <div
            className={clsx("relative rounded-xl overflow-hidden flex items-center justify-center text-center cursor-pointer transition-shadow duration-300", sizeClass)}
            style={{
                backgroundImage: `url(${src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'inset 0 0 30px rgba(0, 0, 0, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
            {isEditing && (
                <label
                    htmlFor={inputId}
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
                    onClick={(e) => e.stopPropagation()}
                >
                    {!imagePreview && (
                        editable ? (
                            <span className="text-gray-600 text-sm flex p-8 flex-col items-center gap-2">
                                Upload your photo here
                                <FilePlus className="w-8 h-8 text-gray-600" />
                            </span>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center gap-2">
                                <div className="text-2xl mb-1">🏞️</div>
                                <div className="text-xs">No image</div>
                            </div>
                        )
                    )}
                    <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />
                </label>
            )}

            {isEditing && (
                <div className="flex justify-end top-4 right-4 absolute z-[40] gap-2">
                    <Button type="button" className="btn-primary cursor-pointer" onClick={handleSaveBtn}>
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

            {editableText 
                ? isEditing
                    ? <div className="flex justify-center w-full">
                        <Input
                            className={clsx("relative text-white bg-gray-500/50 text-3xl font-bold uppercase z-999 w-[90%] text-center", imagePreview && "z-40", size == "small" && "text-lg w-[80%]")} 
                            type="text"
                            value={cityTitle}
                            onChange={(e) => setCityTitle(e.target.value)}
                        />
                    </div>
                    : <p className={clsx("relative text-white text-3xl font-bold uppercase", imagePreview && "z-40", size == "small" && "text-lg w-[80%]")}>{title}</p>
                : <p className={clsx("relative text-white text-3xl font-bold uppercase", imagePreview && "z-40", size == "small" && "text-lg w-[80%]")}>{title}</p>
            }
        </div>
    )
}
