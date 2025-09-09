import FormSimpleLayout from '@/layouts/packages/form-simple-layout';
import Navbar from '@/components/ui/navbar';
import BackButton from '@/components/ui/back-button';

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
            {hasBackButton && <BackButton 
                href={backButtonHref ?? "/packages"}
                className="ms-12 mb-0 mt-2" 
            />}
            <div className="p-4 md:p-6">
                <FormSimpleLayout title={title} description={description} {...props}>
                    {children}
                </FormSimpleLayout>
            </div>
        </>
    );
}