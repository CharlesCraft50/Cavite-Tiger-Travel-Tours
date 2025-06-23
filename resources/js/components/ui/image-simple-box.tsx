import clsx from 'clsx';
import { FilePlus, Image } from 'lucide-react'

type ImageUploadBoxProps = {
 imagePreview?: string;
 setImagePreview?: (e: string) => void;
 setImageFile?: (file: File) => void;
 editable?: boolean;
}

export default function ImageSimpleBox({ imagePreview, setImagePreview, setImageFile, editable }: ImageUploadBoxProps) {
    
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
                    id="image-overview"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
            )}
            <label
                htmlFor="image-overview"
                className={clsx("bg-gray-200 border border-gray-600 w-48 h-48 flex items-center justify-center text-center dark:bg-gray-950 text-black dark:text-white",
                    !imagePreview && editable && "border-dashed",
                    editable && "cursor-pointer"
                )}
            >
                {imagePreview ? (
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
                            <Image className="w-12 h-12" />
                            <p>No Image</p>
                        </div>
                    )
                )}
            </label>
        </div>
    )
}
