import { SimpleEditor } from './tiptap-templates/simple/simple-editor';
import { Dispatch, LegacyRef, SetStateAction } from 'react';
import ModalLarge, { ModalLargeRef } from './ui/modal-large';


type SimpleEditorModalProps = {
    value: string;
    onChange: (value: string) => void;
    modalRef: LegacyRef<ModalLargeRef>;
    activeModal: boolean;
    setActiveModal: Dispatch<SetStateAction<boolean>>;
}

export default function SimpleEditorModal({ value, onChange, modalRef, activeModal, setActiveModal }: SimpleEditorModalProps) {

    return (
        <div className="space-y-6">
            <ModalLarge 
                ref={modalRef} 
                activeModal={activeModal} 
                setActiveModal={setActiveModal}
                fullScreen
            >
                
                <div className="p-5">
                    <SimpleEditor value={value} onChange={onChange} />
                </div>
                
            </ModalLarge>
        </div>
    );
}
