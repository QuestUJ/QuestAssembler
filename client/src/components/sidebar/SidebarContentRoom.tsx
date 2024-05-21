import { ApiPlayerPayload, RoomDetailsPayload } from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { useApiGet } from '@/lib/api';
import { useQuasmStore } from '@/lib/quasmStore';
import { useSocket, useSocketEvent } from '@/lib/socketIOStore';

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

  const { data } = useApiGet<RoomDetailsPayload>({
    path: `/getRoom/${roomUUID}`,
    queryKey: ['getRoom', roomUUID]
  });

  const { toast } = useToast();

  useEffect(() => {
    setRoomName(data?.roomName);
    setIsGameMaster(data?.currentPlayer.id === data?.gameMasterID);
  }, [data, setRoomName, setIsGameMaster]);

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
    if (!data) return;

    const playerQueryData: ApiPlayerPayload = {
      id: player.id,
      nick: player.nick,
      profilePicture: player.profileIMG
    };

    queryClient.setQueryData<RoomDetailsPayload>(['getRoom', roomUUID], {
      ...data,
      players: [playerQueryData, ...data.players]
    });

    toast({
      title: player.nick,
      description: 'has joined the game!'
    });
  });

  useSocketEvent('playerLeft', player => {
    if (!data) return;

    const playerQueryData: ApiPlayerPayload = {
      id: player.id,
      nick: player.nick,
      profilePicture: player.profileIMG
    };

    queryClient.setQueryData<RoomDetailsPayload>(['getRoom', roomUUID], {
      ...data,
      players: [playerQueryData, ...data.players]
    });

    toast({
      title: player.nick,
      description: 'has left the game!'
    });
  });

  useSocketEvent('changeCharacterDetails', player => {
    if (!data) return;

    const playerQueryData: ApiPlayerPayload = {
      id: player.id,
      nick: player.nick,
      profilePicture: player.profileIMG
    };

    queryClient.setQueryData<RoomDetailsPayload>(['getRoom', roomUUID], {
      ...data,
      currentPlayer:
        player.id === data.currentPlayer.id
          ? playerQueryData
          : data.currentPlayer,
      players: data.players.map(arrayPlayer =>
        arrayPlayer.id === player.id ? playerQueryData : arrayPlayer
      ) // have to destructure so that reference changes and UI reloads
    });
  });

  useSocketEvent('changeRoomSettings', roomData => {
    if (!data) return;
    setRoomName(roomData.name);
  });

  return (
    <div className='flex h-full flex-col justify-between p-4'>
      <div>
        <div className='flex flex-row justify-center'>
          <LogoWithText />
        </div>
        <Accordion type='multiple'>
          <CharactersAccordion characters={data?.players} />
          <ToolsAccordion />
        </Accordion>
      </div>
      <div className='w-full'>
        <div className='flex h-12 flex-row items-center justify-between'>
          <div className='flex h-full items-center'>
            {!data ? (
              <SvgSpinner className='ml-4 h-10 w-10' />
            ) : (
              <CharacterSettingsDialog
                nick={data?.currentPlayer.nick}
                profilePicture={data.currentPlayer.profilePicture}
              />
            )}
          </div>
          <LeaveRoomDialog />
          {isGameMaster ? <RoomSettingsDialog /> : <></>}
        </div>
      </div>
    </div>
  );
}
