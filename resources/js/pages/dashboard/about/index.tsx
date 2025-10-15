import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ExternalLink } from 'lucide-react';

export default function Index({disableNav} : {disableNav?: boolean;}) {
    return (
        <DashboardLayout title="Information" href="/dashboard/about" disableNav={disableNav}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex flex-col justify-center items-center overflow-hidden rounded-xl border md:min-h-min p-4">
                <h1 className="mb-4 text-3xl font-semibold">About</h1>
                <img 
                    src="https://i.ibb.co/SDVcHC60/dawdasdasd.png" 
                    className="w-[30%] h-[30%] object-contain" 
                />
                <section className="max-w-5xl mx-auto px-6 py-16 space-y-10 text-gray-700">
                    <div>
                        <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
                        <p>
                            Cavite Tiger Travel & Tours is a proudly local travel agency based in Cavite,
                            Philippines. We specialize in crafting personalized and exciting tour experiences
                            across Luzon and beyond, offering packages that cater to solo travelers, families,
                            barkadas, and corporate groups.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4">What We Offer</h2>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Customized Tour Packages for Local and International Destinations</li>
                            <li>Comfortable Van Rentals with Professional Drivers</li>
                            <li>Affordable Pricing with Flexible Inclusions</li>
                            <li>Safe and Hassle-Free Booking Experience</li>
                            <li>Guided Group Tours and Educational Trips</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
                        <p>
                            To provide every traveler with the opportunity to explore the beauty of the
                            Philippines while experiencing comfort, safety, and top-notch customer service.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold mb-4">Connect With Us</h2>
                        <p>
                            We’d love to hear from you! Visit us on Facebook or reach out through our contact
                            details below:
                        </p>
                        <a
                            href="https://web.facebook.com/TigertoursinCavite/?ref=page_internal"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="default" className="mt-4 flex gap-2 items-center">
                            <ExternalLink className="w-4 h-4" />
                            Facebook Page
                            </Button>
                        </a>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
