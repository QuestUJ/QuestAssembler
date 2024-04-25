import { Auth0Provider } from '@auth0/auth0-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRoute,
  Outlet,
  useRouterState
} from '@tanstack/react-router';

import { Navigation } from '@/components/navigation/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { config } from '@/config';
import { cn } from '@/lib/utils';
import { SocketIOProvider } from '@/providers/SocketIOProvider';

function RootLayout() {
  const { AUTH0_DOMAIN, AUTH0_CLIENTID, AUTH0_AUDIENCE } = config.pick([
    'AUTH0_DOMAIN',
    'AUTH0_CLIENTID',
    'AUTH0_AUDIENCE'
  ]);

  const queryClient = new QueryClient();
  const routerState = useRouterState();

  return (
    <>
      <QueryClientProvider client={queryClient}>
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
            <div className='flex'>
              {routerState.location.pathname !== '/' && (
                <nav>
                  <Navigation />
                </nav>
              )}

              <main
                className={cn(
                  'min-h-screen w-screen',
                  routerState.location.pathname !== '/' && 'pt-20 lg:pt-0'
                )}
              >
                <Outlet />
                <Toaster />
              </main>
            </div>
          </SocketIOProvider>
        </Auth0Provider>
      </QueryClientProvider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
