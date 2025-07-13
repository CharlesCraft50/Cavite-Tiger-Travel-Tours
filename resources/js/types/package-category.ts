export interface PackageCategory {
    id: number;

    tour_package_id: number;
    name: string;
    content: string;
    has_button: number;
    button_text: string;
    slug?: string;

    use_custom_price?: boolean;
    custom_price?: number;

    created_at: string;
    updated_at: string;
}