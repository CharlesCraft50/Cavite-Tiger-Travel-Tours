import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { Button } from '@headlessui/react';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children, title, description, hasBackButton, ...props }: { children: React.ReactNode; title: string; description: string, hasBackButton?: boolean }) {
    return (
        <>
            {hasBackButton && (
                <div className="p-4">
                    <Button onClick={() => window.history.back()} className="text-sm cursor-pointer flex items-center gap-2 btn-primary">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            )}
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
        </>
    );
}
