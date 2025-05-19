// Components
import { TourPackage } from '@/types';

export default function index({ packages }: { packages: TourPackage[] }) {
    return (
        <div className="p-8">
            {packages.map(pkg => (
                <div key={pkg.id}>
                    <h2 className="text-xl font-semibold">{pkg.title}</h2>
                </div>
            ))}
        </div>
    );
}

