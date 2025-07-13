import { OtherServiceTourPackage } from './other-service-tour-package';
export interface OtherService {
    id: number;
    name: string;
    image_url: string;
    price: number;
    description: string;

    pivot?: OtherServiceTourPackage;

    created_at: string
    updated_at: string;
}