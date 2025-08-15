import { Link, usePage } from "@inertiajs/react";
import { Package, User, Facebook, Mail, Phone, BookOpenText } from "lucide-react";

import { SharedData } from "@/types";

export default function BottomNav() {
    const { auth } = usePage<SharedData>().props;
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t flex items-center justify-between px-4 py-2 z-[999]">
      {/* Tabs (center) */}
      <div className="flex gap-6 ml-12">

        <Link href="/about" className="flex flex-col cursor-pointer items-center text-gray-600 hover:text-blue-500">
          <BookOpenText size={20} />
          <span className="text-xs">About</span>
        </Link>
        <Link href="/packages" className="flex flex-col cursor-pointer items-center text-gray-600 hover:text-blue-500">
          <Package size={20} />
          <span className="text-xs">Packages</span>
        </Link>
        <Link href="/contact" className="flex flex-col cursor-pointer items-center text-gray-600 hover:text-blue-500">
          <Phone size={20} />
          <span className="text-xs">Contact</span>
        </Link>
      </div>

      {/* Social icons (right) */}
      <div className="flex gap-4 mr-24">
        <a href="https://www.facebook.com/profile.php?id=100093876846720" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80">
          <Facebook size={20} />
        </a>
        <a href="mailto:gilbertarasan8@gmail.com" className="text-red-500 hover:opacity-80">
          <Mail size={20} />
        </a>
      </div>
    </div>
  );
}
