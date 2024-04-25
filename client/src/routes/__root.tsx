import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, Outlet } from '@tanstack/react-router';

import { Toaster } from '@/components/ui/toaster';
import { config } from '@/config';
import { SocketIOProvider } from '@/providers/SocketIOProvider';

function RootLayout() {
  const { AUTH0_DOMAIN, AUTH0_CLIENTID, AUTH0_AUDIENCE } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_CLIENTID',
    'AUTH0_AUDIENCE'
  ]);

  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENTID}
          authorizationParams={{
            redirect_uri: `${window.location.origin}/dashboard/`,
            audience: AUTH0_AUDIENCE
          }}
          cacheLocation='localstorage'
        >
          <SocketIOProvider>
            <Outlet />
            <Toaster />
          </SocketIOProvider>
        </Auth0Provider>
      </QueryClientProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
