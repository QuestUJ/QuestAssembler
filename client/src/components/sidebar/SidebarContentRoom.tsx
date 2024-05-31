import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { useGetRoom } from '@/lib/api/getRoom';
import { useGetRoomPlayers } from '@/lib/api/getRoomPlayers';
import { useGetUnreadMessages } from '@/lib/api/getUnreadMessages';
import { useGetUnreadStory } from '@/lib/api/getUnreadStory';
import { useQuasmStore } from '@/lib/stores/quasmStore';

import { CopyGameCode } from '../CopyGameCode';
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
  const { data: unreadMessages } = useGetUnreadMessages(roomUUID);
  const { data: unreadStory } = useGetUnreadStory(roomUUID);

  useEffect(() => {
    setRoomName(roomDetails?.roomName);
    setIsGameMaster(
      roomDetails?.currentPlayer.id === roomDetails?.gameMasterID
    );
  }, [roomDetails, setRoomName, setIsGameMaster]);

  return (
    <div className='flex h-full flex-col justify-between p-4'>
      <div>
        <div className='flex flex-row justify-center'>
          <LogoWithText />
        </div>
        <Accordion type='multiple'>
          <ToolsAccordion
            numOfUnreadBroadcast={
              unreadMessages ? unreadMessages['broadcast'] : undefined
            }
            numOfUnreadStory={unreadStory}
          />
          <CharactersAccordion
            gameMaster={roomDetails?.gameMasterID}
            characters={players}
            unreadMessages={unreadMessages}
          />
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
          <div className='flex items-center space-x-2'>
            {<CopyGameCode gameCode={roomId} />}
            {isGameMaster ? (
              <RoomSettingsDialog
                roomName={roomDetails ? roomDetails.roomName : ''}
                maxPlayers={roomDetails ? roomDetails.maxPlayers : 0}
              />
            ) : (
              <LeaveRoomDialog />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
