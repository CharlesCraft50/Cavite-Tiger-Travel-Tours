import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import StyledFileUpload from '@/components/styled-file-upload';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { normalizePhoneNumber, normalizePHNumber } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    first_name: string;
    last_name: string;
    contact_number: string;
    address: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(auth.user.profile_photo);
    const [profilePhotoError, setProfilePhotoError] = useState('');

    const [rawPhone, setRawPhone] = useState(''); // full +63...
    const [phoneNumber, setPhoneNumber] = useState(''); // stripped number
    const [currentCountryCode, setCurrentCountryCode] = useState('');
    const [contactNumberError, setContactNumberError] = useState('');

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        first_name: auth.user.first_name,
        last_name: auth.user.last_name,
        contact_number: auth.user.contact_number,
        address: auth.user.address,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
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

        formData.append('contact_number', normalized?.e164 ?? normalizedFormattedPhone ?? rawPhone);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('address', data.address);
        formData.append('email', data.email);
        formData.append('_method', 'patch');

        if (profilePhoto != null) {
            formData.append('profile_photo', profilePhoto);
        }

        router.post(route('profile.update'), formData, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                console.log('Profile Updated!');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and email address" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className='grid gap-2'>
                            <Label htmlFor="profile_image">Profile image</Label>
                            <div className="flex flex-row gap-4">
                                <StyledFileUpload
                                    id="profile_image"
                                    label="Upload your profile image"
                                    required
                                    accept="image/*"
                                    value={profilePhoto}
                                    error={profilePhotoError}
                                    description="Upload a clear photo for your profile picture."
                                    supportedFormats="JPG, PNG, GIF"
                                    maxSize="10MB"
                                    onChange={(file) => {
                                        if (Array.isArray(file)) {
                                            setProfilePhoto(file[0]);
                                        } else {
                                            setProfilePhoto(file);
                                        }

                                        if (file) {
                                            const url = Array.isArray(file) ? URL.createObjectURL(file[0]) : URL.createObjectURL(file);
                                            setImagePreview(url);
                                            setProfilePhotoError("");
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
                            </div>

                            <InputError message={profilePhotoError} className="mt-2" />
                                    
                        </div>
                        <div className="flex gap-6 items-start">

                            <div className="grid gap-2">
                            <Label htmlFor="first_name">First Name</Label>

                            <Input
                                id="first_name"
                                className="mt-1 block w-full"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="First Name"
                            />

                            <InputError className="mt-2" message={errors.first_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="last_name">Last Name</Label>

                            <Input
                                id="last_name"
                                className="mt-1 block w-full"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Last Name"
                            />

                            <InputError className="mt-2" message={errors.last_name} />
                        </div>
                        </div>

                        <div className="grid gap-4">
                            <Label htmlFor="contact_number">Contact Number</Label>
                            <PhoneInput
                                country={'ph'}
                                value={auth.user.contact_number}
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
                                    const digits = value.replace(/\D/g, '');
                                    return digits.length >= 10;
                                }}
                                countryCodeEditable={false}
                                enableSearch={true}
                            />
                            <InputError message={contactNumberError} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>

                            <Input
                                id="address"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                required
                                autoComplete="address"
                                placeholder="Full address"
                            />

                            <InputError className="mt-2" message={errors.address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>

                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />

                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="text-muted-foreground -mt-4 text-sm">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>

                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
