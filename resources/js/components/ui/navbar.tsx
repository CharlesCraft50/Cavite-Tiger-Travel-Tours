import { Link, usePage } from '@inertiajs/react';
import { Menu, Search, User, UserCircle, X } from 'lucide-react';
import AppLogoIcon from '../app-logo-icon';
import { useEffect, useRef, useState } from 'react';
import LinkLoading from '../link-loading';
import { SharedData } from '@/types';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { UserMenuContent } from "../user-menu-content";


export default function navbar({ hasSearchBar, removeNavItems = false, inDashboard } : { hasSearchBar?: boolean, removeNavItems?: boolean, inDashboard?: boolean }) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [menuOpen, setMenuOpen] = useState(false);
    const  {auth } = usePage<SharedData>().props;
    const [ searchQuery, setSearchQuery ] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const user = auth.user;
    const searchRef = useRef<HTMLDivElement>(null);

    const fetchPackagesSearch = async (query: string) => {
        try {
            const response = await fetch(`/api/packages?search=${encodeURIComponent(query)}`);
            const data = await response.json();
            setSearchResults(data.packages);
        } catch (e) {
            console.error('Search error', e);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        fetchPackagesSearch(value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const { component } = usePage();
    const isDashboard = component.startsWith("dashboard");
    
    return (
        <nav className="bg-neutral-800 border-b shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}

                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <AppLogoIcon className="h-14 w-auto shrink-0 text-red-800" />
                        {isDashboard ? (
                            <Link href="/dashboard" className="text-xl font-bold text-white">Cavite Tiger Travel and Tours</Link>
                        ) : (
                            <Link href="/" className="text-xl font-bold text-white">Cavite Tiger Travel and Tours</Link>
                        )}
                    </div>

                    {/* Desktop Nav */}
                    {hasSearchBar ? (
                        <div className="md:flex w-full items-center justify-center">
                            <div className="relative w-[50%]" ref={searchRef}>
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Search size={20} />
                                </span>
                                <input
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    type="text"
                                    className="border rounded-lg p-2 pl-9 bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search for destination, packages, and tours"
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-64 overflow-auto">
                                        {searchResults.map((pkg: any) => (
                                            <Link
                                                key={pkg.id}
                                                href={`/packages/${pkg.slug}`}
                                                className="block px-4 py-2 hover:bg-gray-100"
                                            >
                                                {pkg.title} — {pkg.city?.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        !removeNavItems && (
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
                        )
                    )}

                    {/* Book Now Button */}
                    {!user ? (
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
                    ) : (
                        <div className="hidden rounded md:flex flex-row gap-3">
                            <div className="md:flex">
                                {inDashboard ? (
                                    <div className="flex items-center gap-2 whitespace-nowrap bg-white p-2 border rounded-full">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="flex flex-col cursor-pointer items-center text-gray-600 hover:text-primary">
                                                    <User size={20} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56 mt-4 z-[999] ml-2">
                                                <UserMenuContent user={auth.user} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-2 whitespace-nowrap bg-white p-2 border rounded-full">
                                        <button
                                            className="flex flex-row cursor-pointer gap-2 items-center text-gray-600 hover:text-primary"
                                            onClick={() => window.location.href = '/dashboard'}
                                        >
                                            <User size={20} />
                                            Dashboard
                                        </button>
                                    </div>
                                )}
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