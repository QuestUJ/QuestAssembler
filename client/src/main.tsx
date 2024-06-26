import './index.css';

import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { config } from '@/config';

import { Toaster } from './components/ui/sonner';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  const { AUTH0_DOMAIN, AUTH0_CLIENTID, AUTH0_AUDIENCE } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_CLIENTID',
    'AUTH0_AUDIENCE'
  ]);

  const queryClient = new QueryClient();

  const onRedirectCallback = (appState: AppState | undefined) => {
    if (appState?.returnTo) {
      window.location.replace(appState.returnTo);
    }
  };

  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENTID}
          authorizationParams={{
            redirect_uri: `${window.location.origin}/dashboard/`,
            audience: AUTH0_AUDIENCE
          }}
          cacheLocation='localstorage'
          onRedirectCallback={onRedirectCallback}
        >
          <RouterProvider router={router} />
          <Toaster />
          <ReactQueryDevtools />
        </Auth0Provider>
      </QueryClientProvider>
    </StrictMode>
  );
}
