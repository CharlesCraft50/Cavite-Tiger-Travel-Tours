import { PreferredVan, User } from "@/types";

import clsx from "clsx";
import { Label } from "./ui/label";
import { Check, PencilIcon, PlusSquareIcon, TrashIcon, Undo, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { router } from "@inertiajs/react";
import { useLoading } from "./ui/loading-provider";
import { Input } from "./ui/input";
import ImageSimpleBox from "./ui/image-simple-box";
import DatePicker from "react-datepicker";
import PriceSign from "./price-sign";
import { format } from "date-fns";

type VanSelectionProps = {
    preferredVans: PreferredVan[];
    drivers?: User[],
    selectedVanIds?: number[];
    onSelect?: (vanId: number) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textLabel?: string;
    required?: boolean;
    editable?: boolean;
    selectable?: boolean;
    onSave?: (newVans: PreferredVan[]) => void;
};

export default function VanSelection({
    preferredVans,
    drivers = [],
    selectedVanIds,
    onSelect,
    onChange,
    textLabel,
    required,
    editable,
    selectable = true,
    onSave,
}: VanSelectionProps) {

    const { start, stop } = useLoading();

    interface EditablePreferredVan extends PreferredVan {
        action?: string;
        image_url_file?: File | null;
        isNew?: boolean;
    }

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [tempVans, setTempVans] = useState<EditablePreferredVan[]>(preferredVans);
    const [vanToDelete, setVanToDelete] = useState<EditablePreferredVan | null>(null);
    const lastAddedVanRef = useRef<HTMLInputElement | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [search, setSearch] = useState("");

    const filteredVans = useMemo(() => {
        return tempVans
            .filter(van =>
                van.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const aSelected = selectedVanIds?.includes(a.id) ? 1 : 0;
                const bSelected = selectedVanIds?.includes(b.id) ? 1 : 0;

                if (aSelected !== bSelected) {
                    return bSelected - aSelected; // Selected vans appear first
                }

                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Newer vans after
            });
    }, [search, tempVans, selectedVanIds]);

    
    const visibleVans = filteredVans.slice(0, visibleCount);

    useEffect(() => {
        if (!isEditing && preferredVans.length > 0) {
            setTempVans(preferredVans);
        }
    }, [preferredVans, isEditing]); 

    const toggleIsEditing = () => {
        if(isEditing) {
            setTempVans(preferredVans);
        }
        setIsEditing(!isEditing);
    }

    const handleAddVan = () => {
        const newId = -Date.now();
        const available_until = new Date();
        available_until.setFullYear(available_until.getFullYear() + 2);

        const newVan: EditablePreferredVan = {
            id: newId,
            name: `Van ${newId}`,
            image_url: '',
            additional_fee: 0,
            pax_adult: 1,
            pax_kids: 0,
            action: 'create',
            isNew: true,
            created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            availabilities: [
                {
                    id: Date.now(),
                    preferred_van_id: newId,
                    available_from: format(new Date(), "yyyy-MM-dd"),
                    available_until: format(available_until, "yyyy-MM-dd"),
                    count: 1
                }
            ],
        };

        setTempVans((prev) => [...prev, newVan])

        setTimeout(() => {
            if (lastAddedVanRef.current) {
                lastAddedVanRef.current.focus();
                lastAddedVanRef.current.select();
            }
        }, 100);
    }

    const handleSave = () => {
        if (isEditing) {

            start();
            const formData = new FormData();
            formData.append('_method', 'put');

            tempVans.forEach((van, index) => {
                formData.append(`vans[${index}][id]`, van.id.toString());
                if(van.user_id != null) {
                    formData.append(`vans[${index}][user_id]`, van.user_id?.toString());
                }
                formData.append(`vans[${index}][name]`, van.name);
                if(van.image_url_file) {
                    formData.append(`vans[${index}][image_url]`, van.image_url_file);
                }
                formData.append(`vans[${index}][additional_fee]`, van.additional_fee.toString());
                formData.append(`vans[${index}][pax_adult]`, van.pax_adult.toString());
                formData.append(`vans[${index}][pax_kids]`, van.pax_kids.toString());
                if(van.action !== undefined) {
                    formData.append(`vans[${index}][action]`, van.action);
                }
                if (van.availabilities) {
                    van.availabilities.forEach((availability, availIndex) => {
                        formData.append(`vans[${index}][availabilities][${availIndex}][available_from]`, availability.available_from ?? '');
                        formData.append(`vans[${index}][availabilities][${availIndex}][available_until]`, availability.available_until ?? '');
                        formData.append(`vans[${index}][availabilities][${availIndex}][count]`, availability.count?.toString() ?? '0');
                    });
                }
            });

            router.post(`/preferredvan/update`, formData, {
                onSuccess: () => {
                    const updatedVans = tempVans.filter((v) => v.action !== 'delete');
                    setTempVans(updatedVans);
                    onSave?.(updatedVans);
                    setIsEditing(false);
                    stop();
                },
                onError: () => {
                    setIsEditing(true);
                },
                preserveScroll: true,
                preserveState: true  
            });
        }
    };

    const handleDeletion = (van: EditablePreferredVan) => {
        if (van.isNew) {
            setTempVans(prev => prev.filter(v => v.id !== van.id));
        } else {
            setTempVans(prev =>
            prev.map(v => (v.id === van.id ? { ...v, action: 'delete' } : v))
            );
        }
        setVanToDelete(null);
    }

    const undoDeletion = (van: EditablePreferredVan) => {
        setTempVans((prev) =>
            prev.map((v) => 
                (v.id === van.id) ? { ...v, action: undefined } : v
            )
        );
        setVanToDelete(null);
    }

    const handleChange = (id: number, field: keyof EditablePreferredVan, value: any) => {
        setTempVans((prev) =>
            prev.map((van) =>
                van.id === id ? { ...van, [field]: value, action: van.action ?? 'update' } : van
            )
        );
    }

  return (
    <>
        <Label className="font-medium text-sm" required={required}>
            {textLabel}
        </Label>

        {/* Search Bar */}
        <input
            type="text"
            placeholder="Search vans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-non focus:ring-2 focus:ring-primary"
        />

        {onChange && (
            <div className="mb-2">
                <div className="flex items-center gap-2">
                    <input
                        id="select-all-vans"
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={preferredVans.length > 0 && selectedVanIds?.length === preferredVans.length}
                        onChange={onChange}
                    />
                    <label htmlFor="select-all-vans" className="text-sm font-medium text-gray-700">
                        Select All Preferred Vans
                    </label>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {editable && (
                <>
                    {isEditing && (
                        <div>
                            <div className="card flex flex-col items-center justify-center gap-4 p-4" onClick={handleSave}>
                                <Check className="w-24 h-24 text-gray-400" />
                                <p className="text-sm text-gray-500">Save</p>
                            </div>
                        </div>
                    )}

                    <div className="card flex flex-col items-center justify-center gap-4 p-4" onClick={toggleIsEditing}>
                        {isEditing ? (
                            <X className="w-24 h-24 text-gray-400" />
                        ) : (
                            <PencilIcon className="w-24 h-24 text-gray-400" />
                        )}
                        <p className="text-sm text-gray-500">{isEditing ? "Cancel Editing" : "Edit Vans"}</p>
                    </div>
                    
                </>
            )}

            {editable && (
                isEditing && (
                    <div className="card flex flex-col items-center justify-center gap-4 p-4" onClick={handleAddVan}>
                        <PlusSquareIcon className="w-24 h-24 text-gray-400" />
                        <p className="text-sm text-gray-500">Add Van</p>
                    </div>
                )
            )}
            {visibleVans?.map((van) => {
                const isSelected = selectedVanIds?.includes(van.id);

                return (
                    <div
                        key={van.id}
                        onClick={() => {
                            if(!isEditing && selectable) {
                                onSelect?.(van.id);
                            }
                        }}
                        className={clsx("card", isSelected && "selected", van.action == "delete" && "toDelete", !selectable && "cursor-default")}
                    >
                    {isEditing ? (
                        <div className="flex items-center justify-center">
                            <ImageSimpleBox
                                key={van.id}
                                id={`van-image-${van.id}`}
                                imagePreview={van.image_url}
                                setImagePreview={(e) => handleChange(van.id, 'image_url', e)}
                                setImageFile={(e) => handleChange(van.id, 'image_url_file', e)}
                                editable={isEditing}
                                className="w-full h-32"
                            />
                        </div>
                    ) : (
                        <img
                            src={van.image_url}
                            alt={van.name}
                            className="img-card"
                        />
                    )}
                    
                    {isSelected && !isEditing && (
                        <span className="selected-text">
                            Selected
                        </span>
                    )}

                    {editable && isEditing && (
                        <div 
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                                e.stopPropagation;

                                if (van.isNew) {
                                    handleDeletion(van);
                                    return;
                                }

                                if(van.action == 'delete') {
                                    undoDeletion(van);
                                } else {
                                    setVanToDelete(van);
                                }
                                
                            }}
                        >
                            {van.action === 'delete' ? (
                                <Undo className="w-8 h-8 p-2 border rounded bg-blue-400 cursor-pointer" />
                            ) : (
                                <TrashIcon className="w-8 h-8 p-2 border rounded bg-red-400 cursor-pointer" />
                            )}
                        </div>
                    )}
                    
                    <div className="mt-2">
                        <p className="text-lg font-semibold">
                            {isEditing ? (
                                <Input
                                    type="text"
                                    value={van.name}
                                    ref={van.isNew ? lastAddedVanRef : null}
                                    onChange={(e) => handleChange(van.id, 'name', e.target.value)}
                                    className="p-0 text-lg outline-none px-2 w-full font-semibold"
                                />
                            ) : (
                                `${van.name}`
                            )}
                        </p>

                        {isEditing ? (
                            <div className="flex justify-between">
                                <p>
                                    Adult:
                                    <Input
                                        type="number"
                                        min={1}
                                        value={van.pax_adult}
                                        onChange={(e) => handleChange(van.id, 'pax_adult', e.target.value)}
                                        className="p-0 text-lg outline-none px-2 w-full font-semibold"
                                    />
                                </p>
                                <p>
                                    Kids:
                                    <Input
                                        type="number"
                                        value={van.pax_kids}
                                        onChange={(e) => handleChange(van.id, 'pax_kids', e.target.value)}
                                        className="p-0 text-lg outline-none px-2 font-semibold"
                                    />
                                </p>
                            </div>
                            ) : (
                                <p className="text-sm text-gray-600">Adults: {van.pax_adult} | Kids: {van.pax_kids}</p>
                        )}

                        <p className="text-sm font-medium text-green-700">
                            {isEditing ? (
                                <span className="flex items-center">
                                    <PriceSign />
                                    <Input
                                        type="text"
                                        value={van.additional_fee}
                                        onChange={(e) => handleChange(van.id, 'additional_fee', e.target.value)}
                                        className="p-0 outline-none px-2 w-full"
                                    />
                                </span>
                            ) : (
                                <>
                                    +
                                    <PriceSign />
                                    {`${van.additional_fee.toLocaleString()}`}
                                </>
                            )}
                        </p>

                        <p className="text-sm font-medium mt-2">
                            {isEditing ? (
                                <div className="flex flex-col space-y-2">
                                    <p>Assigned Driver:</p>
                                    <select
                                        value={van.user_id ?? ''}
                                        onChange={(e) => handleChange(van.id, 'user_id', Number(e.target.value))}
                                        className="w-full text-md cursor-pointer p-1 border border-r-4"
                                    >
                                        <option value="">-- Select Driver --</option>
                                        {drivers?.map((driver) => (
                                            <option key={driver.id} value={driver.id}>
                                                {driver.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                               <div>
                                    {(van.driver?.name || drivers.find((d) => d.id === van.user_id)?.name) && (
                                        <p className="text-sm font-semibold">Assigned Driver</p>
                                    )}
                                    <p>
                                        {van.driver?.name ?? drivers.find((d) => d.id === van.user_id)?.name ?? ''}
                                    </p>
                                </div>
                            )}
                        </p>

                        <div>
                            {van.availabilities && (
                                <div className="mt-2 text-xs text-gray-600">
                                    <strong>Availability:</strong>
                                    {isEditing ? (
                                        <div className="border rounded-md p-2 bg-red-100">
                                            {van.availabilities.map((availability, i) => (
                                                <div key={van.id}>
                                                    <p className="text-md font-semibold mt-2">Available From</p>
                                                    <DatePicker
                                                        selected={availability.available_from ? new Date(availability.available_from) : null}
                                                        onChange={(date: Date | null) => {
                                                            if(date) {
                                                                const newAvailabilities = [...van.availabilities];
                                                                newAvailabilities[i] = {
                                                                    ...newAvailabilities[i],
                                                                    available_from: format(date, "yyyy-MM-dd"),
                                                                };
                                                                handleChange(van.id, 'availabilities', newAvailabilities);
                                                            }
                                                        }}
                                                        placeholderText="Available From"
                                                        dateFormat="yyyy-MM-dd"
                                                        className="w-full border px-3 py-2 rounded-md"
                                                    />

                                                    <p className="text-md font-semibold mt-2">Available Until</p>
                                                    <DatePicker 
                                                        selected={availability.available_until ? new Date(availability.available_until) : null}
                                                        onChange={(date: Date | null) => {
                                                            if(date) {
                                                                const newAvailabilities = [...van.availabilities];
                                                                newAvailabilities[i] = {
                                                                    ...newAvailabilities[i],
                                                                    available_until: format(date, "yyyy-MM-dd"),
                                                                }
                                                                handleChange(van.id, 'availabilities', newAvailabilities);
                                                            }
                                                        }}
                                                        placeholderText="Available Until"
                                                        dateFormat="yyyy-MM-dd"
                                                        className="w-full border px-3 py-2 rounded-md"
                                                    />

                                                    <p className="text-md font-semibold mt-2">No. of Vans Available</p>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={availability.count ?? 0}
                                                        onChange={(e) => {
                                                            const newAvailabilities = [...van.availabilities];
                                                            newAvailabilities[i] = {
                                                                ...newAvailabilities[i],
                                                                count: parseInt(e.target.value)
                                                            }
                                                            handleChange(van.id, 'availabilities', newAvailabilities);
                                                        }}
                                                        className="w-full"
                                                        placeholder="Count"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <ul className="list-disc ml-4">
                                            {van.availabilities.map((availability) => (
                                                <li key={availability.id}>
                                                    {availability.available_from} to {availability.available_until} — {availability.count} vans
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    </div>
                );
                })
            } 
        </div>

        {/* Show More */}
        {visibleCount < filteredVans.length && (
            <Button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="btn-primary w-full shadow bg-gray-100 text-sm text-black hover:bg-gray-200 rounded cursor-pointer"
            >Show More</Button>
        )}

        {vanToDelete && (
            <div className="confirm-modal">
                <div className="confirm-card">
                <Dialog open={true} onOpenChange={(open) => !open && setVanToDelete(null)}>
                    <DialogContent className="p-0 shadow-none bg-transparent">
                    <DialogTitle className="text-base font-semibold text-center mb-2">
                        Are you sure you want to delete "{vanToDelete.name}"?
                    </DialogTitle>

                    <DialogDescription className="text-sm text-gray-500 text-center mb-4">
                        This van will be marked for removal. You can still cancel editing to keep it.
                    </DialogDescription>

                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose asChild>
                        <Button 
                            variant="outline"
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            onClick={() => {
                                handleDeletion(vanToDelete);
                                setVanToDelete(null);
                            }}
                            className="cursor-pointer"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                </div>
            </div>
        )}
    </>
    
  )
}
