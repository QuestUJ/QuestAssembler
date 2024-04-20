import { Auth0Provider } from '@auth0/auth0-react';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

import { Sidebar } from '@/components/Sidebar';
import { User } from '@/components/User';
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
      >
        <SocketIOProvider>
          <Sidebar />
          <div className='flex'>
            <nav className='absolute flex w-full items-center justify-end p-4 px-32'>
              <Link to='/' className='mx-4 text-primary'>
                Home
              </Link>
              <div>|</div>
              <Link to='/rooms' className='mx-4'>
                Rooms
              </Link>
              <div>|</div>
              <User />
            </nav>
            <main className='min-h-screen w-screen'>
              <Outlet />
            </main>
          </div>
        </SocketIOProvider>
      </Auth0Provider>
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
