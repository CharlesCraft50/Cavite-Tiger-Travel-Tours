import PackagesIndexHeader from '@/components/packages-index-header';
import Navbar from '@/components/ui/navbar';
import { type PropsWithChildren } from 'react';

type PackagesIndexHeaderLayoutProps = {
    title?: string;
}

export default function PackagesIndexHeaderLayout({
    children,
    title
} : PropsWithChildren<PackagesIndexHeaderLayoutProps>) {
  return (
    <>
        <Navbar />
        <PackagesIndexHeader title={title} />
        <div className="flex-1 m-8">
            {children}
        </div>
        <></>
    </>
  )
}