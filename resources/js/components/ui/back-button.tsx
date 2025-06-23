import { Button } from "@headlessui/react";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className }: { className: string }) {
    return (
        <Button onClick={() => window.history.back()} className={clsx("text-sm cursor-pointer flex items-center gap-2 btn-primary", className)}>
            <ArrowLeft className="w-4 h-4" />
            Back
        </Button>
    )
}