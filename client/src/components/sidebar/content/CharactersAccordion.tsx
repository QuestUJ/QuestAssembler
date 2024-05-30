import { ApiPlayerPayload } from '@quasm/common';
import { Link, useParams } from '@tanstack/react-router';
import { CheckCircle, Crown, Hourglass } from 'lucide-react';
import shortUUID from 'short-uuid';

import { SvgSpinner } from '@/components/Spinner';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import {
  displayNickname,
  NicknameDisplayStyle
} from '@/lib/misc/displayNickname';
import { useSocketSyncStore } from '@/lib/stores/socketSyncStore';

function Character({
  characterInfo,
  isGameMaster,
  unreadMessages
}: {
  characterInfo: ApiPlayerPayload;
  isGameMaster: boolean;
  unreadMessages: number;
}) {
  const { nick, profileIMG, id: characterID, isReady } = characterInfo;
  const { roomId }: { roomId: string } = useParams({ strict: false });
  const liveChat = useSocketSyncStore(state => state.liveChat);

  const isLive = liveChat === characterID;

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
        <div className='relative h-full flex-shrink-0'>
          {!isLive && unreadMessages && unreadMessages > 0 && (
            <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary font-bold text-black'>
              {unreadMessages}
            </span>
          )}
          <img src={profileIMG} className='aspect-square h-full rounded-full' />
        </div>
        <div className='flex w-full items-center justify-between'>
          <h1 className='relative font-decorative text-2xl'>
            {displayNickname(nick, NicknameDisplayStyle.SHORT)}
          </h1>
          {isGameMaster ? (
            <Crown className='h-8 w-8 flex-shrink-0 text-primary' />
          ) : isReady ? (
            <CheckCircle className='h-8 w-8 flex-shrink-0 text-primary' />
          ) : (
            <Hourglass className='h-8 w-8 flex-shrink-0 text-secondary' />
          )}
        </div>
      </div>
    </Link>
  );
}

export function CharactersAccordion({
  characters,
  gameMaster,
  unreadMessages
}: {
  characters: ApiPlayerPayload[] | undefined;
  gameMaster: string | undefined;
  unreadMessages: Record<string, number> | undefined;
}) {
  return (
    <AccordionItem value='players'>
      <AccordionTrigger className='w-full font-decorative text-2xl text-primary hover:text-primary-shaded'>
        Players
      </AccordionTrigger>
      <AccordionContent className='flex flex-col gap-2'>
        {!characters ? (
          <SvgSpinner className='mx-auto h-10 w-10' />
        ) : characters.length === 0 ? (
          <h1 className='text-secondary'>No more players in this room :(</h1>
        ) : (
          characters.map(character => (
            <Character
              isGameMaster={gameMaster === character.id}
              characterInfo={character}
              unreadMessages={unreadMessages ? unreadMessages[character.id] : 0}
              key={character.id}
            />
          ))
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
