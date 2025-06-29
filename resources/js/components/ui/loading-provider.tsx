import { Loader2Icon } from "lucide-react";
import { createContext, useContext, useState } from "react"
import { start } from "repl";

const LoadingContext = createContext<{
    isLoading: boolean;
    start: () => void;
    stop: () => void;
}>({
    isLoading: false,
    start: () => {},
    stop: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [ isLoading, setIsLoading ] = useState(false);

    const start = () => setIsLoading(true);
    const stop = () => setIsLoading(false);

    return (
        <LoadingContext.Provider value={{ isLoading, start, stop }}>
            {children}
            {isLoading && (
                <div className="fixed z-[9999] inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2Icon className="w-18 h-18 animate-spin text-primary" />
                </div>
            )}
        </LoadingContext.Provider>
    );
}