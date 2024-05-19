import { ApiPlayerPayload } from '@quasm/common';
import { Link, useParams } from '@tanstack/react-router';
import shortUUID from 'short-uuid';

import { SvgSpinner } from '@/components/Spinner';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

function Character({ characterInfo }: { characterInfo: ApiPlayerPayload }) {
  const { nick, profilePicture, id: characterID } = characterInfo;

  const { roomId }: { roomId: string } = useParams({ strict: false });

  return (
    <Link
      to='/room/$roomId/chat/$characterId'
      activeProps={{
        className: 'text-primary'
      }}
      params={{
        roomId,
        characterId: shortUUID().fromUUID(characterID)
      }}
    >
      <div className='flex h-14 flex-row items-center gap-2 rounded-xl p-2 hover:cursor-pointer hover:bg-highlight'>
        <img
          src={profilePicture}
          className='aspect-square h-full rounded-full'
        />
        <h1 className='font-decorative text-2xl'>{nick}</h1>
      </div>
    </Link>
  );
}

export function CharactersAccordion({
  characters
}: {
  characters: ApiPlayerPayload[] | undefined;
}) {
  return (
    <AccordionItem value='players'>
      <AccordionTrigger className='font-decorative w-full text-2xl text-primary hover:text-primary-shaded'>
        Players
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-2'>
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
