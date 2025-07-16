import { OtherService } from "@/types"
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useLoading } from "./ui/loading-provider";
import { router } from "@inertiajs/react";
import { Check, PencilIcon, PlusSquareIcon, TrashIcon, Undo, X } from "lucide-react";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription } from "@radix-ui/react-dialog";
import { DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import ImageSimpleBox from "./ui/image-simple-box";
import PriceSign from "./price-sign";
import { Textarea } from "@headlessui/react";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";

type OtherServiceSelectionProps = {
    otherServices: OtherService[];
    selectedOtherServiceIds?: number[];
    onSelect?: (otherService: number) => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    textLabel?: string;
    required?: boolean;
    editable?: boolean;
    selectable?: boolean;
    onSave?: (newOtherService: OtherService[]) => void;
}

export interface EditableOtherService extends OtherService {
    action?: string;
    image_url_file?: File | null;
    isNew?: boolean;

    // From package_other_service
    is_recommended?: boolean;
    package_specific_price?: number;
    sort_order?: number;
}

export default function OtherServiceSelection({
    otherServices,
    selectedOtherServiceIds,
    onSelect,
    onChange,
    textLabel,
    required,
    editable,
    selectable = true,
    onSave,
} : OtherServiceSelectionProps) {
    const {start, stop} = useLoading();

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [tempServices, setTempServices] = useState<EditableOtherService[]>(otherServices);
    const [serviceToDelete, setServiceToDelete] = useState<EditableOtherService | null>(null);
    const lastAddedServiceRef = useRef<HTMLInputElement | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [search, setSearch] = useState("");

    const filteredServices = useMemo(() => {
        return tempServices
            .filter(service =>
                service.name.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => {
                const rank = (s: EditableOtherService) => {
                    const selected = selectedOtherServiceIds?.includes(s.id) ? 2 : 0;
                    const recommended = s.is_recommended ? 1 : 0;
                    return selected + recommended; // 2 = selected, 1 = recommended
                };

                const rankDiff = rank(b) - rank(a);
                if (rankDiff !== 0) return rankDiff;

                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // newest last
            });
    }, [search, tempServices, selectedOtherServiceIds]);

    const visibleServices = filteredServices.slice(0, visibleCount);

    useEffect(() => {
        if(!isEditing && otherServices.length > 0) {
            setTempServices(otherServices);
        }
    }, [otherServices, isEditing]);

    const toggleIsEditing = () => {
        if(isEditing) {
            setTempServices(otherServices);
        }
        setIsEditing(!isEditing);
    }
    
    const handleAddService = () => {
        
        const newId = -Date.now();

        const newService: EditableOtherService = {
            id: newId,
            name: `Service ${newId}`,
            image_url: '',
            description: '',
            price: 0,
            action: 'create',
            isNew: true,
            created_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            updated_at: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
        };

        setTempServices((prev) => [...prev, newService])

        setTimeout(() => {
            if (lastAddedServiceRef.current) {
                lastAddedServiceRef.current.focus();
                lastAddedServiceRef.current.select();
            }
        }, 100);
    }

    const handleSave = () => {
        if (isEditing) {

            start();
            const formData = new FormData();
            formData.append('_method', 'put');

            tempServices.forEach((service, index) => {
                formData.append(`services[${index}][id]`, service.id.toString());
                formData.append(`services[${index}][name]`, service.name);
                if(service.image_url_file) {
                    formData.append(`services[${index}][image_url]`, service.image_url_file);
                }
                formData.append(`services[${index}][description]`, service.description);
                formData.append(`services[${index}][price]`, service.price.toString());
                if(service.action !== undefined) {
                    formData.append(`services[${index}][action]`, service.action);
                }
            });

            router.post(`/otherservice/update`, formData, {
                onSuccess: () => {
                    const updatedServices = tempServices.filter((v) => v.action !== 'delete');
                    setTempServices(updatedServices);
                    onSave?.(updatedServices);
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

    const handlePartialUpdate = (id: number, field: keyof EditableOtherService, value: any) => {
        const updated = tempServices.map((service) =>
            service.id === id
                ? { ...service, [field]: value }
                : service
        );
        setTempServices(updated);
        onSave?.(updated); // Send immediately to parent
    };

    const handleDeletion = (service: EditableOtherService) => {
        if (service.isNew) {
            setTempServices(prev => prev.filter(s => s.id !== service.id));
        } else {
            setTempServices(prev =>
                prev.map(s => (s.id === service.id ? { ...s, action: 'delete' } : s))
            );
        }
        setServiceToDelete(null);
    }

    const undoDeletion = (service: EditableOtherService) => {
        setTempServices((prev) =>
            prev.map((s) => 
                (s.id === service.id) ? { ...s, action: undefined } : s
            )
        );
        setServiceToDelete(null);
    }

    const handleChange = (id: number, field: keyof EditableOtherService, value: any) => {
        setTempServices((prev) =>
            prev.map((service) =>
                service.id === id ? { ...service, [field]: value, action: service.action ?? 'update' } : service
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
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-non focus:ring-2 focus:ring-primary"
        />

        {/* Select All */}

        {onChange && (
            <div className="mb-2">
                <div className="flex items-center gap-2">
                    <input
                        id="select-all-services"
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                        checked={otherServices.length > 0 && selectedOtherServiceIds?.length === otherServices.length}
                        onChange={onChange}
                    />
                    <label htmlFor="select-all-services" className="text-sm font-medium text-gray-700">
                        Select All Services
                    </label>
                </div>
            </div>
        )}

        {visibleServices.length > 0 ? (
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
                            <p className="text-sm text-gray-500">{isEditing ? "Cancel Editing" : "Edit Service"}</p>
                        </div>
                        
                    </>
                )}

                {editable && (
                    isEditing && (
                        <div className="card flex flex-col items-center justify-center gap-4 p-4" onClick={handleAddService}>
                            <PlusSquareIcon className="w-24 h-24 text-gray-400" />
                            <p className="text-sm text-gray-500">Add Service</p>
                        </div>
                    )
                )}

                {visibleServices?.map((service: EditableOtherService) => {
                    const isSelected = selectedOtherServiceIds?.includes(service.id);
                    return (
                        <div
                            className={clsx("card small", service.is_recommended && "recommended", isSelected && "selected", service.action == "delete" && "toDelete", !selectable && "cursor-default")}
                            key={service.id}
                            onClick={() => {
                                if(!isEditing && selectable) {
                                    onSelect?.(service.id);
                                }
                            }}
                        >
                            <div className="flex-col items-center gap-4 p-4">
                                
                                {isEditing ? (
                                    <div className="flex items-center justify-center">
                                        <ImageSimpleBox
                                            key={service.id}
                                            id={`van-image-${service.id}`}
                                            imagePreview={service.image_url}
                                            setImagePreview={(e) => handleChange(service.id, 'image_url', e)}
                                            setImageFile={(e) => handleChange(service.id, 'image_url_file', e)}
                                            editable={isEditing}
                                            className="w-full h-32"
                                        />
                                    </div>
                                ) : (
                                    <img
                                        src={service.image_url}
                                        alt={service.name}
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
            
                                            if (service.isNew) {
                                                handleDeletion(service);
                                                return;
                                            }
            
                                            if(service.action == 'delete') {
                                                undoDeletion(service);
                                            } else {
                                                setServiceToDelete(service);
                                            }
                                            
                                        }}
                                    >
                                        {service.action === 'delete' ? (
                                            <Undo className="w-8 h-8 p-2 border rounded bg-blue-400 cursor-pointer" />
                                        ) : (
                                            <TrashIcon className="w-8 h-8 p-2 border rounded bg-red-400 cursor-pointer" />
                                        )}
                                    </div>
                                )}

                                    <p className="text-lg font-medium text-gray-900">
                                        {isEditing ? (
                                            <Input
                                                type="text"
                                                value={service.name}
                                                placeholder="Title"
                                                ref={service.isNew ? lastAddedServiceRef : null}
                                                onChange={(e) => handleChange(service.id, 'name', e.target.value)}
                                                className="p-0 text-lg outline-none px-2 w-full font-semibold"
                                            />
                                        ) : (
                                            `${service.name}`
                                        )}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-2">
                                        {isEditing ? (
                                            <Textarea
                                                placeholder="Description"
                                                onChange={(e) => handleChange(service.id, 'description', e.target.value)}
                                                className="p-0 text-sm border-1 rounded px-2 w-full"
                                                rows={10}
                                                maxLength={120}
                                            >{service.description}</Textarea>
                                        ) : (
                                            service.description
                                        )}
                                    </p>
                                    
                                    {isEditing && (
                                        <p className="text-xs text-gray-500 mt-1 text-right">
                                            {service.description.length}/120 characters
                                        </p>
                                    )}

                                    <p className="mt-4 text-sm font-medium text-blue-700">
                                        {isEditing ? (
                                            <span className="flex items-center">
                                                <PriceSign />
                                                <Input
                                                    type="number"
                                                    value={service.price}
                                                    onChange={(e) => handleChange(service.id, 'price', e.target.value)}
                                                    className="p-0 outline-none px-2 w-full"
                                                />
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="mt-1 text-sm font-medium text-blue-700">
                                                    <PriceSign />
                                                    {formatPrice(service.pivot?.package_specific_price && service.pivot?.package_specific_price > 0
                                                        ? service.pivot.package_specific_price
                                                        : service.price)}
                                                </span>
                                                {service.pivot?.package_specific_price && (
                                                    <span className="text-center text-xs text-blue-600 bg-blue-100 px-0.5 py-1 rounded-full">
                                                        Package Price
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </p>
                                        
                                    <div className="mt-2 space-y-2 text-sm text-gray-600 cursor-pointer">
                                        
                                        {isSelected && editable && (
                                            <label 
                                                className="flex items-center gap-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={service.is_recommended ?? false}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        handlePartialUpdate(service.id, 'is_recommended', e.target.checked);
                                                    }}
                                                    className="w-4 h-4"
                                                />
                                                <span>Is Recommended</span>
                                            </label>
                                        )}

                                        {service.is_recommended && (
                                            <span className="recommended-text">
                                                Recommended
                                            </span>
                                        )}

                                        {service.pivot?.is_recommended && (
                                            <span className="recommended-text">Recommended</span>
                                        )}
                                        
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {isSelected && editable && (
                                            
                                            <div 
                                                className="flex items-center mt-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <PriceSign />
                                                <Input
                                                    type="number"
                                                    placeholder="Specific Price"
                                                    value={service.package_specific_price ?? ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                                        handlePartialUpdate(service.id, 'package_specific_price', value);
                                                    }}
                                                    className="p-0 outline-none px-2 w-full"
                                                />
                                            </div>
                                            
                                        )}
                                    </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        ) : (
            <p className="text-gray-500 text-sm">No services found.</p>
        )}

        {/* Show More */}
        {visibleCount < filteredServices.length && (
            <div className="mt-4 flex justify-center">
                <Button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="btn-primary w-full shadow bg-gray-100 text-sm text-black hover:bg-gray-200 rounded cursor-pointer"
                >Show More</Button>
            </div>
        )}

        {serviceToDelete && (
            <div className="confirm-modal">
                <div className="confirm-card">
                <Dialog open={true} onOpenChange={(open) => !open && setServiceToDelete(null)}>
                    <DialogContent className="p-0 shadow-none bg-transparent">
                    <DialogTitle className="text-base font-semibold text-center mb-2">
                        Are you sure you want to delete "{serviceToDelete.name}"?
                    </DialogTitle>

                    <DialogDescription className="text-sm text-gray-500 text-center mb-4">
                        This service will be marked for removal. You can still cancel editing to keep it.
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
                                handleDeletion(serviceToDelete);
                                setServiceToDelete(null);
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
