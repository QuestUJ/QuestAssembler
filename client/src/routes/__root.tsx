import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

function RootLayout() {
  return (
    <>
      <nav className='absolute flex w-full justify-end p-4 px-32'>
        <Link to='/' className='mx-4 text-primary'>
          Home
        </Link>
        <div>|</div>
        <Link to='/rooms' className='mx-4'>
          Rooms
        </Link>
      </nav>
      <main className='min-h-screen w-screen'>
        <Outlet />
      </main>
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
