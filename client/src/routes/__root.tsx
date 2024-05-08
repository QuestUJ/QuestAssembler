import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}

export const Route = createRootRoute({
  component: RootLayout
});
