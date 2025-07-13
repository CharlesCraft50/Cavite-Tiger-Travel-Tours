import Navbar from '@/components/ui/navbar';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type PageLayoutProps = {
    className?: string;
};

export default function PageLayout({ children, className, ...props }: PropsWithChildren<PageLayoutProps>) {
    return (
        <div {...props}>
            <Navbar />
            <div className={clsx("m-4 flex flex-col gap-4", className)}>
                {children}
            </div>
        </div>
    );
}