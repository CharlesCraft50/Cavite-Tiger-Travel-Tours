import clsx from 'clsx';
import { Textarea } from '@headlessui/react';
import { Label } from './ui/label';
import { Button } from '@/components/ui/button';
import SimpleEditorModal from './simple-editor-modal';
import { ModalLargeRef } from './ui/modal-large';
import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
// Import TipTap styles
import '@/styles/main.scss'
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"
import { FilePlus } from 'lucide-react';

type PackageContentEditorProps = {
    value: string;
    onChange: (value: string) => void;
    title?: string,
    imageBanner?: string;
    setImageBanner?: (e: string) => void;
}

export default function PackageContentEditor({ value, onChange, title, imageBanner, setImageBanner }: PackageContentEditorProps) {
    const [activeModal, setActiveModal] = useState(false);

    const modalRef = useRef<ModalLargeRef>(null);

    const closeModal = () => {
        modalRef.current?.close();
        
    }

    const openModal = () => {
      setActiveModal(true);
    }

    useEffect(() => {
        if(activeModal){
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeModal]);


    const isEffectivelyEmptyHtml = (html: string) => {
        if (!html) return true;
        
        // Strip whitespace from start/end
        const trimmed = html.trim();
        
        if (!trimmed) return true;
        
        // Parse HTML string
        const div = document.createElement('div');
        div.innerHTML = trimmed;

        // Check if all children are empty paragraphs or empty text nodes
        for (const child of div.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
            if (child.textContent?.trim()) {
                return false; // Non-empty text node found
            }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
            const el = child as HTMLElement;
            if (el.tagName.toLowerCase() === 'p') {
                // Check if paragraph has any text or children
                if (el.textContent?.trim()) {
                return false; // Paragraph has content
                }
            } else {
                // Some other element means content is not empty
                return false;
            }
            }
        }

        // If all are empty paragraphs or empty text nodes, treat as empty
        return true;
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file && setImageBanner) {
            const url = URL.createObjectURL(file);
            setImageBanner(url);
        }
    }

  return (
    <div className="space-y-6">
        <div className="grid gap-2">
            <Label htmlFor="contentDummy">Content</Label>
            {!isEffectivelyEmptyHtml(value) ? (
                <div 
                    className="p-6 bg-white shadow transition-all duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 text-black dark:text-white"
                >
                    <header className="mb-6">
                        <div className="relative w-full h-55 md:h-86 rounded-xl overflow-hidden mb-6">
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

                    <div
                        className="tiptap ProseMirror cursor-text"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
                        onClick={openModal}
                    />
                </div>
            ) : (
                <Textarea 
                    name="contentDummy" 
                    className="border bg-gray-100 data-focus:bg-blue-100 data-hover:shadow dark:bg-gray-900 text-black dark:text-white" 
                    placeholder="Edit your package content here..." 
                    onClick={openModal}
                    readOnly
                >
                </Textarea>
            )}
            <Button type="button" className={clsx("fixed bottom-10 right-32 cursor-pointer text-1xl p-5", activeModal ? "opacity-100 z-100" : "opacity-0 z-[-99999]")} onClick={closeModal}>Save</Button>
        </div>

        <SimpleEditorModal value={value} onChange={onChange} modalRef={modalRef} activeModal={activeModal} setActiveModal={setActiveModal}  />
    </div>
  )
}
