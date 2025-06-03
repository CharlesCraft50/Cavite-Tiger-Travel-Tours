
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { TourPackage } from '@/types';

interface PackageShowLayoutProps {
    children: React.ReactNode;
    packages: TourPackage;
}

export default function PackageShowLayout({ children, packages, ...props }: PackageShowLayoutProps) {
    return (
        <>
            <Navbar />
            <PackagHeaderLayout packages={packages} {...props}>
                {children}
            </PackagHeaderLayout>

        </>
    );
}