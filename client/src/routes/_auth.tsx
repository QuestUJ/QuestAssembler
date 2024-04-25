import { createFileRoute, Outlet } from '@tanstack/react-router';

import { Navigation } from '@/components/navigation/Navigation';

function AuthLayout() {
  return (
    <div className='flex'>
      <nav>
        <Navigation />
      </nav>

      <main className='min-h-screen w-screen bg-gradient-to-b from-[#222] to-[#111] pt-20 lg:pt-0'>
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createFileRoute('/_auth')({
  component: AuthLayout
});
