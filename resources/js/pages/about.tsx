import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/ui/navbar';
import { Head } from '@inertiajs/react';
import Footer from '@/components/footer';
import Index from './dashboard/about';
import TermsAndConditions from './dashboard/about/terms-and-conditions';
import PrivacyPolicy from './dashboard/about/privacy-policy';
import CancellationPolicy from './dashboard/about/cancellation-policy';
import Certifications from './dashboard/about/certifications';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <Head title='About'/>
      <div className="p-10">
        <Index disableNav />
        <Certifications disableNav />
        <TermsAndConditions disableNav />
        <PrivacyPolicy disableNav />
        <CancellationPolicy disableNav />
      </div>

      <Footer />
    </>
  );
}
