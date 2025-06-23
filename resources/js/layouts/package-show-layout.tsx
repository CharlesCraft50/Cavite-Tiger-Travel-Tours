
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { TourPackage } from '@/types';
import BackButton from '@/components/ui/back-button';

interface PackageShowLayoutProps {
    children: React.ReactNode;
    packages: TourPackage;
}

export default function PackageShowLayout({ children, packages, ...props }: PackageShowLayoutProps) {
    return (
        <>
            <Navbar />
            <BackButton className="ms-12 mb-0 mt-2" />
            <PackagHeaderLayout packages={packages} {...props}>
                {children}
            </PackagHeaderLayout>

        </>
    );
}