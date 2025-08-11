
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { Auth, TourPackage } from '@/types';
import BackButton from '@/components/ui/back-button';

interface PackageShowLayoutProps {
    id?: number;
    children: React.ReactNode;
    packages: TourPackage;
    auth?: Auth;
    isWishlisted?: boolean;
    editable?: boolean;
}

export default function PackageShowLayout({ id, children, packages, editable, auth, isWishlisted, ...props }: PackageShowLayoutProps) {

    return (
        <>
            <Navbar />
            <BackButton 
                href="/packages"
                className="ms-12 mb-0 mt-2" 
            />
            <PackagHeaderLayout 
                id={packages.id}
                auth={auth}
                isWishlisted={isWishlisted}
                packages={packages}
                editable={editable}
                {...props}
            >
                {children}
            </PackagHeaderLayout>

        </>
    );
}