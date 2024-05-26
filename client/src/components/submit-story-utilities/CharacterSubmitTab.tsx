import { Tabs, TabsList } from '../ui/tabs';
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
          <TabNavigation characterInfo={character} />
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
