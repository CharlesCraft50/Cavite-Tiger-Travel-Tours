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
import PackageHeader from './package-header';


type PackageContentEditorProps = {
    value: string;
    onChange: (value: string) => void;
    title?: string,
    imageBanner?: string;
    setImageBanner?: (e: string) => void;
    setImageFile?: (file: File) => void;
    onClearContent?: () => void;
}

export const isEffectivelyEmptyHtml = (html: string) => {
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

export default function PackageContentEditor({ value, onChange, title, imageBanner, setImageBanner, setImageFile, onClearContent }: PackageContentEditorProps) {
    const [activeModal, setActiveModal] = useState(false);

    const modalRef = useRef<ModalLargeRef>(null);

    const closeModal = () => {
        modalRef.current?.close();
    }

    const openModal = () => {
      setActiveModal(true);
    }

    const clearContent = () => {
        closeModal(); // triggers close transition
        onClearContent?.();
        setTimeout(() => {
            setActiveModal(true);
        }, 250);
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


    

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if(file && setImageBanner) {
            const url = URL.createObjectURL(file);
            setImageBanner(url);
            setImageFile?.(file);
        }
    }

  return (
    <div className="space-y-6">
        <div className="grid gap-2">
            <Label htmlFor="contentDummy" required>Content</Label>
            {!isEffectivelyEmptyHtml(value) ? (
                <div className="p-6 bg-white shadow transition-all duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 text-black dark:text-white">
                    <PackageHeader 
                        handleImageUpload={handleImageUpload} 
                        imageBanner={imageBanner} 
                        title={title} 
                        editable
                    />
                    <div
                        className="tiptap ProseMirror cursor-text"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }}
                        onClick={openModal}
                    />
                </div>
            ) : (
                <Textarea 
                    name="contentDummy" 
                    className="border bg-gray-100 data-focus:bg-blue-100 data-hover:shadow px-4 py-2 dark:bg-gray-900 text-black dark:text-white" 
                    placeholder="Edit your package content here..." 
                    onClick={openModal}
                    readOnly
                >
                </Textarea>
            )}

            {activeModal && (
                <div className="fixed bottom-4 right-8 flex gap-2 z-9999">
                    <Button 
                        type="button" 
                        variant="outline"
                        className="cursor-pointer px-4 py-2" 
                        onClick={clearContent}
                    >
                        Clear
                    </Button>
                    <Button 
                        type="button" 
                        className="cursor-pointer px-4 py-2" 
                        onClick={closeModal}
                    >
                        Save
                    </Button>
                </div>
            )}
            
        </div>

        <SimpleEditorModal value={value} onChange={onChange} modalRef={modalRef} activeModal={activeModal} setActiveModal={setActiveModal} imageBanner={imageBanner} handleImageUpload={handleImageUpload} hasBanner/>
    </div>
  )
}