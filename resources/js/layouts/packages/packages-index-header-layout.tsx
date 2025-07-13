import PackagesIndexHeader from '@/components/packages-index-header';
import Navbar from '@/components/ui/navbar';
import { PropsWithChildren } from 'react';

type PackagesIndexHeaderLayoutProps = {
    id?: number;
    title?: string;
    src?: string;
    editable?: boolean;
}

export default function PackagesIndexHeaderLayout({
    children,
    id,
    title,
    src,
    editable,
} : PropsWithChildren<PackagesIndexHeaderLayoutProps>) {
  return (
    <>
      <Navbar />
      <PackagesIndexHeader id={id} src={src} title={title} editable={editable} />
      <div className="flex-1 m-8">
          {children}
      </div>
    </>
  )
}