import { useAuth0 } from '@auth0/auth0-react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useIOStore } from '@/lib/stores/socketIOStore';

function RootLayout() {
  const connectSocket = useIOStore(state => state.connectSocket);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      const token = await getAccessTokenSilently();

      connectSocket(token);
    })().catch(err => {
      const msg = err instanceof Error ? err.message : (err as string);

      toast.error('Server connection problem', {
        description: msg
      });
    });
  }, [connectSocket, getAccessTokenSilently, isAuthenticated]);

  return (
    <>
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
