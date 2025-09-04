import { Loader2Icon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

type PackageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  route: string;
};

export default function PackageModal({ isOpen, onClose, route }: PackageModalProps) {
  const [iframeLoading, setIframeLoading] = useState(true);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    if (isOpen) {
      setIframeLoading(true); // reset loader whenever modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-[90%] max-w-3xl h-[90%] rounded-lg shadow-lg relative">
        {/* Close button */}
        <Button
          onClick={onClose}
          className="btn-primary cursor-pointer bg-gray-400 p-0 w-10 h-10 absolute top-2 right-4 flex items-center justify-center text-gray-600 hover:text-gray-900 z-10"
        >
          <X size={20} />
        </Button>

        {/* Loading overlay */}
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2Icon className="w-18 h-18 animate-spin text-primary" />
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={route}
          className="w-full h-full rounded-lg"
          onLoad={() => setIframeLoading(false)}
        />
      </div>
    </div>
  );
}
