import FormSimpleLayout from '@/layouts/packages/form-simple-layout';
import Navbar from '@/components/ui/navbar';

interface FormLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    disableNav?: boolean;
}

export default function FormLayout({ children, title, description, disableNav, ...props }: FormLayoutProps) {
    return (
        <>
            {disableNav ? null : <Navbar />}
            <div className="p-4 md:p-6">
                <FormSimpleLayout title={title} description={description} {...props}>
                    {children}
                </FormSimpleLayout>
            </div>
        </>
    );
}