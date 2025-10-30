import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ExternalLink } from 'lucide-react';

export default function Certifications({disableNav} : {disableNav?: boolean;}) {
    return (
        <DashboardLayout title="Certifications" href="/certifications" disableNav={disableNav}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex flex-col justify-center items-center overflow-hidden rounded-xl border md:min-h-min p-4">
                <h1 className="mb-8 text-3xl font-semibold">Certifications</h1>
                <div className="grid grid-cols-2 gap-12">
                    <img 
                        src="images/certificates/CAITO.jpg"
                        className="max-w-sm max-h-sm object-contain border-4" 
                    />
                    <img 
                        src="images/certificates/DOT Accreditation Cert.png"
                        className="max-w-sm max-h-sm object-contain border-4" 
                    />
                    <img 
                    src="images/certificates/COT 2.png"
                        className="max-w-sm max-h-sm object-contain border-4" 
                    />
                    <img 
                        src="images/certificates/PHILTOA.png"
                        className="max-w-sm max-h-sm object-contain border-4" 
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
