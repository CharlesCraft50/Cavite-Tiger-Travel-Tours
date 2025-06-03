import { SimpleEditor } from './tiptap-templates/simple/simple-editor';
import { Dispatch, LegacyRef, SetStateAction } from 'react';
import ModalLarge, { ModalLargeRef } from './ui/modal-large';
import { FilePlus } from 'lucide-react';
import { Button } from '@headlessui/react';


type SimpleEditorModalProps = {
    value: string;
    onChange: (value: string) => void;
    modalRef: LegacyRef<ModalLargeRef>;
    activeModal: boolean;
    setActiveModal: Dispatch<SetStateAction<boolean>>;
    title?: string;
    imageBanner?: string;
    handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasBanner?: boolean;
}

export default function SimpleEditorModal({ value, onChange, modalRef, activeModal, setActiveModal, title, imageBanner, handleImageUpload, hasBanner }: SimpleEditorModalProps) {

    return (
        <div className="space-y-6">
            <ModalLarge 
                ref={modalRef} 
                activeModal={activeModal} 
                setActiveModal={setActiveModal}
                fullScreen
            >
                {hasBanner && (
                    <div className="max-w-7xl px-4 py-2">
                        <header className="mb-6">
                            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
                                <input
                                    id="image-banner"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                                    
                                <label htmlFor="image-banner" className="absolute inset-0 cursor-pointer">
                                    {imageBanner && (<img
                                        src={imageBanner}
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                    />)}
                                    <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                                        <div className="w-[50%] text-white">
                                            <p className="text-sm md:text-base text-white mb-1 uppercase">{title ? title : imageBanner && (<>Title Placeholder</>)}</p>
                                            <h1 className="text-3xl md:text-5xl font-bold leading-tight uppercase">
                                                {imageBanner ? (
                                                    <>
                                                        Package Tours
                                                    </>
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
                                    type="button"
                                    className="btn-primary cursor-pointer"
                                >
                                    Book Now
                                </Button>
                            </div>

                            <p className="text-sm text-gray-500">
                                Created: May 30, 2025 2:13 AM | Updated:{' '} May 30, 2025 2:13 AM
                            </p>
                        </header>
                    </div>
                )}
                
                <div className="p-5">
                    <SimpleEditor value={value} onChange={onChange} />
                </div>
                
            </ModalLarge>
        </div>
    );
}
