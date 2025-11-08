import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { normalizePhoneNumber, normalizePHNumber } from "@/lib/utils";


type RegisterForm = {
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        contact_number: '',
        address: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [rawPhone, setRawPhone] = useState(''); // full +63...
    const [phoneNumber, setPhoneNumber] = useState(''); // stripped number
    const [currentCountryCode, setCurrentCountryCode] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (currentCountryCode == null) {
            setContactNumberError('Please choose your country code.');
            return;
        }

        if (currentCountryCode == null) {
            setContactNumberError('Please choose your country code.');
            return;
        }

        const normalized = normalizePhoneNumber(rawPhone, currentCountryCode);

        let normalizedFormattedPhone = null;

        if (currentCountryCode == 'PH') {
            normalizedFormattedPhone = normalizePHNumber(rawPhone);
        }

        if (!rawPhone) {
            setContactNumberError("Contact number is required.");
            return;
        }

        if (!normalized) {
            setContactNumberError('Contact Number error.');
            return;
        }

        if (normalized.national.replace(/\D/g, '').length !== 11) {
            setContactNumberError('Contact Number must be exactly 11 digits.');
            return;
        }

        setData('contact_number', normalized?.e164 ?? normalizedFormattedPhone ?? rawPhone);

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout className="bg-[url('/images/bg/gradient_bg_1.jpg')] bg-cover" title="Create an account" description="Enter your details below to create your account" hasBackButton>
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="flex gap-6 items-start">
                        <div className="grid gap-2">
                            <Label htmlFor="name" required>First Name</Label>
                            <Input
                                id="first_name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                disabled={processing}
                                placeholder="First name"
                            />
                            <InputError message={errors.first_name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="name" required>Last Name</Label>
                            <Input
                                id="last_name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                disabled={processing}
                                placeholder="Last name"
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="contact_number" required>Contact Number</Label>
                        <PhoneInput
                            country={'ph'}
                            value={rawPhone}
                            disabled={processing}
                            placeholder="Ex. +639123456789"
                            onChange={(fullValue: string, data: any) => {
                                setRawPhone(fullValue);
                                setCurrentCountryCode(data.countryCode?.toUpperCase() || 'PH');
                                setPhoneNumber(fullValue.replace(`+${data.dialCode}`, '').trim());
                                setData('contact_number', fullValue);
                                setContactNumberError('');
                            }}
                            isValid={(value, country) => {
                                // optional validation
                                const digits = value.replace(/\D/g, '');
                                return digits.length >= 10;
                            }}
                            countryCodeEditable={false}
                            enableSearch={true}
                            containerClass="w-full"
                            inputClass="!w-full !px-12 !bg-white dark:!bg-neutral-900 dark:!text-white dark:!border-neutral-700 !border !rounded-lg !px-3 !py-2 !text-sm"
                            buttonClass="!bg-white dark:!bg-neutral-900 dark:!border-neutral-700"
                            dropdownClass="dark:!bg-neutral-900 dark:!text-white"
                        />
                        <InputError message={contactNumberError} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address" required>Address</Label>
                        <Input
                            id="address"
                            type="text"
                            required
                            tabIndex={2}
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            disabled={processing}
                            placeholder="Your Address"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email" required>Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" required>Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" required>Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
