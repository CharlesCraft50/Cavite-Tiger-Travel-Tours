import { Loader2Icon } from "lucide-react";
import { useState } from "react";

const [ isLoading, setIsLoading ] = useState(false);

export function startLoadingBar() {
    setIsLoading(true);
}

export function stopLoadingBar() {
    setIsLoading(false);
}

export default function LoadingBar() {
    
    return (
        <>
            {isLoading && (
                <div className="fixed z-[9999] inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2Icon className="w-18 h-18 animate-spin text-primary" />
                </div>
            )}
        </>
    );
};