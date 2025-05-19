import { CheckCircle } from "lucide-react";
import { Button } from "./button";

interface SuccessProps {
    title?: string;
    description?: string;
}

export default function Success({
    title = "Success",
    description = "Your booking has been successfully submitted. Please check your email for confirmation and next steps.",
}: SuccessProps) {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[200px] px-4">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-600">{title}</h2>
            <p className="text-gray-700 mt-2 max-w-md">{description}</p>
            <Button
                onClick={() => window.location.href = "/"}
                className="mt-4 cursor-pointer"
            >
                Close
            </Button>
        </div>
    );
}
