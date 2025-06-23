import clsx from 'clsx';
import { X } from 'lucide-react';
import React, { PropsWithChildren, useState, forwardRef, useImperativeHandle } from 'react'

type ModalLargeProps = {
    title?: string;
    description?: string;
    activeModal: boolean;
    fullScreen?: boolean;
    setActiveModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ModalLargeRef = {
  close: () => void
}

const ModalLarge = forwardRef<ModalLargeRef, PropsWithChildren<ModalLargeProps>>(
  ({ children, title, description, activeModal, fullScreen, setActiveModal }, ref) => {

  const [isClosing, setIsClosing] = useState(false);
  // const [isOpening, setIsOpening] = useState(false);

  // useEffect(() => {
  //   if(activeModal) {
  //     setIsOpening(true);
  //     const timeout = setTimeout(() => setIsOpening(false), 200);
  //     return () => clearTimeout(timeout);
  //   }
  // }, [activeModal])

  const handleClose = () => {
    // setIsClosing(true);
    // setTimeout(() => {
      setIsClosing(false);
      setActiveModal(false);
    // }, 200);
  }

  useImperativeHandle(ref, () => ({
    close: handleClose,
  }));

  if (!activeModal && !isClosing) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 dark:bg-black/80" />

        {/* Modal */}
        <div className={clsx(
                "fixed top-1/2 left-1/2", fullScreen ? "w-screen h-screen max-w-full max-h-full" : "w-[90vw] h-[90vh]", " max-w-6xl transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md sm:rounded-xl shadow-xl p-4 sm:p-6 overflow-y-auto z-150 transition-all duration-200 ease-in-out",
                // activeModal && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95  translate-y-4",
                // activeModal && !isOpening ? "opacity-100" : "opacity-0 translate-y-4"
              )}
            onClick={e => e.stopPropagation()}>
            <div className="absolute top-4 right-4">
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-black transition-colors cursor-pointer"
                aria-label="close">
                  <X className='w-8 h-8' />
              </button>
            </div>
            {title && (<h1 className="text-xl font-semibold">{ title }</h1>)}
            {description && (<p className="mt-2 p-4">{ description }</p>)}
            {children}
        </div>

    </div>
  )
}
)


export default ModalLarge;
