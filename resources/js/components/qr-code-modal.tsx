import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

export default function QRCodeModal({ qrImages }: { qrImages: string[] }) {
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:gap-4 items-center">
        {qrImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`QR Code ${i + 1}`}
            className="w-120 h-120 object-contain cursor-pointer"
            onClick={() => setOpenImage(src)}
          />
        ))}
      </div>

      <Dialog open={!!openImage} onOpenChange={(open) => !open && setOpenImage(null)}>
        <DialogContent className="p-0 max-w-md sm:max-w-lg bg-transparent rounded-none">
          {openImage && (
            <img
              src={openImage}
              alt="QR Code Fullscreen"
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => setOpenImage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
