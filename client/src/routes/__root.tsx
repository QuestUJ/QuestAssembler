import { Auth0Provider } from '@auth0/auth0-react';
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

  console.log(AUTH0_DOMAIN, AUTH0_CLIENTID, AUTH0_AUDIENCE);

  return (
    <>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENTID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: AUTH0_AUDIENCE
        }}
        cacheLocation='localstorage'
      >
        <SocketIOProvider>
          <main className='min-h-screen w-screen'>
            <Outlet />
            <Toaster />
          </main>
        </SocketIOProvider>
      </Auth0Provider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
