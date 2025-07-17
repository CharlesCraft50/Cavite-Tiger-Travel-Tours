import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import { Head } from '@inertiajs/react';
import Footer from '@/components/footer';

export default function AboutPage() {
  return (
    <>
        <Navbar />
        <Head title='About'/>
      <section className="relative bg-cover bg-center bg-no-repeat min-h-[500px]" style={{ backgroundImage: "url('https://cavitetigerstravelandtours.netlify.app/wp-content/uploads/2022/06/290875293_713107549780355_8510002955865993783_n.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">About Cavite Tiger Travel & Tours</h1>
          <p className="text-lg">
            Your trusted travel partner for unforgettable adventures across the Philippines.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10 text-gray-700">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Who We Are</h2>
          <p>
            Cavite Tiger Travel & Tours is a proudly local travel agency based in Cavite,
            Philippines. We specialize in crafting personalized and exciting tour experiences
            across Luzon and beyond, offering packages that cater to solo travelers, families,
            barkadas, and corporate groups.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li>Customized Tour Packages for Local and International Destinations</li>
            <li>Comfortable Van Rentals with Professional Drivers</li>
            <li>Affordable Pricing with Flexible Inclusions</li>
            <li>Safe and Hassle-Free Booking Experience</li>
            <li>Guided Group Tours and Educational Trips</li>
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p>
            To provide every traveler with the opportunity to explore the beauty of the
            Philippines while experiencing comfort, safety, and top-notch customer service.
          </p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Connect With Us</h2>
          <p>
            We’d love to hear from you! Visit us on Facebook or reach out through our contact
            details below:
          </p>
          <a
            href="https://web.facebook.com/TigertoursinCavite/?ref=page_internal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="default" className="mt-4 flex gap-2 items-center">
              <ExternalLink className="w-4 h-4" />
              Facebook Page
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
