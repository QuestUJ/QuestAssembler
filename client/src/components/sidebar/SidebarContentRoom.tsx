import { useParams } from '@tanstack/react-router';
import { CircleCheck, Crown, Reply, Scroll } from 'lucide-react';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

import { useApiGet } from '@/lib/api';
import { useQuasmStore } from '@/lib/quasmStore';
import { PlayerPayload, RoomDetailsPayload } from '%/dist';

import { CharacterSettingsDialog } from '../dialogs/CharacterSettingsDialog';
import LogoWithText from '../LogoWithText';
import { SvgSpinner } from '../Spinner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';

function Character({ characterInfo }: { characterInfo: PlayerPayload }) {
  const { nick, profilePicture } = characterInfo;
  return (
    <div className='my-1 flex h-10 flex-row items-center rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
      <img
        src={profilePicture}
        className='mr-4 aspect-square h-full rounded-full'
      />
      <h1 className='text-2xl'>{nick}</h1>
    </div>
  );
}

function ToolsAccordion() {
  const isGameMaster = useQuasmStore(state => state.isGameMaster);
  return (
    <AccordionItem value='tools'>
      <AccordionTrigger className='w-full text-2xl text-primary'>
        Tools
      </AccordionTrigger>
      <AccordionContent className='[&>div]:flex [&>div]:h-10 [&>div]:items-center [&>h1]:text-lg'>
        <div>
          <Scroll className='mr-2 h-full text-primary' />
          <h1>View story</h1>
        </div>
        {isGameMaster ? (
          <>
            <div>
              <Crown className='mr-2 h-full text-primary' />
              <h1>AI support</h1>
            </div>
            <div>
              <Reply className='mr-2 h-full text-primary' />
              <h1>Submit story chunk</h1>
            </div>
            <div>
              <CircleCheck className='mr-2 h-full text-primary' />
              <h1>Players' submits</h1>
            </div>
          </>
        ) : (
          <div>
            <Crown className='mr-2 h-full text-primary' />
            <h1>Contact game master</h1>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

function CharactersAccordion({
  characters
}: {
  characters: PlayerPayload[] | undefined;
}) {
  return (
    <AccordionItem value='players'>
      <AccordionTrigger className='w-full text-2xl text-primary'>
        Players
      </AccordionTrigger>
      <AccordionContent>
        {!characters ? (
          <SvgSpinner className='mx-auto h-10 w-10' />
        ) : characters.length === 0 ? (
          <h1 className='text-secondary'>No more players in this room :(</h1>
        ) : (
          characters.map(character => (
            <Character characterInfo={character} key={character.id} />
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  );
}

export function SidebarContentRoom() {
  const { setRoomName, setIsGameMaster } = useQuasmStore();

  const { roomId }: { roomId: string } = useParams({
    strict: false
  });

  const roomUUID = shortUUID().toUUID(roomId);

  const { data } = useApiGet<RoomDetailsPayload>({
    path: `/getRoom/${roomUUID}`,
    queryKey: ['getRoom', roomUUID]
  });

  useEffect(() => {
    setRoomName(data?.roomName);
    setIsGameMaster(data?.currentPlayer.id === data?.gameMasterID);
  }, [data, setRoomName, setIsGameMaster]);

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
        <div className='flex h-10 flex-row items-center justify-between'>
          <div className='flex h-full items-center'>
            {!data ? (
              <SvgSpinner className='ml-4 h-10 w-10' />
            ) : (
              <>
                <img
                  src={data?.currentPlayer.profilePicture}
                  className='mr-2 aspect-square h-full rounded-full'
                  alt='current player character picture'
                />
                <h1 className='text-2xl'>{data?.currentPlayer.nick}</h1>
              </>
            )}
          </div>
          <CharacterSettingsDialog />
        </div>
      </div>
    </div>
  );
}
