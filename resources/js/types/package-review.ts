import { CustomTrip, TourPackage, User } from ".";

export interface PackageReview {
    id: number;
    user_id: number;
    tour_package_id?: number | null;
    custom_trip_id?: number | null;
    rating: number;
    comment?: string | null;

    user?: User;
    tourPackage?: TourPackage;
    tripPackage?: CustomTrip;
}