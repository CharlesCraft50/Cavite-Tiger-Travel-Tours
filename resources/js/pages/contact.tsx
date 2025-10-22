import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import { Head } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Head title="Contact" />
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-[500px] overflow-hidden"
      >
        {/* Background image with blur */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-xs"
          style={{
            backgroundImage:
              "url('https://i.ibb.co/zTcDc1JR/Untitled-17.png')",
          }}
        />

        {/* Black overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg">
            We're here to help you plan your next adventure.
          </p>
        </div>
      </section>


      <section className="max-w-5xl mx-auto px-6 py-16 space-y-10 text-gray-700">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Contact Information</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <MapPin className="text-primary" />
              <span>Salawag, Dasmariñas, Cavite Philippines 4114</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone className="text-primary" />
              <a href="tel:09754360179" className="hover:underline">
                0975 436 0179
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Mail className="text-primary" />
              <a href="mailto:cavitetigers2021@gmail.com" className="hover:underline">
                cavitetigers2021@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Business Hours</h2>
          <p>We are open daily from <strong>8:00 AM to 6:00 PM</strong>.</p>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4">Facebook</h2>
          <p>For updates and inquiries, visit our Facebook page:</p>
          <a
            href="https://web.facebook.com/TigertoursinCavite/?ref=page_internal"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="default" className="mt-4 flex gap-2 items-center">
              <Mail className="w-4 h-4" />
              Facebook Page
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
