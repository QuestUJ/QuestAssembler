import { CharacterDetails } from '@quasm/common';
import { createFileRoute, createLazyFileRoute } from '@tanstack/react-router';
import { Bot, CheckCircle } from 'lucide-react';
import { useState } from 'react';

import defaultProfilePic from '@/assets/defaultProfilePicture.jpg';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useWindowSize } from '@/hooks/windowSize';
import { useQuasmStore } from '@/lib/quasmStore';

function TabNavigation({ characterInfo }: { characterInfo: CharacterDetails }) {
  const { id, pictureURL } = characterInfo;
  return (
    <TabsTrigger value={id.toString()}>
      <img
        src={pictureURL ? pictureURL : defaultProfilePic}
        className='mx-1 h-7 w-7 rounded-full'
      />
    </TabsTrigger>
  );
}

function TurnSubmitCard({
  characterInfo
}: {
  characterInfo: CharacterDetails;
}) {
  const { pictureURL, turnSubmit, name } = characterInfo;
  return (
    <Card className='my-1 max-h-48 overflow-auto'>
      <CardHeader className='lg:p-2'>
        <div className='flex items-center'>
          <img
            className='mr-2 h-10 w-10 rounded-full'
            src={pictureURL ? pictureURL : defaultProfilePic}
          />
          <h1 className='text-2xl text-primary lg:text-lg'>{name}</h1>
        </div>
        <Separator className='w-full' />
      </CardHeader>
      <CardContent className='text-sm lg:text-xs'>
        {turnSubmit.content
          ? turnSubmit.content
          : 'Player turn submit is unavailable.'}
      </CardContent>
    </Card>
  );
}

function ImageHandler() {
  return (
    <div className='flex h-80 w-80 items-center justify-center rounded-xl bg-background lg:h-full lg:w-full'>
      Image Handler Component
    </div>
  );
}

function ActionsAccordion({
  story,
  setStory
}: {
  story: string;
  setStory: (text: string) => void;
}) {
  return (
    <Accordion type='multiple' className='w-4/5'>
      <AccordionItem value='story'>
        <AccordionTrigger className='my-1 flex w-full flex-row items-center text-2xl text-primary'>
          Story
        </AccordionTrigger>
        <AccordionContent className='my-1'>
          <Textarea
            placeholder='Type your story here...'
            value={story}
            onChange={e => setStory(e.target.value)}
            className='min-h-72'
          />
          <Button className='my-3 flex w-full items-center justify-center bg-white'>
            <Bot className='mr-1' />
            Rewrite with LLM
          </Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='image'>
        <AccordionTrigger className='my-1 flex w-full flex-row items-center text-2xl text-primary'>
          Image
        </AccordionTrigger>
        <AccordionContent className='my-1'>
          <ImageHandler />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function CharacterSubmitTab({
  roomCharacters
}: {
  roomCharacters: CharacterDetails[];
}) {
  return (
    <Tabs defaultValue={roomCharacters[0].id.toString()} className='w-4/5'>
      <TabsList className='w-full'>
        {roomCharacters.map(character => (
          <TabNavigation characterInfo={character} />
        ))}
      </TabsList>
      {roomCharacters.map(character => (
        <TabsContent value={character.id.toString()}>
          <TurnSubmitCard characterInfo={character} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function SubmitStory() {
  const roomCharacters = useQuasmStore(state => state.roomCharacters);
  const [story, setStory] = useState('');
  const { width } = useWindowSize();

  const handleSubmit = () => {
    console.log('jestem zsubmitowany');
  };

  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-full grid-cols-5 grid-rows-6 gap-1 p-1'>
          <div className='col-span-3 row-span-3'>
            <Textarea
              placeholder='Type your story here...'
              className='h-full w-full '
            />
          </div>
          <div className='col-span-2 col-start-1 row-span-3 row-start-4'>
            <ImageHandler />
          </div>
          <div className='col-span-2 col-start-4 row-span-6 row-start-1 m-2 mr-4 max-h-full overflow-y-auto border-2 border-primary p-3'>
            <h1 className='text-2xl text-primary'>Player's turn submits</h1>
            <div className='flex h-fit min-h-full flex-col justify-end'>
              {roomCharacters.map(character => (
                <TurnSubmitCard characterInfo={character} />
              ))}
            </div>
          </div>
          <div className='col-start-3 row-span-3 row-start-4 p-1'>
            <Button className='flex w-full max-w-72 items-center bg-white p-2 text-xs'>
              <Bot className='mr-1' />
              Rewrite with LLM
            </Button>
            <Button
              className='my-1 flex w-full max-w-72 items-center p-2 text-xs'
              onClick={handleSubmit}
            >
              <CheckCircle className='mr-1' />
              Submit story chunk
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex min-h-screen w-full flex-col items-center bg-gradient-to-b from-[#222] to-[#111]'>
          <CharacterSubmitTab roomCharacters={roomCharacters} />
          <ActionsAccordion story={story} setStory={setStory} />
          <Button
            className='my-2 flex w-4/5 items-center'
            onClick={handleSubmit}
          >
            <CheckCircle className='mr-1' />
            Submit story chunk
          </Button>
        </div>
      )}
    </>
  );
}

export const Route = createLazyFileRoute('/_auth/room/$roomId/submitStory')({
  component: SubmitStory
});
