import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import AppLogoIcon from '../app-logo-icon';
import { useState } from 'react';
import LinkLoading from '../link-loading';
import { SharedData } from '@/types';


export default function navbar() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [menuOpen, setMenuOpen] = useState(false);
    const  {auth } = usePage<SharedData>().props;
    const user = auth.user;
    
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
                        <LinkLoading href="/" useUI={false} className="text-white hover:text-indigo-600">
                            Home
                        </LinkLoading>

                        <LinkLoading href="/packages" useUI={false} className="text-white hover:text-indigo-600">
                            Packages
                        </LinkLoading>

                        <LinkLoading href="/about" useUI={false} className="text-white hover:text-indigo-600">
                            About
                        </LinkLoading>

                        <LinkLoading href="/contact" useUI={false} className="text-white hover:text-indigo-600">
                            Contact
                        </LinkLoading>
                    </div>

                    {/* Book Now Button */}
                    {!user && (
                        <div className="hidden md:flex flex-row gap-3">
                            <div className="md:flex">
                                <LinkLoading
                                    href="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </LinkLoading>
                            </div>

                            <div className="md:flex">
                                <LinkLoading
                                    href="/login"
                                    className="btn-primary"
                                >
                                    Login
                                </LinkLoading>
                            </div>
                        </div>
                    )}

                    {/* Hamburger (Mobile) */}
                    <div className="md:hidden">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700">
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-2 space-y-2 text-center mb-4">
                        <Link href="/" className="block text-white hover:text-indigo-600">Home</Link>
                        <Link href="/packages" className="block text-white hover:text-indigo-600">Packages</Link>
                        <Link href="/about" className="block text-white hover:text-indigo-600">About</Link>
                        <Link href="/contact" className="block text-white hover:text-indigo-600">Contact</Link>
                        {!user && (
                                <div className="flex gap-8 mb-4 justify-center items-center">
                                    <div className="md:flex">
                                        <LinkLoading
                                            href="/register"
                                            className="btn-primary"
                                        >
                                            Sign Up
                                        </LinkLoading>
                                    </div>

                                    <div className="md:flex">
                                        <LinkLoading
                                            href="/login"
                                            className="btn-primary"
                                        >
                                            Login
                                        </LinkLoading>
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>
        </nav>
    );
}