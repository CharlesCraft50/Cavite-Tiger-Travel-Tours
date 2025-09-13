import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';
export * from './tour-package';
export * from './city';
export * from './country';
export * from './booking';
export * from './package-category';
export * from './preferred-van';
export * from './package-preferred-van';
export * from './preferred-van-availability';
export * from './other-service';
export * from './other-service-tour-package';
export * from './paginated';
export * from './booking-payment';
export * from './wishlist';
export * from './van-category';
export * from './notification';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    children?: NavItem[];
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    DRIVER = 'driver',
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: UserRole,
    created_at: string;
    updated_at: string;
    bookings_count: number;
    [key: string]: unknown; // This allows for additional properties...
}