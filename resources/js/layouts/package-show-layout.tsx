
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { TourPackage } from '@/types';
import BackButton from '@/components/ui/back-button';
import { LoadingProvider, useLoading } from '@/components/ui/loading-provider';

interface PackageShowLayoutProps {
    id?: number;
    children: React.ReactNode;
    packages: TourPackage;
    editable?: boolean;
}

export default function PackageShowLayout({ id, children, packages, editable, ...props }: PackageShowLayoutProps) {

    const { start, stop } = useLoading();

    return (
        <LoadingProvider>
            <Navbar />
            <BackButton 
                onClick={() => {
                    start();
                }} 
                className="ms-12 mb-0 mt-2" 
            />
            <PackagHeaderLayout 
                id={packages.id}
                packages={packages}
                editable={editable}
                {...props}
            >
                {children}
            </PackagHeaderLayout>

        </LoadingProvider>
    );
}