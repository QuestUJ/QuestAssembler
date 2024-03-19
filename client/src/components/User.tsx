import { useAuth0 } from '@auth0/auth0-react';

import { Button } from './ui/button';

export function User() {
  const { isLoading, isAuthenticated, user, logout, loginWithRedirect } =
    useAuth0();

  if (isLoading) {
    return <h1 className='mx-4'>Loading auth</h1>;
  }

  if (!isAuthenticated) {
    return (
      <Button className='mx-4' onClick={() => void loginWithRedirect()}>
        Log in
      </Button>
    );
  }

  return (
    <>
      <h2 className='mx-4'>{user?.name}</h2>
      <img className='h-12 w-12 rounded-full' src={user?.picture} />
      <Button className='mx-4' onClick={() => void logout()}>
        Log out
      </Button>
    </>
  );
}
