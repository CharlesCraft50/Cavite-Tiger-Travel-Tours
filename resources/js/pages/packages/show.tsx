import { TourPackage, PackageCategory, SharedData, PreferredVan, OtherService } from '@/types'
import PackageShowLayout from '@/layouts/package-show-layout'
import { Head, usePage } from '@inertiajs/react'
import DOMPurify from 'dompurify';
import { useEffect } from 'react';

// Import TipTap styles
import '@/styles/main.scss'
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"
import AddCategories from '@/components/add-categories';
import LinkLoading from '@/components/link-loading';
import OtherServiceSelection from '@/components/other-service-selection';
import VanSelection from '@/components/van-selection';
import { isAdmin } from '@/lib/utils';

type ShowPageProps = {
  packages: TourPackage;
  categories: PackageCategory[];
  category: PackageCategory;
  preferredVans: PreferredVan[];
  otherServices: OtherService[];
};

export default function ShowPage({
  packages,
  categories,
  category,
  preferredVans,
  otherServices,
} : ShowPageProps) {

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const { auth } = usePage<SharedData>().props;
  const isAdmins = isAdmin(auth.user);

  return (
    <PackageShowLayout
      packages={packages}
      editable={!!isAdmins}
    >
      <Head title={packages.title} />
      <div className="space-y-4">
        <div
          className="tiptap ProseMirror"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packages.content as string) }}
        > 
        </div>

        <LinkLoading
            href={packages.slug ? route("booking.create", { slug: packages.slug }) : undefined}
            useUI={false}
            className="btn-primary w-full mt-4"
        >
            Book This Package Now
        </LinkLoading>
        
        <div className="border-gray-900 w-full h-4" />

        {/* Additional Package Information */}
        <div className="mt-16 border-t-4 border-dashed border-pink-600 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              More About This Package
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Explore detailed sections such as inclusions, itineraries, options, and more for <span className="font-medium">{packages.title}</span>.
            </p>
          </div>

          {categories.length > 0 && (
            <AddCategories
              categories={categories} 
              slug={packages.slug}
              selectedCategory={category}
              packageTitle={packages.title}
            />
          )}

          {/* Vans Section */}
          {preferredVans.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Available Vans</h2>
              <VanSelection
                preferredVans={preferredVans}
                selectable={false}
              />
            </section>
          )}

          {/* Other Services Section */}
          {otherServices.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Optional Add-On Services</h2>
              <OtherServiceSelection 
                otherServices={otherServices}
                selectable={false}
              />
            </section>
          )}

        </div>
        
      </div>
    </PackageShowLayout>
  )
}
