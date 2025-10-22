import Navbar from '@/components/ui/navbar';
import { Head, Link, usePage } from '@inertiajs/react';
import Footer from '@/components/footer';
import { SharedData, TourPackage } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function IndexPage({ packages }: { packages: TourPackage[] }) {
  const { auth } = usePage<SharedData>().props;
  const user = auth.user;

  return (
    <>
      <Navbar />
      <Head title='Cavite Tiger Travel & Tours' />

      {/* Hero Section */}
      <section className="relative bg-black text-white">
      <div className="absolute inset-0">
        {/* Background image with blur */}
        <img
          src="https://i.ibb.co/HfGz7MW5/Untitled-16.png"
          alt="Van on tour"
          className="w-full h-full object-cover blur-xs"
        />

        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 text-center px-6 py-28 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          <span className="text-red-600">CAVITE TIGER TRAVEL & TOURS</span>
        </h1>
        <h2 className="text-3xl font-bold">Your Safety Is Our Top Priority</h2>
        <p className="mt-4 text-lg">
          Professionally trained and safety-conscious driver. Well-maintained vans with passenger insurance.
        </p>
        <Link href={user ? route('localTrip') : route('packages.index')}>
          <button className="mt-6 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-full font-semibold">
            VIEW BOOKINGS
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
      <section className="py-16 px-6 bg-red-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Tour Packages</h2>

        <div className="max-w-6xl mx-auto relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 }, // show 2 slides at md and up
            }}
            loop
            className="pb-10 mySwiper"
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
          >
            {packages.map((pkg: TourPackage) => (
              <SwiperSlide key={pkg.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={pkg.image_overview || ''}
                    alt={pkg.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{pkg.title}</h3>
                    <p className="text-sm text-gray-600">{pkg.subtitle}</p>
                    <Link href={`/packages/${pkg.slug}`}>
                      <button className="mt-4 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm">
                        View →
                      </button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next !text-[#fb2056]" />
            <div className="swiper-button-prev !text-[#fb2056]" />
          </Swiper>
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
          {/* <Link href="/packages/north">
            <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold">
              LEARN MORE →
            </button>
          </Link> */}
        </div>
      </section>

      {/* Bible Verse Rotator */}
      <div className="relative z-10 mt-12 text-center">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 5000, // 5 seconds per verse
            disableOnInteraction: false,
          }}
          loop
          allowTouchMove={false}
          className="max-w-2xl mx-auto"
        >
          <SwiperSlide>
            <p className="text-xl italic">“In their hearts humans plan their course, but the Lord establishes their steps.”</p>
            <p className="mt-2 text-sm text-primary">— Proverbs 16:9</p>
          </SwiperSlide>

          <SwiperSlide>
            <p className="text-xl italic">“So do not fear, for I am with you; do not be dismayed, for I am your God.”</p>
            <p className="mt-2 text-sm text-primary">— Isaiah 41:10</p>
          </SwiperSlide>

          <SwiperSlide>
            <p className="text-xl italic">“For he will command his angels concerning you to guard you in all your ways.”</p>
            <p className="mt-2 text-sm text-primary">— Psalm 91:11</p>
          </SwiperSlide>
        </Swiper>
      </div>


      <Footer />
    </>
  );
}
