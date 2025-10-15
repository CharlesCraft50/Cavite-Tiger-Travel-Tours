import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ExternalLink } from 'lucide-react';

export default function PrivacyPolicy({disableNav} : {disableNav?: boolean;}) {
    return (
        <DashboardLayout title="Privacy Policy" href="/privacy-policy" disableNav={disableNav}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex flex-col overflow-hidden rounded-xl border md:min-h-min p-6">
                <h1 className="text-2xl font-semibold">Privacy Policy</h1>
                  <section className="mx-auto px-4 py-8 space-y-6 text-gray-700">
                    <h1 className="mb-4 text-1xl font-semibold uppercase">
                      Cavite Tiger Travel and Tours Corporation Privacy Policy
                    </h1>
                    <p>
                        We, <strong>CAVITE TIGER TRAVEL AND TOURS CORPORATION</strong>, are committed to protecting and securing
                        the personal information you entrust to us. This Privacy Policy is aligned with the requirements of the
                        <strong> Republic Act No. 10173</strong>, also known as the <strong>Data Privacy Act of 2012 (DPA)</strong>,
                        and its Implementing Rules and Regulations.
                    </p>

                    <p>
                        By engaging with our travel and tour services, you agree to the collection, use, and processing of your
                        Personal Data as described in this policy.
                    </p>

                    {/* 1. The Personal Data We Collect */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">1. The Personal Data We Collect</h2>
                        <p>
                            We collect various types of Personal Data and Sensitive Personal Information as defined under the DPA,
                            which are necessary to process your travel bookings and provide our services.
                        </p>

                        <h3 className="text-xl font-semibold mt-4 mb-2">A. Personal Information</h3>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Identity and Contact Details:</strong> Full name, home address, email address, and phone numbers.</li>
                            <li><strong>Booking and Transaction Data:</strong> Reservation details, travel dates, trip itinerary, and payment information (e.g., online bank applications, bank account information).</li>
                            <li><strong>Travel Preferences:</strong> Seat preferences, preferred travel vehicle, and location preferences.</li>
                        </ul>

                        <h3 className="text-xl font-semibold mt-4 mb-2">B. Sensitive Personal Information</h3>
                        <p>
                            <em>Note:</em> We will seek your explicit consent before collecting and processing any Sensitive Personal Information, unless otherwise provided for by law.
                        </p>
                    </div>

                    {/* 2. How We Collect Your Personal Data */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">2. How We Collect Your Personal Data</h2>
                        <p>We collect your data through the following methods:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Directly from You:</strong> When you inquire, book, or purchase services via our website, phone, email, chat, or in person at our office.</li>
                            <li><strong>From Third-Party Partners:</strong> When we receive your booking details from an airline, hotel, tour operator, or a third-party booking platform to fulfill your reservation.</li>
                            <li><strong>Through Your Use of Our Digital Channels:</strong> Through our website's use of cookies and tracking technologies to monitor and improve your browsing experience.</li>
                        </ul>
                    </div>

                    {/* 3. Purpose for Collecting */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">3. Purpose for Collecting and Processing Your Personal Data</h2>
                        <p>We process your Personal Data solely for the following legitimate purposes:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>To Fulfill Your Bookings and Services:</strong> To process and confirm your travel, hotel, tour, or transport reservations.</li>
                            <li><strong>To Process Payment:</strong> To manage payments, billing, and accounting for the services you purchase.</li>
                            <li><strong>To Comply with Legal Requirements:</strong> To facilitate necessary immigration, customs, security, or government reporting requirements.</li>
                            <li><strong>To Communicate:</strong> To send you travel confirmations, updates, alerts, and to respond to your inquiries and requests.</li>
                            <li><strong>For Marketing and Promotions (with your consent):</strong> To send you newsletters, special offers, and promotional materials related to our services.</li>
                        </ul>
                    </div>

                    {/* 4. Sharing and Disclosure */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">4. Sharing and Disclosure of Personal Data</h2>
                        <p>
                            To successfully provide your travel services, we will share your Personal Data with necessary third parties.
                            We will ensure that these parties are also bound by a duty of confidentiality and are required to comply with
                            the DPA.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Airlines, Hotels, and Travel Suppliers:</strong> To process the services you have booked (e.g., sharing your passport and health information with the airline for international travel).</li>
                            <li><strong>Third-Party Service Providers:</strong> Such as payment processors, IT service providers, and cloud storage providers who assist in our business operations.</li>
                            <li><strong>Government and Law Enforcement Agencies:</strong> When required by law, subpoena, or to comply with official processes (e.g., the National Privacy Commission or other regulatory bodies).</li>
                        </ul>
                    </div>

                    {/* 5. Security */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">5. Security and Protection of Personal Data</h2>
                        <p>
                            We implement reasonable and appropriate organizational, technical, and physical security measures to protect
                            your Personal Data against accidental or unlawful destruction, alteration, unauthorized disclosure, or access.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Technical Security:</strong> Use of firewalls, encryption (e.g., SSL), and access control in our information systems.</li>
                            <li><strong>Organizational Security:</strong> Limited access to Personal Data for authorized personnel only, and regular training on data privacy and security.</li>
                            <li><strong>Physical Security:</strong> Secured storage of physical documents and restricted access to our data processing facilities.</li>
                        </ul>
                    </div>

                    {/* 6. Retention and Disposal */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">6. Retention and Disposal</h2>
                        <p>
                            We will retain your Personal Data only for as long as necessary to fulfill the purposes for which it was
                            collected and to comply with legal, accounting, and reporting requirements.
                        </p>
                        <p>
                            Once the data is no longer necessary for the stated purposes, it will be disposed of or securely anonymized to
                            prevent further processing or unauthorized access.
                        </p>
                    </div>

                    {/* 7. Rights */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">7. Your Rights as a Data Subject</h2>
                        <p>Under the Data Privacy Act of 2012, you have the following rights, which we are committed to upholding:</p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li><strong>Right to Be Informed:</strong> To be informed that your Personal Data will be, is being, or has been processed.</li>
                            <li><strong>Right to Object:</strong> To withhold consent or object to the processing of your Personal Data.</li>
                            <li><strong>Right to Access:</strong> To reasonably request access to the contents of your Personal Data.</li>
                            <li><strong>Right to Rectification:</strong> To dispute and have any inaccuracy or error in your Personal Data corrected.</li>
                            <li><strong>Right to Erasure or Blocking:</strong> To suspend, withdraw, or order the blocking, removal, or destruction of your Personal Data from our filing system.</li>
                            <li><strong>Right to Damages:</strong> To be indemnified for any damages sustained due to inaccurate, incomplete, outdated, false, unlawfully obtained, or unauthorized use of your Personal Data.</li>
                        </ul>
                    </div>

                    {/* 8. Contact */}
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                        <p>
                            If you have any questions, concerns, or wish to expand your information, please reach out through our contact
                            details below:
                        </p>
                        <div className="pt-6 text-center">
                            <a
                                href="https://web.facebook.com/TigertoursinCavite/?ref=page_internal"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="default" className="mt-4 flex gap-2 items-center mx-auto">
                                    <ExternalLink className="w-4 h-4" />
                                    Visit Facebook Page
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}
