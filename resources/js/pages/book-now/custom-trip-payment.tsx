import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormLayout from "@/layouts/form-layout";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { Booking, BookingPayment, CustomTrip, CustomTripPayment, SharedData } from "@/types";
import InputError from "@/components/input-error";
import clsx from "clsx";
import StyledFileUpload from "@/components/styled-file-upload";
import QRCodeModal from "@/components/qr-code-modal";
import PriceSign from "@/components/price-sign";

type PaymentProps = {
    trip_id: number;
    trip: CustomTrip;
    trip_payment?: CustomTripPayment;
}

export default function Payment({ 
    trip_id,
    trip,
    trip_payment,
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
        setData('payment_method', trip_payment?.payment_method ?? 'gcash');
        setData('reference_number', trip_payment?.reference_number ?? '');
    }, [trip_payment]);

    const [imagePreview, setImagePreview] = useState('');
    const [paymentProofError, setPaymentProofError] = useState('');

    const { auth } = usePage<SharedData>().props;

    const qrImages = [
        `${import.meta.env.BASE_URL}images/payment_methods/IMG-3230.jpg`, // GCash
        `${import.meta.env.BASE_URL}images/payment_methods/IMG-3229.jpg`, // BPI
    ];

    const selectedQR = data.payment_method === "gcash" ? qrImages[0] : qrImages[1];
    const showReferenceNumber = data.payment_method === "gcash" || data.payment_method === "bpi";

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if(!data.payment_proof) {
            setPaymentProofError('Please upload your proof of payment image');
            return;
        }

        setPaymentProofError('');

        const formData = new FormData();
        formData.append('custom_trip_id', trip_id.toString());
        formData.append('payment_method', data.payment_method);
        if (showReferenceNumber) formData.append('reference_number', data.reference_number);
        formData.append('payment_proof', data.payment_proof);
        
        router.post(route('customTrip.payment.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {},
            onError: (errors) => console.error("Payment error:", errors)
        });
    }

    return (
        <FormLayout
            title={trip_payment?.status === 'declined' ? '❌ Payment Declined – Resubmit Required' : 'Booking Pending'}
            description="To confirm your booking, please pay using GCash or BPI and provide a screenshot of your payment."
            hasBackButton
        >
            <Head title="Payment" />
            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className={clsx(
                    "rounded-lg border p-4 text-sm space-y-2",
                    trip_payment?.status === 'declined'
                        ? "bg-red-50 border-red-300 text-red-800"
                        : "bg-yellow-50 border-yellow-300 text-yellow-900"
                )}>
                    {trip_payment?.status === 'declined' ? (
                        <>
                            <p className="font-semibold text-base">❌ Payment Declined</p>
                            <p>
                                Your previous payment was <strong>declined</strong>. Please double-check your payment details and resubmit a valid proof of payment.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-base">✅ Booking Created! Payment Needed to Confirm</p>
                            <p>Your booking has been successfully created, but it's <strong>not confirmed yet</strong>.</p>
                        </>
                    )}
                </div>

                {/* Payment Method */}
                <div className="grid gap-2">
                    <Label htmlFor="payment_method" required>Payment Method</Label>
                    <select
                        id="payment_method"
                        value={data.payment_method}
                        onChange={(e) => {
                            setData('payment_method', e.target.value);
                            setData("payment_proof", null);
                            setImagePreview("");
                            setPaymentProofError("");
                            setData('reference_number', ''); 
                        }}
                        className="border px-3 py-2 rounded-md"
                    >
                        <option value="gcash">GCash</option>
                        <option value="bpi">BPI</option>
                    </select>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-4 p-4">
                    <p className="text-center text-sm font-medium mb-2">
                        You can pay using the QR code below. <br />
                        Tap/click the QR code to view it in fullscreen.
                    </p>
                    <QRCodeModal qrImages={[selectedQR]} />
                </div>

                {/* Reference Number only for GCash */}
                {showReferenceNumber && (
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
                )}

                {/* Upload Proof of Payment */}
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
                            if (Array.isArray(file)) {
                                setData("payment_proof", file[0]);
                            } else {
                                setData("payment_proof", file);
                            }

                            if (file) {
                                const url = Array.isArray(file) ? URL.createObjectURL(file[0]) : URL.createObjectURL(file);
                                setImagePreview(url);
                                setPaymentProofError("");
                            } else {
                                setImagePreview("");
                            }
                        }}
                    />
                    {/* {imagePreview && (
                        <img
                            src={imagePreview}
                            className="w-40 max-w-full rounded-lg border border-gray-300 mt-2 object-contain"
                        />
                    )} */}
                    <InputError message={paymentProofError} className="mt-2" />
                </div>
                
                <div className="flex justify-end">
                    <div className="text-right">
                        <p className="text-lg font-semibold">Total Amount</p>
                        <div className="flex flex-row items-center font-semibold text-primary text-2xl">
                            <PriceSign />
                            <p>{(Number(trip.total_amount ?? 0)).toLocaleString("en-US", {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}</p>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="mt-2 w-full btn-primary -md cursor-pointer" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    SUBMIT
                </Button>
            </form>
        </FormLayout>
    );
}
