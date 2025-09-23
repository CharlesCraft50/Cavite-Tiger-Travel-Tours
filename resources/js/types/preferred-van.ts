import { User, VanCategory } from ".";
import { PreferredVanAvailability } from "./preferred-van-availability";

export interface PreferredVan {
    id: number;
    name: string;
    image_url: string | null;
    additional_fee: number;
    pax_adult: number;
    pax_kids: number;
    plate_number?: string | null;

    created_at: string;
    updated_at: string;
    
    user_id?: number | null;
    driver?: User | null;

    availabilities: PreferredVanAvailability[];
    van_category_id?: number | null;
    category?: VanCategory;
}