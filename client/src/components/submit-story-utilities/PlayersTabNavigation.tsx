import { TabsTrigger } from '../ui/tabs';
import { CharacterDetails } from './types';

export function PlayersTabNavigation({
  characterInfo
}: {
  characterInfo: CharacterDetails;
}) {
  const { characterID, profileIMG } = characterInfo;
  return (
    <TabsTrigger value={characterID}>
      <img src={profileIMG} className='mx-1 h-7 w-7 rounded-full' />
    </TabsTrigger>
  );
}
