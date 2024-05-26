import {
  createLazyFileRoute,
  getRouteApi,
  Outlet
} from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { useChangeCharacterDetailsEvent } from '@/lib/socket/changeCharacterDetailsEvent';
import { useChangeRoomSettingsEvent } from '@/lib/socket/changeRoomSettingsEvent';
import { useNewPlayerEvent } from '@/lib/socket/newPlayerEvent';
import { useNewTurnEvent } from '@/lib/socket/newTurnEvent';
import { usePlayerReadyEvent } from '@/lib/socket/playerReadyEvent';
import { useSubscribeToRoom } from '@/lib/socket/subscribeToRoom';

const route = getRouteApi('/_auth/room/$roomId');

function RoomLayout() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  useSubscribeToRoom(roomUUID);
  useNewPlayerEvent(roomUUID);
  useChangeCharacterDetailsEvent(roomUUID);
  useChangeRoomSettingsEvent(roomUUID);
  usePlayerReadyEvent(roomUUID);
  useNewTurnEvent(roomUUID);

  return <Outlet />;
}

export const Route = createLazyFileRoute('/_auth/room/$roomId')({
  component: RoomLayout
});
