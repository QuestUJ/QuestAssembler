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
    <div className='flex flex-row items-center h-8 lg:h-10'>
      <h2 className='mx-4 text-xs lg:text-sm'>{user?.name}</h2>
      <img className='h-10 rounded-full' src={user?.picture} />
      <Button className='mx-4 w-16' onClick={() => void logout()}>
        Log out
      </Button>
    </div>
  );
}
