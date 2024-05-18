import { useAuth0 } from '@auth0/auth0-react';

import { SvgSpinner } from './Spinner';
import { Button } from './ui/button';

export function User() {
  const { isLoading, isAuthenticated, user, logout, loginWithRedirect } =
    useAuth0();

  if (isLoading) {
    return <SvgSpinner className='mx-10 h-10 w-10' />;
  }

  if (!isAuthenticated) {
    return (
      <Button className='mx-4' onClick={() => void loginWithRedirect()}>
        Log in
      </Button>
    );
  }

  return (
    <div className='jutify-end flex h-8 items-center gap-4 lg:h-10'>
      <h2 className='hidden text-xs lg:block lg:text-sm'>{user?.name}</h2>
      <img className='h-10 rounded-full' src={user?.picture} />
      <Button
        className='font-decorative w-16 font-bold'
        onClick={() => void logout()}
      >
        Log out
      </Button>
    </div>
  );
}
