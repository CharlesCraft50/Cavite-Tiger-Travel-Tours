import { type PropsWithChildren } from 'react';
import PackageHeader from '@/components/package-header';
import { TourPackage } from '@/types';

interface PackagHeaderLayoutProps {
  packages: TourPackage;
}

export default function PackagHeaderLayout({
  children,
  packages
}: PropsWithChildren<PackagHeaderLayoutProps>) {
  return (
    <div className="bg-white max-w-7xl mx-auto px-4 py-8">
      <PackageHeader 
        title={packages.title} 
        imageBanner={packages.image_banner as string} 
        created_at={packages.created_at} 
        updated_at={packages.updated_at}
        textSize="large"
        bookingLink={"/book-now/" + packages.slug}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">{children}</div>

        <aside className="w-full lg:w-80">
          <div className="sticky top-20">
            <iframe
              title="Facebook Page"
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FTigertoursinCavite&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="100%"
              height="500"
              style={{ border: 'none', overflow: 'hidden' }}
              scrolling="no"
              frameBorder="0"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </aside>
      </div>
    </div>
  );
}
