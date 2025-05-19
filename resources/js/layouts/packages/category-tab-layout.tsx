import CategoryTab from '@/components/ui/categorytab';
import { PackageCategory } from '@/types'
import { Button } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

type CategoryTabLayoutProps = {
    categories: PackageCategory[],
    slug: string
}

export default function CategoryTabLayout({ categories, slug }: CategoryTabLayoutProps ) {
    const [ activeTab, setActiveTab ] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    }
    
    return (
        <>
            {/* Tab Structure */}
            {categories.length > 0 && (
            <div className="mt-8">
                <div className="tb-heading">
                    <ul className="flex flex-col sm:flex-wrap sm:flex-row gap-2 w-full overflow-x-auto">
                        {categories.map((category, index) => (
                            <CategoryTab className={
                                `${activeTab === index
                                    ? 'bg-[#fb2056] text-white font-semibold'
                                    : 'bg-gray-500 text-white'
                                } w-full sm:w-auto cursor-pointer px-4 sm:px-6 py-2 sm:py-2 flex items-center gap-2 text-sm font-bold uppercase text-center justify-center`} 
                                name={category.name} 
                                onClick={() => handleTabClick(index)} 
                                hasIndicator={true} 
                                key={category.id} /> 
                        ))}
                    </ul>
                </div>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                    <div className="tab-pane">
                        <p>{categories[activeTab]?.content}</p>
                        {!!categories[activeTab]?.has_button && (
                            <Link href={route('booking.create', {
                                slug: slug,
                                category_id: categories[activeTab]?.id
                            })}>
                                <Button className="mt-2 w-full btn-primary cursor-pointer">Book Now</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            )}
        </>
    );
}