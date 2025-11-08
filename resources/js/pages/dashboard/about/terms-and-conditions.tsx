import { Button } from '@/components/ui/button';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ExternalLink } from 'lucide-react';

export default function TermsAndConditions({disableNav} : {disableNav?: boolean;}) {
    return (
        <DashboardLayout title="Terms and Conditions" href="/terms-and-conditions" disableNav={disableNav}>
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex flex-col justify-center overflow-hidden rounded-xl border md:min-h-min p-6">
               <h1 className="text-2xl font-semibold">Terms and Conditions</h1>
                  <section className="mx-auto px-4 py-8 space-y-6 text-gray-700">
                    <h1 className="mb-4 text-1xl font-semibold uppercase">
                      Cavite Tiger Travel and Tours Corporation Terms and Conditions
                    </h1>
                    <ol className="list-decimal ml-6 space-y-4 px-4">
                        <li>
                            <strong>Strictly NO DEPOSIT, NO BOOKING policy.</strong>
                        </li>
                        <li>
                            All deposits are <strong>NON-REFUNDABLE</strong> under any circumstance. However,
                            they are <strong>TRANSFERABLE</strong> to others as long as permitted by the person
                            whose name appears on the booking/reservation details.
                        </li>
                        <li>
                            <strong>RESERVATION FEE</strong> can be applied to rescheduling at least
                            <strong> seven (7) days</strong> before the scheduled departure.
                        </li>
                        <li>
                            <strong>No additional fees/charges</strong> unless the pick-up location and destination have to
                            change; in such cases, <strong>rate adjustments</strong> may apply.
                        </li>
                        <li>
                            Before a deposit/reservation is made, it is expected and presumed that the
                            renter/client has <strong>READ AND AGREED</strong> to the Terms and Conditions of
                            Cavite Tiger Travel and Tours.
                        </li>

                        {/* Extra Professional Clauses Below */}
                        <li>
                            <strong>Payment Terms:</strong> Full payment must be settled before the day of departure unless otherwise agreed upon in writing. Failure to pay the remaining balance may result in the cancellation of the booking.
                        </li>
                        <li>
                            <strong>Travel Itinerary Changes:</strong> The company reserves the right to adjust the itinerary due to unforeseen circumstances such as weather conditions, traffic, or other events beyond our control.
                        </li>
                        <li>
                            <strong>Force Majeure:</strong> Cavite Tiger Travel and Tours shall not be held liable for delays, cancellations, or damages caused by natural disasters, government restrictions, or other circumstances beyond our control.
                        </li>
                        <li>
                            <strong>Passenger Conduct:</strong> Passengers are expected to behave responsibly. Any behavior causing damage to the vehicle, disruption of the tour, or discomfort to others may result in termination of the service without refund.
                        </li>
                        <li>
                            <strong>Liability Disclaimer:</strong> Cavite Tiger Travel and Tours is not responsible for loss or damage of personal belongings, injuries, or accidents during the tour unless directly caused by negligence on the part of the company.
                        </li>
                    </ol>

                    <div className="pt-8 text-center">
                        <p className="text-gray-600">
                            For inquiries or clarifications, please reach out through our official Facebook page:
                        </p>
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
                </section>
            </div>
        </DashboardLayout>
    );
}
