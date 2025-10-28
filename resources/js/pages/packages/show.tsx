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
import 'swiper/css';
import 'swiper/css/pagination';

type ShowPageProps = {
  packages: TourPackage;
  categories: PackageCategory[];
  category?: PackageCategory;
  preferredVans: PreferredVan[];
  otherServices: OtherService[];
  isWishlisted?: boolean;
  disableNav?: boolean;
  onLocalTrip?: boolean;
};

export default function ShowPage({
  packages,
  categories,
  category,
  preferredVans,
  otherServices,
  isWishlisted,
  disableNav = false,
}: ShowPageProps) {

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  const { auth } = usePage<SharedData>().props;
  const isAdmins = isAdmin(auth.user);

  return (
      <PackageShowLayout
        packages={packages}
        editable={!!isAdmins}
        auth={auth}
        isWishlisted={isWishlisted}
        disableNav={disableNav}
      >
        <Head title={packages.title} />

        

        <div className="space-y-4">
          <div
            className="tiptap ProseMirror"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packages.content as string) }}
          /> 

          <LinkLoading
            href={packages.slug ? route("booking.create", { slug: packages.slug }) : undefined}
            useUI={false}
            className="btn-primary w-full mt-4"
          >
            Book This Package Now
          </LinkLoading>

          <div className="border-gray-900 w-full h-4" />

          {/* Vans Section */}
          {preferredVans?.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Available Vans</h2>
              <VanSelection preferredVans={preferredVans} selectable={false} />
            </section>
          )}
        </div>
      </PackageShowLayout>
  )
}
