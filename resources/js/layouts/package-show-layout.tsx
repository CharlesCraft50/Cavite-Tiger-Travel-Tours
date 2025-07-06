
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { TourPackage } from '@/types';
import BackButton from '@/components/ui/back-button';
import { LoadingProvider } from '@/components/ui/loading-provider';

interface PackageShowLayoutProps {
    id?: number;
    children: React.ReactNode;
    packages: TourPackage;
    editable?: boolean;
}

export default function PackageShowLayout({ id, children, packages, editable, ...props }: PackageShowLayoutProps) {

    return (
        <LoadingProvider>
            <Navbar />
            <BackButton 
                href="/packages"
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