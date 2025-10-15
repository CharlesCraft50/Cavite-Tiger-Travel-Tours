import FormSimpleLayout from '@/layouts/packages/form-simple-layout';
import Navbar from '@/components/ui/navbar';
import BackButton from '@/components/ui/back-button';
import { Button } from '@headlessui/react';
import { ArrowLeft } from 'lucide-react';

interface FormLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    disableNav?: boolean;
    removeNavItems?: boolean;
    hasBackButton?: boolean;
    backButtonHref?: string;
}

export default function FormLayout({ children, title, description, disableNav, removeNavItems, hasBackButton, backButtonHref, ...props }: FormLayoutProps) {
    return (
        <>
        
            {disableNav ? null : <Navbar removeNavItems={removeNavItems} />}
            {hasBackButton && (
                <div className="p-4">
                    <Button onClick={() => window.history.back()} className="text-sm cursor-pointer flex items-center gap-2 btn-primary">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </div>
            )}
            <div className="p-4 md:p-6">
                <FormSimpleLayout title={title} description={description} {...props}>
                    {children}
                </FormSimpleLayout>
            </div>
        </>
    );
}