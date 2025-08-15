import clsx from 'clsx';
import { FilePlus, Image } from 'lucide-react'

type ImageUploadBoxProps = {
 id?: string;
 imagePreview?: string;
 setImagePreview?: (e: string) => void;
 setImageFile?: (file: File) => void;
 editable?: boolean;
 className?: string;
}

export default function ImageSimpleBox({ id, imagePreview, setImagePreview, setImageFile, className, editable }: ImageUploadBoxProps) {
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file && setImagePreview) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
            setImageFile?.(file);
        }
    }
  
    return (
        <div className="relative">
            {editable && (
                <input
                    id={id}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            )}
            <label
                htmlFor={id}
                className={clsx("bg-gray-200 border border-gray-600 flex items-center justify-center text-center dark:bg-gray-950 text-black dark:text-white",
                    !imagePreview && editable && "border-dashed",
                    className ? className : "w-48 h-48",
                    editable && "cursor-pointer"
                )}
            >
                {imagePreview && imagePreview !== 'null' ? (
                    <img src={imagePreview} 
                        alt="Image Preview"
                        className="image-preview" 
                    />
                ) : (
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
            </label>
        </div>
    )
}
