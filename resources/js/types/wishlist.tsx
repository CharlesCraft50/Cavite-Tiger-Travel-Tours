import { User } from ".";
import { TourPackage } from "./tour-package";

export interface Wishlist {
    id: number;
    tour_package_id: number;
    user_id: number;

    tour_package: TourPackage;
    user: User;

    created_at: string;
    updated_at: string;
}