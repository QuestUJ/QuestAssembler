import { withAuthenticationRequired } from '@auth0/auth0-react';
import { createFileRoute, Outlet } from '@tanstack/react-router';

import { Navigation } from '@/components/navigation/Navigation';

function AuthLayout() {
  return (
    <div className='flex h-screen'>
      <nav>
        <Navigation />
      </nav>

      <main className='h-full min-h-screen w-screen bg-gradient-to-b from-[#222] to-[#111] pt-20'>
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createFileRoute('/_auth')({
  component: withAuthenticationRequired(AuthLayout)
});
