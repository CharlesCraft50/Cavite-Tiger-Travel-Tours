export interface PackageCategory {
    id: number;

    tour_package_id: number;
    name: string;
    content: string;
    has_button: number;
    button_text: string;
    slug?: string;

    created_at: string;
    updated_at: string;
}