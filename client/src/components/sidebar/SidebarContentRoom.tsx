import { AccordionHeader, AccordionItem } from '@radix-ui/react-accordion';
import { CircleCheck, Crown, Reply, Scroll } from 'lucide-react';

import { useRoomStore } from '@/lib/roomStore';
import { CharacterDetails } from '%/src/DataInterface';

import { CharacterSettingsDialog } from '../dialogs/CharacterSettingsDialog';
import LogoWithText from '../LogoWithText';
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';

function Character({ characterInfo }: { characterInfo: CharacterDetails }) {
  const { pictureURL, name } = characterInfo;
  return (
    <div className='my-1 flex h-10 flex-row items-center rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
      <img src={pictureURL} className='aspect-square h-full rounded-full' />
      <h1 className='text-2xl'>{name}</h1>
    </div>
  );
}

function ToolsAccordion() {
  const isCurrentUserGameMaster = useRoomStore(
    state => state.isCurrentPlayerGameMaster
  );
  return (
    <AccordionItem value='tools'>
      <AccordionHeader>
        <AccordionTrigger className='w-full text-2xl text-primary'>
          Tools
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent className='[&>div]:flex [&>div]:h-10 [&>div]:items-center [&>h1]:text-lg'>
        <div>
          <Scroll className='mr-2 h-full text-primary' />
          <h1>View story</h1>
        </div>
        {isCurrentUserGameMaster ? (
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

function CharactersAccordion() {
  const roomCharacters = useRoomStore(state => state.roomCharacters);
  return (
    <AccordionItem value='players'>
      <AccordionHeader>
        <AccordionTrigger className='w-full text-2xl text-primary'>
          Players
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>
        {roomCharacters.map(character => (
          <Character characterInfo={character} key={character.id} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export function SidebarContentRoom() {
  const currentPlayerUrlImage = useRoomStore(
    state => state.currentPlayerURLImage
  );
  const currentPlayerName = useRoomStore(state => state.currentPlayerName);
  return (
    <div className='flex h-full flex-col justify-between p-4'>
      <div>
        <div className='flex flex-row justify-center'>
          <LogoWithText />
        </div>
        <Accordion type='multiple'>
          <CharactersAccordion />
          <ToolsAccordion />
        </Accordion>
      </div>
      <div className='w-full'>
        <div className='flex h-10 flex-row items-center justify-between'>
          <div className='flex h-full items-center'>
            <img
              src={currentPlayerUrlImage}
              className='mr-2 aspect-square h-full rounded-full'
              alt='current player character picture'
            />
            <h1 className='text-2xl'>{currentPlayerName}</h1>
          </div>
          <CharacterSettingsDialog />
        </div>
      </div>
    </div>
  );
}
