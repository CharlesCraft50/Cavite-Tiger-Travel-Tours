import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ExternalLink } from 'lucide-react';

export default function CancellationPolicy({disableNav} : {disableNav?: boolean;}) {
    return (
        <DashboardLayout title="Cancellation Policy" href="/cancellation-policy" disableNav={disableNav}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex flex-col overflow-hidden rounded-xl border md:min-h-min p-6">
                <h1 className="text-2xl font-semibold">Cancellation Policy</h1>
                <section className="mx-auto px-4 py-8 space-y-6 text-gray-700">
                    <h1 className="mb-4 text-1xl font-semibold uppercase">
                        Cavite Tiger Travel and Tours Corporation Cancellation Policy
                    </h1>
                    
                    <p>
                        We, <strong>CAVITE TIGER TRAVEL AND TOURS CORPORATION</strong>, understand that plans can change. 
                        This Cancellation Policy outlines the terms, conditions, and procedures regarding cancellations, 
                        rescheduling, and refunds for any of our tour packages, rentals, or travel services.
                    </p>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">1. General Cancellation Rules</h2>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                <strong>Strictly NO DEPOSIT, NO BOOKING policy.</strong> Bookings are only confirmed once a reservation fee or deposit is received.
                            </li>
                            <li>
                                All deposits are <strong>NON-REFUNDABLE</strong> under any circumstance. However, they may be 
                                <strong> TRANSFERABLE</strong> to another person, provided the original client gives consent.
                            </li>
                            <li>
                                Cancellation requests made <strong>at least seven (7) days before departure</strong> may be 
                                eligible for <strong>rescheduling</strong> to another available date.
                            </li>
                            <li>
                                Cancellations made <strong>less than seven (7) days before departure</strong> will not be 
                                eligible for rescheduling or refund.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">2. Rescheduling and Rebooking</h2>
                        <p>
                            Clients who wish to reschedule their trip must notify our team at least seven (7) days before 
                            the original travel date. Approval is subject to availability and operational feasibility.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Only one (1) reschedule per booking is allowed.</li>
                            <li>Rebooking fees may apply depending on the change in destination, date, or transportation cost.</li>
                            <li>
                                If the client is unable to travel and wishes to transfer the booking, the new traveler must 
                                comply with all required travel documentation.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">3. Force Majeure and Unforeseen Events</h2>
                        <p>
                            In cases of natural disasters, government restrictions, or other circumstances beyond our control, 
                            <strong> Cavite Tiger Travel and Tours Corporation</strong> reserves the right to postpone or 
                            cancel tours for safety reasons.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                Clients may be offered an option to rebook on a future date or use the paid amount as credit 
                                for another service.
                            </li>
                            <li>
                                Refunds will not be issued due to force majeure, but we will make every effort to accommodate 
                                rescheduling options.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">4. Late Arrivals and No-Shows</h2>
                        <p>
                            Failure to appear at the designated meeting point or departure time will be considered a 
                            <strong> no-show</strong>. The client forfeits all payments made, and no refunds or reschedules 
                            will be granted.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Please arrive at least 30 minutes before the scheduled departure time.</li>
                            <li>No-show passengers are not entitled to any refund or rebooking credit.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">5. Changes by the Company</h2>
                        <p>
                            We reserve the right to modify or cancel tours in cases where it is necessary to ensure the safety 
                            and satisfaction of our clients. This includes itinerary adjustments, transportation changes, or 
                            cancellation of specific destinations due to weather or operational concerns.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>
                                Clients will be informed as soon as possible if a change or cancellation occurs.
                            </li>
                            <li>
                                If an alternative service is not acceptable, clients may choose to rebook on another available 
                                schedule or receive equivalent travel credit.
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">6. Refunds</h2>
                        <p>
                            As stated, <strong>all deposits and reservation fees are non-refundable</strong>. Refunds may only 
                            be granted in exceptional cases where <strong>Cavite Tiger Travel and Tours Corporation</strong> 
                            cancels the tour due to internal reasons not related to force majeure.
                        </p>
                        <ul className="list-disc ml-6 space-y-2">
                            <li>Approved refunds will be processed within 15–30 business days.</li>
                            <li>Refunds will be issued to the same payment method used for the original booking.</li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
                        <p>
                            For questions, clarifications, or to request a cancellation or rebooking, please reach out to us through:
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
