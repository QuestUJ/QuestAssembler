import {
  createLazyFileRoute,
  getRouteApi,
  Outlet
} from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { NotificationAvatar } from '@/components/NotificationAvatar';
import { useChangeCharacterDetailsEvent } from '@/lib/socket/changeCharacterDetailsEvent';
import { useChangeRoomSettingsEvent } from '@/lib/socket/changeRoomSettingsEvent';
import { useMessageEvent } from '@/lib/socket/messageEvent';
import { useNewPlayerEvent } from '@/lib/socket/newPlayerEvent';
import { useNewTurnEvent } from '@/lib/socket/newTurnEvent';
import { usePlayerLeftEvent } from '@/lib/socket/playerLeftEvent';
import { usePlayerReadyEvent } from '@/lib/socket/playerReadyEvent';
import { useRoomDeletionEvent } from '@/lib/socket/roomDeletion';
import { useSubscribeToRoom } from '@/lib/socket/subscribeToRoom';

const route = getRouteApi('/_sidebar-layout/room/$roomId');

function RoomLayout() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  useSubscribeToRoom(roomUUID);
  useNewPlayerEvent(roomUUID, NotificationAvatar);
  usePlayerLeftEvent(roomUUID, NotificationAvatar);
  useChangeCharacterDetailsEvent(roomUUID);
  useChangeRoomSettingsEvent(roomUUID);
  usePlayerReadyEvent(roomUUID, NotificationAvatar);
  useNewTurnEvent(roomUUID);
  useRoomDeletionEvent();
  useMessageEvent(roomUUID, NotificationAvatar);

  return <Outlet />;
}

export const Route = createLazyFileRoute('/_sidebar-layout/room/$roomId')({
  component: RoomLayout
});
