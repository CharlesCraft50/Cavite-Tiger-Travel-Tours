// AppWrapper.tsx
import { LoadingProvider } from '@/components/ui/loading-provider';
import { PropsWithChildren } from 'react';

export default function AppWrapper({ children }: PropsWithChildren) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
}
