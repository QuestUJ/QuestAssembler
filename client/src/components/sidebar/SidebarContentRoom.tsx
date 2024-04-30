import { AccordionHeader, AccordionItem } from '@radix-ui/react-accordion';
import LogoWithText from '../LogoWithText';
import { Accordion, AccordionContent, AccordionTrigger } from '../ui/accordion';
import { useRoomStore } from '@/lib/roomStore';
import { CircleCheck, Crown, Reply, Scroll } from 'lucide-react';

function Player({
  imgURL,
  name
}: {
  imgURL: string | undefined;
  name: string;
}) {
  return (
    <div className='my-1 flex h-10 flex-row items-center rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
      <img src={imgURL} className='aspect-square h-full rounded-full' />
      <h1 className='text-2xl'>{name}</h1>
    </div>
  );
}

export function SidebarContentRoom() {
  const roomCharacters = useRoomStore(state => state.roomPlayers);
  const isCurrentUserGameMaster = useRoomStore(
    state => state.isCurrentPlayerGameMaster
  );
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
          <AccordionItem value='players'>
            <AccordionHeader>
              <AccordionTrigger className='w-full text-2xl text-primary hover:text-primary-shaded'>
                Players
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              {roomCharacters.map(character => (
                <Player
                  imgURL={character.characterPictureURL}
                  name={character.characterName}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='tools'>
            <AccordionHeader>
              <AccordionTrigger className='w-full text-2xl text-primary hover:text-primary-shaded'>
                Tools
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className='[&>div]:flex [&>div]:h-10 [&>div]:items-center [&>h1]:text-lg'>
              <div className='m-1 rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
                <Scroll className='mr-2 h-full text-primary' />
                <h1>View story</h1>
              </div>
              {isCurrentUserGameMaster ? (
                <>
                  <div className='m-1 rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
                    <Crown className='mr-2 h-full text-primary' />
                    <h1>AI support</h1>
                  </div>
                  <div className='m-1 rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
                    <Reply className='mr-2 h-full text-primary' />
                    <h1>Submit story chunk</h1>
                  </div>
                  <div className='m-1 rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
                    <CircleCheck className='mr-2 h-full text-primary' />
                    <h1>Players' submits</h1>
                  </div>
                </>
              ) : (
                <div className='m-1 rounded-xl p-1 hover:cursor-pointer hover:bg-card-foreground'>
                  <Crown className='mr-2 h-full text-primary' />
                  <h1>Contact game master</h1>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <div className='flex h-10 flex-row items-center'>
          <img
            src={currentPlayerUrlImage}
            className='mr-2 aspect-square h-full rounded-full'
            alt='current player character picture'
          />
          <h1 className='text-2xl'>{currentPlayerName}</h1>
          {/**
           * TODO: Add character customization
           */}
        </div>
      </div>
    </div>
  );
}
