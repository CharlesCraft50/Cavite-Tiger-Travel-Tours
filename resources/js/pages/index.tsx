import Navbar from '@/components/ui/navbar';
import { Head, Link } from '@inertiajs/react';
import Footer from '@/components/footer';
import { TourPackage } from '@/types';

export default function IndexPage({ packages }: { packages: TourPackage[] }) {
  return (
    <>
      <Navbar />
      <Head title='Cavite Tiger Travel & Tours' />

      {/* Hero Section */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0">
          {/* Black semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/60" />

          {/* Background image */}
          <img
            src="https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/290875293_713107549780355_8510002955865993783_n.jpg"
            alt="Van on tour"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center px-6 py-28 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-red-600">CAVITE TIGER TRAVEL & TOURS</span>
          </h1>
          <h2 className="text-3xl font-bold">SAFE TRAVEL</h2>
          <p className="mt-4 text-lg">
            Professionally trained and safety-conscious driver. Well-maintained vans with passenger insurance.
          </p>
          <Link href="/packages">
            <button className="mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full font-semibold">
              BOOK NOW
            </button>
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-white text-center py-12 px-4">
        <p className="text-2xl italic text-gray-700 max-w-3xl mx-auto">
          "Traveling - it leaves you speechless, then turns you into a storyteller"
        </p>
        <div className="mt-4 flex justify-center items-center gap-3">
          <img
            src="https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/josh-mcguigan-5RwM_ST58WA-unsplash-683x1024.jpg"
            alt="Portrait of Ibn Battuta"
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="text-sm font-medium">- Ibn Battuta</p>
        </div>
      </section>

      {/* South Luzon Section */}
      <section className="py-16 px-6 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Tour Packages</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {packages.map((pkg: TourPackage) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden w-full md:w-1/3">
              <img
                src={pkg.image_overview || ''}
                alt={pkg.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{pkg.title}</h3>
                <p className="text-sm text-gray-600">
                  {pkg.subtitle}
                </p>
                <Link href={`/packages/${pkg.slug}`}>
                  <button className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm">
                    LEARN MORE →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Northern Luzon Section */}
      <section
        className="text-white py-32 px-6 bg-fixed bg-center bg-cover relative"
        style={{
          backgroundImage: "url('https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2020/01/section-bg-img.jpg')",
        }}
      >
        <div className="bg-black/60 absolute inset-0 z-0" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">EXPLORE THE NORTHERN LUZON</h2>
          <p className="text-lg">
            Northern Luzon – Looking for beautiful beaches, towering mountains, or endless rice terraces? Wherever you go, the scenery is stunning.
          </p>
          <p className="mt-4">
            Nestled among its many landscapes are beautiful mountain villages and beachside towns, while the colonial center of Vigan has many fascinating historical and cultural sights on show.
          </p>
          <Link href="/packages/north">
            <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold">
              LEARN MORE →
            </button>
          </Link>
        </div>
      </section>


      <Footer />
    </>
  );
}
