import { PreferredVan, User } from "@/types";

import clsx from "clsx";
import { Label } from "./ui/label";
import { Check, PencilIcon, Plus, PlusSquareIcon, Search, TrashIcon, Undo, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { router } from "@inertiajs/react";
import { useLoading } from "./ui/loading-provider";
import { Input } from "./ui/input";
import ImageSimpleBox from "./ui/image-simple-box";
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
    small?: boolean;
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
    small,
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

    const sortedVans = useMemo(() => {
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

    const visibleVans = sortedVans.slice(0, visibleCount);

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

    const categorizeByPrice = (price: number) => {
        if (price <= 1000) return "Economy";
        if (price <= 1400) return "Standard";
        if (price <= 2000) return "Premium";
        return "Luxury";
    };

    const categorizedVans = useMemo(() => {
        const groups: Record<string, EditablePreferredVan[]> = {};
        preferredVans.forEach(van => {
            const category = categorizeByPrice(van.additional_fee);
            if (!groups[category]) groups[category] = [];
            groups[category].push(van);
        });
        return groups;
    }, [preferredVans]);

    // Separate new vans from the existing categorized ones
    const newVans = tempVans.filter(van => van.isNew);

    const sortedVansWithoutNew = useMemo(() => {
        return tempVans
            .filter(van => !van.isNew && van.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                const aSelected = selectedVanIds?.includes(a.id) ? 1 : 0;
                const bSelected = selectedVanIds?.includes(b.id) ? 1 : 0;
    
                if (aSelected !== bSelected) {
                    return bSelected - aSelected;
                }
    
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
    }, [tempVans, selectedVanIds, search]);

    return (
        <>
            <Label className="font-medium text-sm" required={required}>
                {textLabel}
            </Label>

            {/* Search Bar */}
            <div className="flex flex-row gap-2">
                <div className="relative w-full mb-8">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                        <Search size={20} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search vans..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded-lg p-2 pl-10 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                {editable && (
                    <>
                        {isEditing && (
                            <div>
                                <Button type="button" className="items-center justify-center cursor-pointer" onClick={handleSave}>
                                    <Check className="w-24 h-24 text-white" />
                                    <p className="text-sm text-white">Save</p>
                                </Button>
                            </div>
                        )}

                        <Button type="button" className="items-center justify-center font-semibold cursor-pointer" onClick={toggleIsEditing}>
                            {isEditing ? (
                                <X className="w-24 h-24 text-white" />
                            ) : (
                                <PencilIcon className="w-12 h-12 text-white" />
                            )}
                            <p className="text-sm text-white">{isEditing ? "Cancel Editing" : "Edit Vans"}</p>
                        </Button>

                        <Button type="button" className="items-center justify-center font-semibold cursor-pointer" onClick={() => {
                            if (!isEditing) {
                                toggleIsEditing();
                            }
                            handleAddVan();
                        }}>
                            <Plus />
                            <p className="text-sm text-white">Add van</p>
                        </Button>
                    </>
                )}
            </div>

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
            
            {/* Conditional Rendering: Categorized view for normal mode, flat list for editing */}
            {isEditing ? (
                <div className={clsx(!small ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4")}>
                    {tempVans.map((van) => {
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <>
                    {Object.entries(categorizedVans).map(([category, vans]) => {
                        const vansForCategory = vans.map(van => tempVans.find(v => v.id === van.id) || van).filter(Boolean);

                        if (vansForCategory.length === 0) {
                            return null;
                        }

                        return (
                            <div key={category}>
                                {!isEditing && (
                                    <h2 className="text-xl font-bold mt-4 mb-2">{category}</h2>
                                )}
                                <div className={clsx(!small ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4")}>
                                    {vansForCategory.map((van) => {
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
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    {/* Render new vans at the end */}
                    {newVans.length > 0 && (
                        <div className="mt-4">
                            {isEditing && (
                                <h2 className="text-xl font-bold mt-4 mb-2">New Vans</h2>
                            )}
                            <div className={clsx(!small ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4")}>
                                {newVans.map((van) => {
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
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Show More */}
            {!isEditing && visibleCount < sortedVansWithoutNew.length + newVans.length && (
                <Button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="btn-primary w-full shadow bg-gray-100 text-sm text-black hover:bg-gray-200 rounded cursor-pointer"
                >Show More</Button>
            )}

            {vanToDelete && (
                <div className="confirm-modal">
                    <div className="confirm-card">
                        <Dialog open={true} onOpenChange={(open) => !open && setVanToDelete(null)}>
                            <DialogContent className="p-8 shadow-none bg-white">
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
    );
}