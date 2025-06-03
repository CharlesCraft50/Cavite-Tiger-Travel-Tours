import Success from "@/components/ui/success";
import { Head } from "@inertiajs/react";

interface SuccessPageProps {
    title?: string;
    description?: string;
    redirectUrl?: string;
    redirectText?: string;
    redirectTimer?: number;
}

export default function SuccessPage({ 
    title = "Success!", 
    description = "Your action was successful.", 
    redirectUrl, 
    redirectText,
    redirectTimer
}: SuccessPageProps) {
    
    return (
        <>
            <Head title={title || "Success"} />
            <Success title={title} description={description} redirectText={redirectText} redirectUrl={redirectUrl} redirectTimer={redirectTimer} /> 
        </>
    );
}
