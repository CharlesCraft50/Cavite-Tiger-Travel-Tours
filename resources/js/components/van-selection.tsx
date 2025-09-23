import { PreferredVan, SharedData, User, VanCategory } from "@/types";

import clsx from "clsx";
import { Label } from "./ui/label";
import { Check, PencilIcon, Plus, PlusSquareIcon, Search, TrashIcon, Undo, X, GripVertical, Move } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { router, usePage } from "@inertiajs/react";
import { useLoading } from "./ui/loading-provider";
import { Input } from "./ui/input";
import ImageSimpleBox from "./ui/image-simple-box";
import PriceSign from "./price-sign";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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
    onVanCategorySave?: (newCategory: VanCategory[]) => void;
    small?: boolean;
    vanCategories?: VanCategory[];
};

interface CategoryWithOrder extends VanCategory {
    display_order: number;
}

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
    onVanCategorySave,
    small,
    vanCategories,
}: VanSelectionProps) {

    const page = usePage<SharedData>();
    const { auth } = page.props;

    const { start, stop } = useLoading();

    interface EditablePreferredVan extends PreferredVan {
        action?: string;
        image_url_file?: File | null;
        isNew?: boolean;
    }

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [tempVans, setTempVans] = useState<EditablePreferredVan[]>(preferredVans);
    const [vanToDelete, setVanToDelete] = useState<EditablePreferredVan | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<VanCategory | null>(null);
    const lastAddedVanRef = useRef<HTMLInputElement | null>(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [search, setSearch] = useState("");
    const [categoryOrder, setCategoryOrder] = useState<CategoryWithOrder[]>([]);

    // Initialize category order
    useEffect(() => {
        if (vanCategories) {
            const orderedCategories = vanCategories
                .map((cat, index) => ({
                    ...cat,
                    display_order: cat.sort_order ?? index + 1
                }))
                .sort((a, b) => a.display_order - b.display_order);
            setCategoryOrder(orderedCategories);
        }
    }, [vanCategories]);

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
            // Reset category order to original
            if (vanCategories) {
                const orderedCategories = vanCategories
                    .map((cat, index) => ({
                        ...cat,
                        display_order: cat.sort_order ?? index + 1
                    }))
                    .sort((a, b) => a.display_order - b.display_order);
                setCategoryOrder(orderedCategories);
            }
        }
        setIsEditing(!isEditing);
    }

    const handleAddVan = () => {
  const newId = Date.now(); // temp ID

  const defaultCategory = vanCategories?.[0];

  const newVan: EditablePreferredVan = {
    id: newId,
    name: `Van ${newId}`,
    image_url: null,
    additional_fee: 0,
    pax_adult: 0,
    pax_kids: 0,
    plate_number: null,
    user_id: auth.user.id,
    availabilities: [],
    action: "create",
    isNew: true,
    van_category_id: defaultCategory?.id || null,
    category: defaultCategory || undefined,   // ✅ make sure it has a category object
    created_at: "",
    updated_at: ""
  };

  setTempVans((prev) => [...prev, newVan]);
};


    const [toggleAddCategory, setToggleAddCategory] = useState(false);
    const [addCategory, setAddCategory] = useState<string | null>(null);

    const handleAddCategory = () => {
        setToggleAddCategory(true);
    }

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const saveCategory = () => {
        if (addCategory == null || addCategory.trim() === "") return;

        router.post(route('vancategories.store'), { name: addCategory }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                setToggleAddCategory(false);
                setAddCategory('');

                if (page?.props?.vanCategories) {
                    const newCategories = page.props.vanCategories as VanCategory[];
                    const latestCategory = newCategories[newCategories.length - 1]; // assume new one is last

                    // Put new one at the top, keep others below
                    const reordered = [
                        { ...latestCategory, display_order: 1 },
                        ...newCategories
                            .filter(c => c.id !== latestCategory.id)
                            .map((cat, i) => ({
                                ...cat,
                                display_order: i + 2,
                            })),
                    ];

                    setCategoryOrder(reordered);

                    // notify parent with new list
                    onVanCategorySave?.(reordered);
                }
            },


        });
    };

    const handleSave = () => {
        if (isEditing) {
            start();
            const formData = new FormData();
            formData.append('_method', 'put');

            // Add category order data
            categoryOrder.forEach((category, index) => {
                formData.append(`categories[${index}][id]`, category.id.toString());
                formData.append(`categories[${index}][sort_order]`, category.display_order.toString());
            });

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
                if (van.plate_number != null) {
                    formData.append(`vans[${index}][plate_number]`, van.plate_number.toString());
                }
                if (van.action !== undefined) {
                    formData.append(`vans[${index}][action]`, van.action);
                }
                if (van.availabilities) {
                    van.availabilities.forEach((availability, availIndex) => {
                        formData.append(`vans[${index}][availabilities][${availIndex}][available_from]`, availability.available_from ?? '');
                        formData.append(`vans[${index}][availabilities][${availIndex}][available_until]`, availability.available_until ?? '');
                        formData.append(`vans[${index}][availabilities][${availIndex}][count]`, availability.count?.toString() ?? '0');
                    });
                }
                if (van.van_category_id !== null && van.van_category_id !== undefined) {
                    formData.append(`vans[${index}][van_category_id]`, van.van_category_id.toString());
                }
            });
            
            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            router.post(`/preferredvan/update`, formData, {
                onSuccess: () => {
                    const updatedVans = tempVans.filter((v) => v.action !== 'delete');
                    setTempVans(updatedVans);
                    onSave?.(updatedVans);
                    // Send the updated category order instead of vans
                    const updatedCategories: VanCategory[] = categoryOrder.map(cat => ({
                        id: cat.id,
                        name: cat.name,
                        sort_order: cat.display_order, // updated order
                        created_at: cat.created_at,
                        updated_at: cat.updated_at,
                    }));
                    onVanCategorySave?.(updatedCategories);
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

    const handleChange = (id: number, field: keyof EditablePreferredVan, value: any, extra?: any) => {
        setTempVans((prev) =>
            prev.map((van) =>
                van.id === id
                    ? {
                        ...van,
                        [field]: value,
                        // If updating category, also set the category object
                        ...(field === 'van_category_id' && extra
                            ? { category: { id: value, ...extra } }
                            : {}),
                        action: van.action ?? 'update',
                    }
                    : van
            )
        );
    };

    const [draggingVanId, setDraggingVanId] = useState<number | null>(null);

    const handleDragEnd = (result: DropResult) => {
        const { source, destination, draggableId, type } = result;
        if (!destination) return;

        if (type === "CATEGORY") {
            const newOrder = Array.from(categoryOrder);
            const [moved] = newOrder.splice(source.index, 1);
            newOrder.splice(destination.index, 0, moved);

            // Update display_order according to new index
            const updatedOrder = newOrder.map((cat, index) => ({
                ...cat,
                display_order: index + 1,
            }));

            setCategoryOrder(updatedOrder);
        }

        if (type === "VAN") {
            const vanId = Number(draggableId);
            const destCategoryId = Number(destination.droppableId);

            setTempVans((prevVans) => {
            return prevVans.map((van) => {
                if (van.id === vanId) {
                const newCategory = vanCategories?.find(c => c.id === destCategoryId);
                return {
                    ...van,
                    van_category_id: destCategoryId,
                    category: newCategory ? { ...newCategory, display_order: newCategory.sort_order || 0 } : undefined
                };
                }
                return van;
            });
            });
        }
    };

    
    const categorizedVans = useMemo(() => {
        const groups: Record<string, EditablePreferredVan[]> = {};

        tempVans
            .filter(van =>
                van.name.toLowerCase().includes(search.toLowerCase())
            )
            .forEach(van => {
                const categoryName = van.category?.name || 'Uncategorized';
                if (!groups[categoryName]) groups[categoryName] = [];
                groups[categoryName].push(van);
            });

        // Sort only when not dragging
        if (!draggingVanId) {
            Object.keys(groups).forEach(cat => {
                groups[cat].sort((a, b) => a.additional_fee - b.additional_fee);
            });
        }

        const sortedGroups: Record<string, EditablePreferredVan[]> = {};
        categoryOrder.forEach(category => {
            if (groups[category.name]?.length) sortedGroups[category.name] = groups[category.name];
        });

        if (groups['Uncategorized']?.length) sortedGroups['Uncategorized'] = groups['Uncategorized'];

        return sortedGroups;
    }, [tempVans, categoryOrder, draggingVanId, search]);

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

    useEffect(() => {
    if (lastAddedVanRef.current) {
        lastAddedVanRef.current.focus();
        lastAddedVanRef.current.select();

        // Reset the `isNew` flag so it doesn’t keep re-focusing
        setTempVans((prev) =>
        prev.map((v) => ({ ...v, isNew: false }))
        );
    }
    }, [tempVans]);

    const handleCategoryDeletion = (id: number) => {
        if (id == null) return;

        // Optimistically update frontend
        setCategoryOrder(prev => prev.filter(cat => cat.id !== id));
        setTempVans(prev =>
            prev.map(van =>
                van.van_category_id === id
                    ? {
                        ...van,
                        van_category_id: null,
                        category: undefined,   // no category anymore
                        action: van.action ?? "update", // mark it as updated
                    }
                    : van
            )
        );

        // Tell backend
        router.delete(route('vancategories.destroy', { vancategory: id }));
    };

    const renderVanCard = (van: EditablePreferredVan) => {
        const isSelected = selectedVanIds?.includes(van.id);
        return (
            <div
                key={van.id}
                onClick={() => {
                    if(!isEditing && selectable) {
                        onSelect?.(van.id);
                    }
                }}
                className={clsx("card", isSelected && "selected", van.action == "delete" && "toDelete", !selectable && "cursor-default", isEditing && "cursor-grab")}
            >
                {isEditing ? (
                    <div className="flex items-center justify-center">
                        <ImageSimpleBox
                            key={van.id}
                            id={`van-image-${van.id}`}
                            imagePreview={van.image_url ?? ''}
                            setImagePreview={(e) => handleChange(van.id, 'image_url', e)}
                            setImageFile={(e) => handleChange(van.id, 'image_url_file', e)}
                            editable={isEditing}
                            className="w-full h-32"
                        />
                    </div>
                ) : (
                    <img
                        src={van.image_url ?? ''}
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
                        className="absolute top-2 left-2"
                        
                    >
                        <Move className="w-8 h-8 p-2 border rounded bg-gray-400 cursor-move"/>
                    </div>
                )}

                {editable && isEditing && (
                    <div 
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                            e.stopPropagation();

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
                            van.name
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
                                <PriceSign />
                                {van.additional_fee.toLocaleString()}
                            </>
                        )}
                    </p>
                </div>

                {isEditing && (
                    <div className="text-sm font-medium mt-2">
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
                    </div>
                )}

                {!isEditing && (van.driver?.name || drivers.find((d) => d.id === van.user_id)?.name) && (
                    <div className="text-sm font-medium mt-2">
                        <div>
                            <p className="text-sm font-semibold">Assigned Driver</p>
                            <p>
                                {van.driver?.name ?? drivers.find((d) => d.id === van.user_id)?.name ?? ''}
                            </p>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="mt-2">
                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-medium">Category</p>
                            <select
                                value={van.van_category_id ?? ''}
                                onChange={(e) =>
                                    handleChange(van.id, 'van_category_id', Number(e.target.value), {
                                        name: vanCategories?.find((c) => c.id === Number(e.target.value))?.name,
                                        scroll_order: vanCategories?.find((c) => c.id === Number(e.target.value))?.sort_order,
                                    })
                                }
                                className="w-full text-md cursor-pointer p-1 border border-r-4"
                            >
                                <option value="">-- Select Category --</option>
                                {vanCategories?.map((category) => (
                                    <option key={category?.id} value={category?.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <div className="mt-2">
                        <div className="flex flex-col space-y-2">
                            <p className="text-sm font-medium">Plate Number</p>
                            <Input 
                                type="text" 
                                value={van.plate_number || ''} 
                                onChange={(e) => 
                                    handleChange(van.id, 'plate_number', e.target.value)
                                }
                            />
                        </div>
                    </div>
                )}

                {!isEditing && editable && van.plate_number != null &&  (
                    <div className="mt-2">
                        <div className="text-sm font-medium mt-2">
                            <p className="text-sm font-semibold">Plate Number</p>
                            <p>{van.plate_number}</p>
                        </div>
                    </div>
                )}

                {/* {!isEditing && (van.category != null) && (
                    <div className="text-sm font-medium mt-2">
                        <div>
                            <p className="text-sm font-semibold">Category</p>
                            <p>
                                {van.category?.name}
                            </p>
                        </div>
                    </div>
                )} */}
            </div>
        );
    };

    return (
        <>
            <Label className="font-medium text-sm" required={required}>
                {textLabel}
            </Label>

            {/* Search Bar */}
            <div className="flex flex-row gap-2">
                <div className="relative w-full mb-2">
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
                        <Button type="button" className="items-center justify-center font-semibold cursor-pointer" onClick={() => {
                            if (!isEditing) {
                                toggleIsEditing();
                            }
                            handleAddCategory();
                        }}>
                            <Plus />
                            <p className="text-sm text-white">Add Category</p>
                        </Button>
                    </>
                )}
            </div>

            {(isEditing && toggleAddCategory) && (
                <div className="flex flex-row gap-2 mb-6 rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50">
                    <Input
                        value={addCategory ?? ''}
                        onChange={(e) => setAddCategory(e.target.value)}
                        placeholder="Category Name"
                    />
                    <Button
                        type="button"
                        onClick={saveCategory}
                        className="cursor-pointer"
                    >Add</Button>
                    <Button
                        type="button"
                        onClick={() => {
                            setToggleAddCategory(false);
                        }}
                        className="cursor-pointer"
                    >Cancel</Button>
                </div>
            )}

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
            
            {/* Conditional Rendering: Draggable categorized view for both modes */}
            {isEditing ? (
                // Editing mode with draggable categories
                <DragDropContext onDragStart={(start) => {
                        if (start.type === 'VAN') setDraggingVanId(Number(start.draggableId));
                    }}
                    onDragEnd={(result) => {
                        setDraggingVanId(null);
                        handleDragEnd(result);
                    }}>
                    <Droppable droppableId="all-categories" type="CATEGORY">
                        {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {categoryOrder.map((category, catIndex) => (
                            <Draggable
                                draggableId={`category-${category.id}`}
                                index={catIndex}
                                key={category.id}
                            >
                                {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="mb-6 rounded-lg border-2 border-dashed border-gray-300 p-4 bg-gray-50"
                                >
                                    <div className="absolute right-12" onClick={() => setCategoryToDelete(category)}>
                                        <TrashIcon className="w-8 h-8 p-2 border rounded bg-red-400 cursor-pointer" />
                                    </div>
                                    {/* Category header */}
                                    <div className="flex items-center gap-3 mb-4" {...provided.dragHandleProps}>
                                        <GripVertical size={20} className="text-gray-400" />
                                        <h2 className="text-xl font-bold">{category.name}</h2>
                                    </div>

                                    {/* Vans inside category */}
                                    <Droppable droppableId={category.id.toString()} type="VAN">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={clsx(
                                                !small
                                                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
                                                "min-h-[100px] border-1 border-dashed rounded-lg", // ensures area exists even when empty
                                                snapshot.isDraggingOver && "bg-blue-50"           // highlight when dragging over
                                            )}
                                        >
                                        {categorizedVans[category.name]?.map((van, vanIndex) => (
                                            <Draggable
                                                key={van.id}
                                                draggableId={van.id.toString()}
                                                index={vanIndex}
                                            >
                                            {(provided) => (
                                                <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                >
                                                {renderVanCard(van)}
                                                </div>
                                            )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        </div>
                                    )}
                                    </Droppable>
                                </div>
                                )}
                            </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                        )}
                    </Droppable>
                    </DragDropContext>

            ) : (() => {
                let shown = 0;

                return (
                <>
                    {Object.entries(categorizedVans).map(([category, vans]) => {
                    const vansForCategory = vans
                        .map(van => tempVans.find(v => v.id === van.id) || van)
                        .filter(Boolean)
                        .filter(() => {
                        if (shown < visibleCount) {
                            shown++;
                            return true;
                        }
                        return false;
                        });

                    if (vansForCategory.length === 0) return null;

                    return (
                        <div key={category} className="mb-6">
                        <h2 className="text-xl font-bold mt-4 mb-2">{category}</h2>
                        <div
                            className={clsx(
                            !small
                                ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                            )}
                        >
                            {vansForCategory.map((van) => renderVanCard(van))}
                        </div>
                        </div>
                    );
                    })}
                </>
                )
            })()}


            {/* Show More */}
            {!isEditing && visibleCount < sortedVansWithoutNew.length + newVans.length && (
                <Button
                    type="button"
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

            {categoryToDelete && (
                <div className="confirm-modal">
                    <div className="confirm-card">
                        <Dialog open={true} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
                            <DialogContent className="p-8 shadow-none bg-white">
                                <DialogTitle className="text-base font-semibold text-center mb-2">
                                    Are you sure you want to this "{categoryToDelete.name}"?
                                </DialogTitle>

                                <DialogDescription className="text-sm text-gray-500 text-center mb-4">
                                    This category will be deleted permanently.
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
                                            handleCategoryDeletion(categoryToDelete.id);
                                            setCategoryToDelete(null);
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