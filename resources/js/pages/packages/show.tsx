import { TourPackage, PackageCategory } from '@/types'
import PackageShowLayout from '@/layouts/package-show-layout'
import { Head } from '@inertiajs/react'
import CategoryTabLayout from '@/layouts/packages/category-tab-layout'

export default function ShowPage({
  packages,
  categories,
}: {
  packages: TourPackage
  categories: PackageCategory[]
}) {

  return (
    <PackageShowLayout
      title={packages.title}
      createdAt={packages.created_at}
      updatedAt={packages.updated_at}
      imageUrl={packages.image_url || ""}
      slug={packages.slug}
    >
      <Head title={packages.title} />
      <div className="space-y-4">
        <div>{packages.content}</div>

        <CategoryTabLayout categories={categories} slug={packages.slug} />
        <button className="bg-secondary">Test</button>
      </div>
    </PackageShowLayout>
  )
}
