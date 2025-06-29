import PackagesIndexHeader from '@/components/packages-index-header';
import { LoadingProvider } from '@/components/ui/loading-provider';
import Navbar from '@/components/ui/navbar';
import { type PropsWithChildren } from 'react';

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
    <LoadingProvider>
      <Navbar />
      <PackagesIndexHeader id={id} src={src} title={title} editable={editable} />
      <div className="flex-1 m-8">
          {children}
      </div>
    </LoadingProvider>
  )
}