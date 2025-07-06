export interface PreferredVanAvailability {
    id: number;
    preferred_van_id: number;
    available_from: string | null;
    available_until: string | null;
    count: number | null;
}