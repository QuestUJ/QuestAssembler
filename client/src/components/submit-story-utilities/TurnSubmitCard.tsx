import {
  displayNickname,
  NicknameDisplayStyle
} from '@/lib/misc/displayNickname';
import { cn } from '@/lib/utils';

import { Card, CardContent, CardHeader } from '../ui/card';
import { Separator } from '../ui/separator';
import { CharacterDetails } from './types';

export function TurnSubmitCard({
  characterInfo
}: {
  characterInfo: CharacterDetails;
}) {
  const { profileIMG, submit, nick } = characterInfo;
  return (
    <Card className='overflow-auto'>
      <CardHeader className='lg:p-2'>
        <div className='flex items-center gap-2'>
          <img className='h-10 w-10 rounded-full' src={profileIMG} />
          <h1 className='text-md font-decorative text-primary lg:text-lg'>
            {displayNickname(nick, NicknameDisplayStyle.SHORT)}
          </h1>
        </div>
        <Separator className='w-full' />
      </CardHeader>
      <CardContent
        className={cn(
          'lg:text-md p-4 pt-0 text-sm',
          !submit && 'text-secondary'
        )}
      >
        {submit ? submit.content : "Player hasn't submitted yet"}
      </CardContent>
    </Card>
  );
}
