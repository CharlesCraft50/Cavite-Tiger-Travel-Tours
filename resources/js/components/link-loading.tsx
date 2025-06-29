import { Loader2Icon } from 'lucide-react';
import React, { PropsWithChildren, useState } from 'react';
import { Button as UIButton } from './ui/button'; // your custom button
import clsx from 'clsx';
import { Link } from '@inertiajs/react';
import { Button as HeadlessButton } from '@headlessui/react'; // headless button you're using

type LinkLoadingProps = PropsWithChildren<{
  onClick?: () => Promise<void> | void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  useUI?: boolean; // if true, use your own UI button, else use HeadlessUI button
  loadingVisible?: boolean;
}>;

export default function LinkLoading({
  children,
  className,
  type = 'button',
  href,
  useUI = true,
  onClick,
  loadingVisible = true,
}: LinkLoadingProps) {
  const [loading, setLoading] = useState(false);

  const ButtonToRender = useUI ? UIButton : HeadlessButton;

  const handleClick = () => {
    if(href) {
      setLoading(true);
    }
    
    onClick?.();
  };

  const commonProps = {
    onClick: handleClick,
    className: clsx('cursor-pointer', className),
    disabled: loading,
    type,
  };

  return (
    <>
      {href ? (
        <Link href={href}>
          <ButtonToRender {...commonProps}>{children}</ButtonToRender>
        </Link>
      ) : (
        <ButtonToRender {...commonProps}>{children}</ButtonToRender>
      )}

      {loading && loadingVisible && (
        <div className="fixed z-[9999] inset-0 bg-black/40 flex items-center justify-center">
          <Loader2Icon className="w-18 h-18 animate-spin text-primary" />
        </div>
      )}
    </>
  );
}
