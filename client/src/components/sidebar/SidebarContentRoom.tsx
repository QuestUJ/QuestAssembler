import { ApiPlayerPayload, RoomDetailsPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { useGetRoom } from '@/lib/api/getRoom';
import { useGetRoomPlayers } from '@/lib/api/getRoomPlayers';
import { useQuasmStore } from '@/lib/stores/quasmStore';
import { useSocket, useSocketEvent } from '@/lib/stores/socketIOStore';

import { CharacterSettingsDialog } from '../dialogs/CharacterSettingsDialog';
import { LeaveRoomDialog } from '../dialogs/LeaveRoomDialog';
import { RoomSettingsDialog } from '../dialogs/RoomSettingsDialog';
import LogoWithText from '../LogoWithText';
import { SvgSpinner } from '../Spinner';
import { Accordion } from '../ui/accordion';
import { useToast } from '../ui/use-toast';
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

  const { toast } = useToast();

  useEffect(() => {
    setRoomName(roomDetails?.roomName);
    setIsGameMaster(
      roomDetails?.currentPlayer.id === roomDetails?.gameMasterID
    );
  }, [roomDetails, setRoomName, setIsGameMaster]);

  const queryClient = useQueryClient();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribeToRoom', roomUUID, res => {
      if (!res.success) {
        toast({
          title: 'Connection error! Try refreshing site!'
        });
      }
    });
  }, [socket, roomUUID, toast]);

  useSocketEvent('newPlayer', player => {
    if (!players) return;

    const playerQueryData: ApiPlayerPayload = {
      id: player.id,
      nick: player.nick,
      profileIMG: player.profileIMG,
      isReady: player.isReady
    };

    queryClient.setQueryData<ApiPlayerPayload[]>(
      ['getRoomPlayers', roomUUID],
      [playerQueryData, ...players]
    );

    toast({
      title: player.nick,
      description: 'has joined the game!'
    });
  });

  useSocketEvent('playerLeft', player => {
    if (!players) return;

    queryClient.setQueryData<ApiPlayerPayload[]>(
      ['getRoomPlayers', roomUUID],
      players.filter(arrayPlayer => arrayPlayer.id !== player.id)
    );

    toast({
      title: player.nick,
      description: 'has left the game!'
    });
  });

  useSocketEvent('changeCharacterDetails', player => {
    if (!roomDetails) {
      return;
    }

    if (player.id === roomDetails.currentPlayer.id) {
      queryClient.setQueryData<RoomDetailsPayload>(['getRoom', roomUUID], {
        ...roomDetails,
        currentPlayer:
          player.id === roomDetails.currentPlayer.id
            ? player
            : roomDetails.currentPlayer
      });
    } else {
      if (!players) return;

      queryClient.setQueryData<ApiPlayerPayload[]>(
        ['getRoomPlayers', roomUUID],
        players.map(p => (p.id === player.id ? player : p))
      );
    }
  });

  useSocketEvent('changeRoomSettings', roomData => {
    if (!roomDetails) return;
    setRoomName(roomData.name);
  });

  useSocketEvent('playerReady', characterID => {
    if (!players) return;

    queryClient.setQueryData(
      ['getRoomPlayers', roomUUID],
      players.map(p => (p.id === characterID ? { ...p, isReady: true } : p))
    );
  });

  useSocketEvent('newTurn', async () => {
    await queryClient.invalidateQueries({
      queryKey: ['getRoomPlayers', roomUUID]
    });
  });

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
