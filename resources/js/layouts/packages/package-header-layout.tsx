import { type PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { Link } from '@inertiajs/react';

interface PackagHeaderLayoutProps {
  title: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  slug: string
}

export default function PackagHeaderLayout({
  children,
  title,
  createdAt,
  updatedAt,
  imageUrl,
  slug
}: PropsWithChildren<PackagHeaderLayoutProps>) {
  return (
    <div className="bg-white max-w-7xl mx-auto px-4 py-8">
      <header className="mb-6">
        {imageUrl && imageUrl.trim() !== "" && (
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
                <img
                src={imageUrl}
                alt="Tour Package Banner"
                className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center p-6">
                <div className="w-[30%] text-white">
                    <p className="text-sm md:text-base text-white mb-1 uppercase">{title}</p>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight uppercase">
                        Package Tours
                    </h1>
                </div>
                </div>
            </div>
            )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-4xl font-bold">{title}</h1>
            <Link
            href={"/book-now/" + slug}
            className="btn-primary"
            >
            Book Now
            </Link>
        </div>

        <p className="text-sm text-gray-500">
          Created: {dayjs(createdAt).format('MMMM D, YYYY h:mm A')} | Updated:{' '}
          {dayjs(updatedAt).format('MMMM D, YYYY h:mm A')}
        </p>
      </header>

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
