import { Tabs, TabsContent, TabsList } from '../ui/tabs';
import { PlayersTabNavigation } from './PlayersTabNavigation';
import { TurnSubmitCard } from './TurnSubmitCard';
import { CharacterDetails } from './types';

export function CharacterSubmitTab({
  roomCharacters
}: {
  roomCharacters: CharacterDetails[];
}) {
  return (
    <Tabs defaultValue={roomCharacters[0].characterID} className='w-4/5'>
      <TabsList className='w-full'>
        {roomCharacters.map(character => (
          <PlayersTabNavigation characterInfo={character} />
        ))}
      </TabsList>
      {roomCharacters.map(character => (
        <TabsContent value={character.characterID}>
          <TurnSubmitCard characterInfo={character} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
