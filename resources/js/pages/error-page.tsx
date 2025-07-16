import Error from "@/components/ui/error";
import { Head } from "@inertiajs/react";

interface ErrorPageProps {
    title?: string;
    description?: string;
    redirectUrl?: string;
    redirectText?: string;
    redirectTimer?: number;
}

export default function ErrorPage({ 
    title = "Success!", 
    description = "Your action was successful.", 
    redirectUrl, 
    redirectText,
    redirectTimer
}: ErrorPageProps) {
    
    return (
        <>
            <Head title={title || "Error"} />
            <Error title={title} description={description} redirectText={redirectText} redirectUrl={redirectUrl} redirectTimer={redirectTimer} /> 
        </>
    );
}
