import { TourPackage, PackageCategory } from '@/types'
import PackageShowLayout from '@/layouts/package-show-layout'
import { Head } from '@inertiajs/react'
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


export default function ShowPage({
  packages,
  categories,
  category
}: {
  packages: TourPackage
  categories: PackageCategory[]
  category: PackageCategory
}) {

  useEffect(() => {
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <PackageShowLayout
      packages={packages}
    >
      <Head title={packages.title} />
      <div className="space-y-4">
        <div
          className="tiptap ProseMirror"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(packages.content as string) }}
        ></div>

        <AddCategories 
            categories={categories} 
            slug={packages.slug}
            selectedCategory={category}
        />
        
      </div>
    </PackageShowLayout>
  )
}
