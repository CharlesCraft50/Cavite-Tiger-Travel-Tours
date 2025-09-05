import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import InertiaLoadingListener from '@/components/InertiaLoadingListener';
import { LoadingProvider } from './components/ui/loading-provider';
import TravelChatbot from './components/travel-chatbot';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    const currentPage = props.initialPage?.component || '';

    root.render(
      <LoadingProvider>
        {!['packages/create', 'packages/edit'].includes(currentPage) && <TravelChatbot />}
        <InertiaLoadingListener />
        <App {...props} />
      </LoadingProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});

initializeTheme();
