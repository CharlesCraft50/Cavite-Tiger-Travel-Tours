import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormLayout from "@/layouts/form-layout";
import PageLayout from "@/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { BookingPayment, SharedData } from "@/types";
import InputError from "@/components/input-error";
import clsx from "clsx";
import StyledFileUpload from "@/components/styled-file-upload";
import QRCodeModal from "@/components/qr-code-modal";

type PaymentProps = {
    booking_id: number;
    booking_payment?: BookingPayment;
}

export default function Payment({ 
    booking_id,
    booking_payment,
} : PaymentProps) {
    const { data, setData, post, processing, errors } = useForm<{
        payment_method: string,
        reference_number: string,
        payment_proof: File | null,
    }>({
        payment_method: 'gcash',
        reference_number: '',
        payment_proof: null,
    });

    useEffect(() => {
        setData('payment_method', booking_payment?.payment_method ?? '');
        setData('reference_number', booking_payment?.reference_number ?? '');
    }, [booking_payment]);

    const [imagePreview, setImagePreview] = useState('');
    const [paymentProofError, setPaymentProofError] = useState('');

    const { auth } = usePage<SharedData>().props;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if(!data.payment_proof) {
            setPaymentProofError('Please upload your proof of payment image');
            return;
        }

        setPaymentProofError('');

        const formData = new FormData();
        formData.append('booking_id', booking_id.toString());
        formData.append('payment_method', 'gcash');
        formData.append('reference_number', data.reference_number);
        formData.append('payment_proof', data.payment_proof);
        
        router.post(route('booking.payment.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error("Payment error:", errors);
            }
        });
    }

    const [selectedQR, setSelectedQR] = useState<string | null>(null);

  return (
    <FormLayout
        title={booking_payment?.status === 'declined' ? '❌ Payment Declined – Resubmit Required' : 'Booking Pending'}
        description="To confirm your booking, please pay using GCash and provide the reference number and a screenshot of your payment."
    >
        <Head title="Payment" />
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className={clsx(
                "rounded-lg border p-4 text-sm space-y-2",
                booking_payment?.status === 'declined'
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-yellow-50 border-yellow-300 text-yellow-900"
            )}>
                {booking_payment?.status === 'declined' ? (
                    <>
                        <p className="font-semibold text-base">❌ Payment Declined</p>
                        <p>
                            Your previous payment was <strong>declined</strong>. Please double-check your payment details and resubmit a valid proof of payment.
                        </p>
                        <ul className="list-disc list-inside">
                            <li>Ensure your <strong>reference number</strong> is correct</li>
                            <li>Upload a <strong>clear screenshot</strong> of the transaction</li>
                        </ul>
                        <p>
                            You can resubmit now or return later using this link:
                            <br />
                            <a
                                href={`/book-now/payment/${booking_id}`}
                                className="text-blue-700 hover:underline"
                            >
                                {window.location.origin}/book-now/payment/{booking_id}
                            </a>
                        </p>
                    </>
                ) : (
                    <>
                        <p className="font-semibold text-base">✅ Booking Created! Payment Needed to Confirm</p>
                        <p>
                            Your booking has been successfully created, but it's <strong>not confirmed yet</strong>.
                        </p>
                        <ul className="list-disc list-inside">
                            <li>Pay via <strong>GCash</strong></li>
                            <li>Submit your <strong>reference number</strong> and <strong>proof of payment</strong></li>
                        </ul>
                        <p>
                            You can do this now or come back later — just don’t forget!
                        </p>
                        <p>
                            Or visit this link again anytime:{" "}
                            <a
                                href={`/book-now/payment/${booking_id}`}
                                className="text-blue-700 hover:underline"
                            >
                                {window.location.origin}/book-now/payment/{booking_id}
                            </a>
                        </p>
                        {auth.user && (
                            <p className="text-green-800">
                                🔎 You can also check and complete your payment anytime from your <strong>dashboard</strong>.
                            </p>
                        )}
                    </>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="payment_method" required>Payment Method</Label>
                <select
                    id="payment_method"
                    value={data.payment_method}
                    onChange={(e) => setData('payment_method', e.target.value)}
                >
                    <option value="gcash">GCash</option>
                </select>
                
            </div>

            <div className="grid gap-2">
                <Label htmlFor="reference_number" required>Reference No.</Label>
                <Input
                    type="text"
                    id="reference_number"
                    value={data.reference_number}
                    onChange={(e) => setData('reference_number', e.target.value)}
                    placeholder="Enter the 12-digit reference number"
                    required
                />

                <InputError message={errors.reference_number} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <StyledFileUpload
                    id="payment_proof"
                    label="Upload Proof of Payment"
                    required
                    accept="image/*"
                    value={data.payment_proof}
                    error={paymentProofError}
                    description="Upload a clear screenshot or photo of your payment receipt."
                    supportedFormats="JPG, PNG, GIF"
                    maxSize="10MB"
                    onChange={(file) => {
                        setData("payment_proof", file);
                        if (file) {
                            const url = URL.createObjectURL(file);
                            setImagePreview(url);
                            setPaymentProofError("");
                        } else {
                            setImagePreview("");
                        }
                    }}
                />
                {imagePreview && (
                    <img
                        src={imagePreview}
                        className="w-40 max-w-full rounded-lg border border-gray-300 mt-2 object-contain"
                    />
                )}
                <InputError message={paymentProofError} className="mt-2" />

            </div>

            <div className="flex flex-col items-center gap-4 p-4">
                <p className="text-center text-sm font-medium mb-2">
                    You can pay using one of these QR codes. Please choose only one. <br />
                    Tap/click the QR code to view it in fullscreen.
                </p>


                <div className="flex flex-col sm:flex-row sm:gap-6 items-center">
                    <QRCodeModal qrImages={[
                        "https://i.ibb.co/1Yyrzxfv/IMG-3230.jpg",
                        "https://i.ibb.co/p6vd0PRt/IMG-3229.jpg"
                    ]} />
                </div>
            </div>


            <Button type="submit" className="mt-2 w-full btn-primary -md cursor-pointer" tabIndex={5} disabled={processing}>
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                SUBMIT
            </Button>
        </form>
    </FormLayout>
  )
}
