import { Button } from "@headlessui/react";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className, href, onClick }: { className: string; href?: string; onClick?: () => void; }) {
    const handleClick = () => {
        onClick?.();
        if(!href) {
            window.history.back()
        }
    }
    return (
        <Button onClick={handleClick} className={clsx("text-sm cursor-pointer flex items-center gap-2 btn-primary", className)}>
            <ArrowLeft className="w-4 h-4" />
            Back
        </Button>
    )
}