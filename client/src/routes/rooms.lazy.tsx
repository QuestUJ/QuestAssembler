import { createLazyFileRoute } from '@tanstack/react-router';

function RoomsRoute() {
  return (
    <>
      <h1>Rooms showcase</h1>
    </>
  );
}

export const Route = createLazyFileRoute('/rooms')({
  component: RoomsRoute
});
