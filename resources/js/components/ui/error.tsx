import { X } from "lucide-react";
import { Button } from "./button";
import { useEffect } from "react";
import { router } from "@inertiajs/react";

interface ErrorProps {
    title?: string;
    description?: string;
    redirectUrl?: string;
    redirectText?: string;
    redirectTimer?: number;
}

export default function Error({
    title = "Success",
    description = "Error!",
    redirectUrl, 
    redirectText,
    redirectTimer
}: ErrorProps) {

    useEffect(() => {
        if(redirectUrl) {
            const timer = setTimeout(() => {
                router.visit(redirectUrl);
            }, redirectTimer || 3000);

            return () => clearInterval(timer);
        }
    }, [redirectUrl, redirectTimer]);

    return (
        <div className="text-center px-4 flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <X className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600">{title}</h2>
            <p className="text-gray-700 mt-2 max-w-md">{description}</p>
            {redirectUrl && (
                <a
                    href={redirectUrl}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {redirectText || 'Continue'}
                </a>
            )}

            {!redirectUrl && (
                <Button
                    className="mt-4 cursor-pointer btn-primary"
                    onClick={() => window.history.back()}
                >
                    Close
                </Button>
            )} 
        </div>
    );
}
