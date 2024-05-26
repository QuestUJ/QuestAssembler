import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { useGetRoom } from '@/lib/api/getRoom';
import { useGetRoomPlayers } from '@/lib/api/getRoomPlayers';
import { useChangeCharacterDetailsEvent } from '@/lib/socket/changeCharacterDetailsEvent';
import { useChangeRoomSettingsEvent } from '@/lib/socket/changeRoomSettingsEvent';
import { useNewPlayerEvent } from '@/lib/socket/newPlayerEvent';
import { useNewTurnEvent } from '@/lib/socket/newTurnEvent';
import { usePlayerReadyEvent } from '@/lib/socket/playerReadyEvent';
import { useSubscribeToRoom } from '@/lib/socket/subscribeToRoom';
import { useQuasmStore } from '@/lib/stores/quasmStore';

import { CharacterSettingsDialog } from '../dialogs/CharacterSettingsDialog';
import { LeaveRoomDialog } from '../dialogs/LeaveRoomDialog';
import { RoomSettingsDialog } from '../dialogs/RoomSettingsDialog';
import LogoWithText from '../LogoWithText';
import { SvgSpinner } from '../Spinner';
import { Accordion } from '../ui/accordion';
import { CharactersAccordion } from './content/CharactersAccordion';
import { ToolsAccordion } from './content/ToolsAccordion';

export function SidebarContentRoom() {
  const { setRoomName, setIsGameMaster, isGameMaster } = useQuasmStore();

  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  const roomUUID = shortUUID().toUUID(roomId);

  const { data: roomDetails } = useGetRoom(roomUUID);
  const { data: players } = useGetRoomPlayers(roomUUID);

  useEffect(() => {
    setRoomName(roomDetails?.roomName);
    setIsGameMaster(
      roomDetails?.currentPlayer.id === roomDetails?.gameMasterID
    );
  }, [roomDetails, setRoomName, setIsGameMaster]);

  useSubscribeToRoom(roomUUID);
  useNewPlayerEvent(roomUUID);
  useChangeCharacterDetailsEvent(roomUUID);
  useChangeRoomSettingsEvent(roomUUID);
  usePlayerReadyEvent(roomUUID);
  useNewTurnEvent(roomUUID);

  return (
    <div className='flex h-full flex-col justify-between p-4'>
      <div>
        <div className='flex flex-row justify-center'>
          <LogoWithText />
        </div>
        <Accordion type='multiple'>
          <CharactersAccordion
            gameMaster={roomDetails?.gameMasterID}
            characters={players}
          />
          <ToolsAccordion />
        </Accordion>
      </div>
      <div className='w-full'>
        <div className='flex h-12 flex-row items-center justify-between'>
          <div className='flex h-full items-center'>
            {!roomDetails ? (
              <SvgSpinner className='ml-4 h-10 w-10' />
            ) : (
              <CharacterSettingsDialog
                nick={roomDetails?.currentPlayer.nick}
                profilePicture={roomDetails.currentPlayer.profileIMG}
              />
            )}
          </div>
          {isGameMaster ? <RoomSettingsDialog /> : <LeaveRoomDialog />}
        </div>
      </div>
    </div>
  );
}
