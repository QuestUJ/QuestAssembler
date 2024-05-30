import { SocketPlayerDetails } from '@quasm/common';
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
import { usePlayerLeftEvent } from '@/lib/socket/playerLeftEvent';
import { usePlayerReadyEvent } from '@/lib/socket/playerReadyEvent';
import { useRoomDeletionEvent } from '@/lib/socket/roomDeletion';
import { useSubscribeToRoom } from '@/lib/socket/subscribeToRoom';

const route = getRouteApi('/_sidebar-layout/room/$roomId');

function Avatar(player: SocketPlayerDetails) {
  return (
    <img className='rounded-full' src={player.profileIMG} alt={player.nick} />
  );
}

function RoomLayout() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  useSubscribeToRoom(roomUUID);
  useNewPlayerEvent(roomUUID, Avatar);
  usePlayerLeftEvent(roomUUID, Avatar);
  useChangeCharacterDetailsEvent(roomUUID);
  useChangeRoomSettingsEvent(roomUUID);
  usePlayerReadyEvent(roomUUID);
  useNewTurnEvent(roomUUID);
  useRoomDeletionEvent();

  return <Outlet />;
}

export const Route = createLazyFileRoute('/_sidebar-layout/room/$roomId')({
  component: RoomLayout
});
