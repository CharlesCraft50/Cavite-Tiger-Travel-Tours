
import Navbar from '@/components/ui/navbar';
import PackagHeaderLayout from './packages/package-header-layout';

interface PackageShowLayoutProps {
    children: React.ReactNode;
    title: string;
    createdAt: string;
    updatedAt: string;
    imageUrl?: string;
    slug: string;
}

export default function PackageShowLayout({ children, title, createdAt, updatedAt, imageUrl, slug, ...props }: PackageShowLayoutProps) {
    return (
        <>
            <Navbar />
            <PackagHeaderLayout title={title} createdAt={createdAt} updatedAt={updatedAt} imageUrl={imageUrl} slug={slug} {...props}>
                {children}
            </PackagHeaderLayout>

        </>
    );
}