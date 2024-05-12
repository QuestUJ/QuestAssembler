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
      <div className='my-1 flex h-10 flex-row items-center rounded-xl p-1 hover:cursor-pointer hover:bg-highlight'>
        <img
          src={profilePicture}
          className='mr-4 aspect-square h-full rounded-full'
        />
        <h1 className='text-2xl'>{nick}</h1>
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
      <AccordionTrigger className='w-full text-2xl text-primary hover:text-primary-shaded'>
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
