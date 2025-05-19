import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import AppLogoIcon from '../app-logo-icon';


export default function navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
        <nav className="bg-neutral-800 border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <AppLogoIcon className="h-14 w-auto shrink-0 text-red-800" />
                        <Link href="/" className="text-xl font-bold text-white">Cavite Tiger</Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex space-x-6">
                        <Link href="/" className="text-white hover:text-indigo-600">Home</Link>
                        <Link href="/packages" className="text-white hover:text-indigo-600">Packages</Link>
                        <Link href="/about" className="text-white hover:text-indigo-600">About</Link>
                        <Link href="/contact" className="text-white hover:text-indigo-600">Contact</Link>
                    </div>

                    {/* Book Now Button */}
                    <div className="hidden md:flex">
                        <Link
                            href="/book-now"
                            className="btn-primary"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Hamburger (Mobile) */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-2 space-y-2">
                        <Link href="/" className="block text-gray-700 hover:text-indigo-600">Home</Link>
                        <Link href="/packages" className="block text-gray-700 hover:text-indigo-600">Packages</Link>
                        <Link href="/about" className="block text-gray-700 hover:text-indigo-600">About</Link>
                        <Link href="/contact" className="block text-gray-700 hover:text-indigo-600">Contact</Link>
                        <Link
                            href="/book-now"
                            className="btn-primary"
                        >
                            Book Now
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}