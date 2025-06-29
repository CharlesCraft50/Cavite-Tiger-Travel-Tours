import { Check, FilePlus, Image, PencilIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import clsx from "clsx";
import { useLoading } from "./ui/loading-provider";
import { router } from "@inertiajs/react";

type PackagesIndexHeaderProps = {
    id?: number;
    title?: string;
    src?: string;
    editable?: boolean;
}

export default function PackagesIndexHeader({
    id,
    title,
    src,
    editable,
}: PackagesIndexHeaderProps) {

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
                
                router.post(`/countries/${id}`, formData, {
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
     <header className="mb-6">
        <div className="m-8">
            <div className="relative w-full h-54 rounded-xl overflow-hidden mb-6">
                <div className="absolute inset-0">
                    <img 
                        src={src}
                        className="absolute inset-0 bg-black/40 w-full h-full object-cover object-center" 
                    />

                    {isEditing && (
                        <label
                            htmlFor="image-overview-edit"
                            className={clsx(
                            "absolute inset-0 z-[30] flex w-full h-full items-center justify-center text-center",
                            !imagePreview && "bg-gray-400 border border-gray-600 border-dashed",
                            editable && "cursor-pointer"
                            )}
                            style={{
                            backgroundImage: imagePreview ? `url(${imagePreview})` : undefined,
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
                        <div className="flex justify-end top-4 right-4 absolute z-[10]" onClick={handleEditBtn}>
                            <Button className="btn-primary cursor-pointer">
                                <PencilIcon className="w-4 h-4 text-white" />
                            </Button>
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h1 className={clsx("text-white text-5xl uppercase font-bold", imagePreview && "z-40")}>{ title || 'Packages' }</h1>
                </div>
            </div>
        </div>
    </header>
  )
}