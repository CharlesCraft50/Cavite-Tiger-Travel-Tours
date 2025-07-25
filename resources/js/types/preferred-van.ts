import { PreferredVanAvailability } from "./preferred-van-availability";

export interface PreferredVan {
    id: number;
    name: string;
    image_url: string;
    additional_fee: number;
    pax_adult: number;
    pax_kids: number;

    created_at: string;
    updated_at: string;

    availabilities: PreferredVanAvailability[];
}