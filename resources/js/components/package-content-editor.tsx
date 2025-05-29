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

type PackageContentEditorProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function PackageContentEditor({ value, onChange }: PackageContentEditorProps) {
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
  return (
    <div className="space-y-6">
        <div className="grid gap-2">
            <Label htmlFor="contentDummy">Content</Label>
            {value && value.trim() !== "" ? (
                <>
                    <div 
                        onClick={openModal} 
                        className="p-6 bg-white cursor-pointer shadow transition-all duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <div 
                            className="prose prose-lg max-w-none" 
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} 
                        />
                    </div>
                    <div>
                        {value}
                    </div>
                </>
            ) : (
                <Textarea 
                    name="contentDummy" 
                    className="border bg-gray-100 data-focus:bg-blue-100 data-hover:shadow" 
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
