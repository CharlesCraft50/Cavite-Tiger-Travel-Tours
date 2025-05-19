import BookingSuccess from "@/components/ui/success";
import { Head } from "@inertiajs/react";

interface SuccessPageProps {
    title?: string;
    description?: string;
}

export default function SuccessPage({ title, description }: SuccessPageProps) {
    return (
        <>
            <Head title={title || "Success"} />
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <BookingSuccess title={title} description={description} />
            </div>
        </>
    );
}
