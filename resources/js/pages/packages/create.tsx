import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { LoaderCircle } from 'lucide-react';
import FormLayout from "@/layouts/form-layout";
import { Label } from "@/components/ui/label";
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function index() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: ''
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/create-packages');
    }

    return (
        <FormLayout title="Create a Package" description="Enter the package details below to create a new package">

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="first_name"
                            value={data.first_name}
                            disabled={processing}
                            placeholder="First Name"
                            onChange={(e) => setData('first_name', e.target.value)}
                            />
                            <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    {/* Last Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="last_name"
                            value={data.last_name}
                            disabled={processing}
                            placeholder="Last Name"
                            onChange={(e) => setData('last_name', e.target.value)}
                            />
                            <InputError message={errors.last_name} className="mt-2" />
                    </div>
                </div>

                <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Create
                </Button>
        </form>
        </FormLayout>
        
    );
}