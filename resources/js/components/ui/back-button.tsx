import { Button } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import clsx from "clsx";
import { ArrowLeft } from "lucide-react";
import { useLoading } from "./loading-provider";

export default function BackButton({ className, href, onClick }: { className: string; href?: string; onClick?: () => void; }) {
    const handleClick = () => {
        onClick?.();
        start();
        if(!href) {
            window.history.back()
        }
    }

    const { start, stop } = useLoading();
    return (
        <>
            {href ? (
                <Link
                    href={href}
                >
                    <Button onClick={handleClick} className={clsx("text-sm cursor-pointer flex items-center gap-2 btn-primary", className)}>
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>
            ) : (
                <Button onClick={handleClick} className={clsx("text-sm cursor-pointer flex items-center gap-2 btn-primary", className)}>
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            )}
        </>
    )
}