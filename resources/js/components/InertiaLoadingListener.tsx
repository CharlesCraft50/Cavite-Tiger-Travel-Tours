import { router } from '@inertiajs/react';
import { useLoading } from './ui/loading-provider';
import { useEffect } from 'react';

export default function InertiaLoadingListener() {
  const { start, stop } = useLoading();

  useEffect(() => {
    const stopLoadingStart = router.on('start', () => start());
    const stopLoadingFinish = router.on('finish', () => stop());

    return () => {
      stopLoadingStart();
      stopLoadingFinish();
    };
  }, []);
  
  return null;
}
