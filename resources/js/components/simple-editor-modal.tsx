import { SimpleEditor } from './tiptap-templates/simple/simple-editor';
import { Dispatch, LegacyRef, SetStateAction } from 'react';
import ModalLarge, { ModalLargeRef } from './ui/modal-large';
import PackageHeader from './package-header';


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
                    <PackageHeader handleImageUpload={handleImageUpload} imageBanner={imageBanner} title={title} editable/>
                )}
                
                <div className="p-5">
                    <SimpleEditor value={value} onChange={onChange} />
                </div>
                
            </ModalLarge>
        </div>
    );
}
