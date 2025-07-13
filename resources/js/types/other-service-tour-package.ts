export interface OtherServiceTourPackage {
    id: number;
    tour_package_id: number;
    other_service_id: number;
    package_specific_price: number;
    is_recommended: boolean;
    sort_order: number;

    created_at: string;
    updated_at: string;
}