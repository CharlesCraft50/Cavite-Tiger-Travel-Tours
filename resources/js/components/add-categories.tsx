import CategoryTab from '@/components/ui/category-tab';
import { PackageCategory } from '@/types'
import { Textarea } from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ModalLargeRef } from './ui/modal-large';
import SimpleEditorModal from './simple-editor-modal';
import DOMPurify from 'dompurify';
import { isEffectivelyEmptyHtml } from './package-content-editor';
import clsx from 'clsx';
import LinkLoading from './link-loading';

type AddCategoriesProps = {
    categories: PackageCategory[];
    onAddCategory?: (newCategory: Omit<PackageCategory, 'id' | 'created_at' | 'updated_at'>) => void;
    onRemoveCategory?: (id: number) => void;
    onUpdateCategory?: (id: number, data: string, value: string | number | boolean) => void;
    editable?: boolean;
    slug?: string;
    selectedCategory?: PackageCategory;
}

export default function AddCategories({ 
    categories, 
    onAddCategory, 
    onRemoveCategory, 
    onUpdateCategory, 
    editable = false,
    slug,
    selectedCategory
}: AddCategoriesProps ) {

    const initialTab = categories.findIndex(cat => cat.slug === selectedCategory?.slug);
    console.log(selectedCategory?.slug);
    const [activeTab, setActiveTab] = useState(initialTab === -1 ? 0 : initialTab); 
    const [ nextCategoryIndex, setNextCategoryIndex ] = useState(1);

    const handleTabClick = (index: number) => {
        setActiveTab(index);

        if (!editable) {
            const packageSlug = slug ?? '';
            const categorySlug = categories[index]?.slug ?? '';
            const newPath = categorySlug 
                ? `/packages/${packageSlug}/category/${categorySlug}` 
                : `/packages/${packageSlug}`;

            window.history.replaceState({}, '', newPath);
        }
    };


    const handleAdd = () => {
        onAddCategory?.({
            tour_package_id: nextCategoryIndex,
            name: 'New Category ' + nextCategoryIndex,
            content: '',
            has_button: 1,
            button_text: ''
        });
        setNextCategoryIndex(prev => prev + 1);
    }

    const handleRemove = (id: number) => {
        onRemoveCategory?.(id);
    }

    const [activeModal, setActiveModal] = useState(false);
    
    const modalRef = useRef<ModalLargeRef>(null);

    const closeModal = () => {
        modalRef.current?.close();
        
    }

    const openModal = () => {
        setActiveModal(true);
    }

    const clearContent = () => {
        const cat = categories[activeTab];
        if(cat) {
            closeModal();
            onUpdateCategory?.(cat.id, 'content', " ");
            setTimeout(() => {
                openModal();
            }, 250);
        }
    }

    useEffect(() => {
        if(activeModal){
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [activeModal]);
    
    return (
        <>
            {/* Tab Structure */}
            <div className="mt-8">
                <div className="tb-heading">
                    <ul className="flex flex-col sm:flex-wrap sm:flex-row gap-2 w-full overflow-x-auto">
                        {categories.length > 0 ? (
                            categories.map((category, index) => (
                                <div className="relative w-full sm:w-auto" key={category.id}>
                                    <CategoryTab className={
                                        `${activeTab === index
                                            ? 'bg-[#fb2056] hover:opacity-90 text-white font-semibold'
                                            : 'bg-gray-500 text-white'
                                        } w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2 flex items-center gap-2 text-sm font-bold text-center justify-center`} 
                                        name={category.name} 
                                        onClick={() => handleTabClick(index)} 
                                        hasIndicator={true}
                                        title={category.name}
                                        setTitle={(newTitle) => {
                                            const category = categories[index];

                                            const existingButtonText = category?.button_text?.split(' ')[0] ?? '';
                                            const fullButtonText = `${existingButtonText} ${newTitle}`.trim();

                                            const trimmedButtonText =
                                                fullButtonText.length > 20
                                                    ? fullButtonText.slice(0, 17).trim() + '...'
                                                    : fullButtonText;

                                            onUpdateCategory?.(category.id, 'name', newTitle);
                                            onUpdateCategory?.(category.id, 'button_text', trimmedButtonText);
                                        }}
                                        editable={editable} /> 
                                    {editable && (
                                        <Button 
                                            className="absolute top-1 right-1 p-1 -m-1 btn-primary bg-white rounded-l-full w-6 h-6 cursor-pointer hover:bg-gray-300"
                                            onClick={() => handleRemove(category.id)}
                                            >
                                            <X className="w-4 h-4 text-black" />
                                        </Button>
                                    )}
                                </div>
                            ))
                        ): (
                            editable ? (
                                <CategoryTab className={
                                    `${activeTab === 0
                                        ? 'bg-[#fb2056] text-white font-semibold'
                                        : 'bg-gray-500 text-white'
                                    } w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2 flex items-center gap-2 text-sm font-bold text-center justify-center`} 
                                    name={"Add Categories"} 
                                    onClick={handleAdd} 
                                    hasIndicator={true} 
                                    key={0} 
                                />
                            ) : (
                                <div className="w-full">
                                    <LinkLoading
                                        href={slug ? route("booking.create", {
                                            slug: slug
                                        }): undefined}
                                        useUI={false}
                                        className="btn-primary w-full"
                                    >
                                        Book Now
                                    </LinkLoading>
                                </div>
                            )
                        )}
                        {editable && (
                            <Button
                                type="button"
                                className="btn-primary rounded-r-full p-4 cursor-pointer"
                                onClick={handleAdd}
                            >
                                <Plus className="w-8 h-8 text-sm text-white" />
                            </Button>
                        )}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                    <div className="tab-pane flex flex-col min-h-[400px]">
        
                        {categories.length > 0 && (
                            !isEffectivelyEmptyHtml(categories[activeTab]?.content) ? ( 
                                <>
                                    <div className={clsx("tab-pane p-4", editable && "p-6 bg-white shadow transition-all duration-300 ease-in-out hover:bg-gray-50 dark:bg-gray-900 text-black dark:text-white")}>
                                        <div
                                            className={clsx("tiptap ProseMirror", editable && "cursor-text")}
                                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(categories[activeTab]?.content) }}
                                            onClick={editable ? openModal : undefined}
                                        />
                                    </div>

                                    
                                
                                    <div className="mt-auto">
                                        {categories[activeTab]?.has_button ? (
                                            <div className="relative w-full sm:w-auto">
                                                {editable ? (
                                                    <Button type="button" className="mt-2 w-full btn-primary cursor-pointer">
                                                        <input 
                                                            type="text" 
                                                            value={categories[activeTab]?.button_text} 
                                                            onChange={(e) => onUpdateCategory?.(categories[activeTab]?.id, 'button_text', e.target.value)} 
                                                            className="border text-lg text-center uppercase" 
                                                            maxLength={20}
                                                            onFocus={(e) => e.target.select()}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                        />
                                                    </Button>
                                                ) : (
                                                        <LinkLoading
                                                            href={route('booking.create.category', {
                                                                slug: slug ?? '',
                                                                categorySlug: categories[activeTab]?.slug
                                                            })}
                                                            className="mt-2 w-full btn-primary cursor-pointer"
                                                        >
                                                            {categories[activeTab]?.button_text}
                                                        </LinkLoading>
                                                )}
                                                {editable && (
                                                    <Button 
                                                        className="absolute top-3 right-1 p-1 -m-1 btn-primary bg-white rounded-l-full w-6 h-6 cursor-pointer hover:bg-gray-300"
                                                        onClick={() =>
                                                            onUpdateCategory?.(
                                                            categories[activeTab]?.id,
                                                            'has_button',
                                                            0
                                                            )
                                                        }
                                                    >
                                                        <X className="w-4 h-4 text-black" />
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                {editable && (
                                                    <div className="gray-card">
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                checked={!!categories[activeTab]?.has_button}
                                                                onChange={(e) => onUpdateCategory?.(
                                                                categories[activeTab]?.id,
                                                                'has_button',
                                                                e.target.checked ? 1 : 0
                                                                )}
                                                                className="w-4 h-4 cursor-pointer"
                                                            />
                                                            <div>
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    Show "Book Now" button
                                                                </span>
                                                                <p className="text-xs text-gray-500">
                                                                    When enabled, visitors can book this package category directly. Text can be changed.
                                                                </p>
                                                            </div>
                                                        </label>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <Textarea 
                                    name="contentCategoryDummy" 
                                    className="border bg-gray-100 w-full data-focus:bg-blue-100 data-hover:shadow px-4 py-2 dark:bg-gray-900 text-black dark:text-white" 
                                    placeholder="Edit your category content here..." 
                                    onClick={openModal}
                                    readOnly
                                >
                                </Textarea>
                            )
                        )}
                    </div>
                </div>

                {activeModal && (
                    <div className="fixed bottom-4 right-8 flex gap-2 z-9999">
                        <Button 
                            type="button" 
                            variant="outline"
                            className="cursor-pointer px-4 py-2" 
                            onClick={clearContent}
                        >
                            Clear
                        </Button>
                        <Button 
                            type="button" 
                            className="cursor-pointer px-4 py-2" 
                            onClick={closeModal}
                        >
                            Save
                        </Button>
                    </div>
                )}
                
            </div>
            
            {editable && (
                <SimpleEditorModal value={categories[activeTab]?.content} onChange={(newContent) => onUpdateCategory?.(categories[activeTab]?.id, 'content', newContent)} modalRef={modalRef} activeModal={activeModal} setActiveModal={setActiveModal} />
            )}                                
        </>
    );
}