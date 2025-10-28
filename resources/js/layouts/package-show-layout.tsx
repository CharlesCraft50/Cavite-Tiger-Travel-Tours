
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';
import { Auth, TourPackage } from '@/types';
import { Button } from '@headlessui/react';
import { ArrowLeft } from 'lucide-react';

interface PackageShowLayoutProps {
    id?: number;
    children: React.ReactNode;
    packages: TourPackage;
    auth?: Auth;
    isWishlisted?: boolean;
    editable?: boolean;
    disableNav?: boolean;
}

export default function PackageShowLayout({ id, children, packages, editable, auth, isWishlisted, disableNav, ...props }: PackageShowLayoutProps) {

    return (
        <>
            {disableNav ? null : (
                <>
                    <Navbar />
                    <div className="p-4">
                        <Button onClick={() => window.history.back()} className="text-sm cursor-pointer flex items-center gap-2 btn-primary">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </div>
                </>
            )}
            
            
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