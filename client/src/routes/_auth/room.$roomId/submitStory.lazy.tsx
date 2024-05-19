import { GenerateTextBody, GenerateTextPayload } from '@quasm/common';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { Bot, CheckCircle, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import defaultProfilePic from '@/assets/defaultProfilePicture.jpg';
import { SvgSpinner } from '@/components/Spinner';
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
import { useApiPost } from '@/lib/api';
import { useQuasmStore } from '@/lib/quasmStore';
import { CharacterDetails } from '@/lib/sharedTypes';
import { useStoryChunkStore } from '@/lib/storyChunkStore';

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
    <Card className='overflow-auto'>
      <CardHeader className='lg:p-2'>
        <div className='flex items-center gap-2'>
          <img
            className='h-10 w-10 rounded-full'
            src={pictureURL ? pictureURL : defaultProfilePic}
          />
          <h1 className='text-md font-decorative text-primary lg:text-lg'>
            {name}
          </h1>
        </div>
        <Separator className='w-full' />
      </CardHeader>
      <CardContent className='lg:text-md p-4 pt-0 text-sm'>
        {turnSubmit.content
          ? turnSubmit.content
          : 'Player turn submit is unavailable.'}
      </CardContent>
    </Card>
  );
}

function ImageHandler() {
  return (
    <div className='flex h-80 w-80 items-center justify-center rounded-md bg-background lg:h-full lg:w-full'>
      Image Handler Component
    </div>
  );
}

function StoryTextArea() {
  const setStory = useStoryChunkStore(state => state.setStory);
  const story = useStoryChunkStore(state => state.story);
  const oldStory = useStoryChunkStore(state => state.oldStory);
  const reverseStory = useStoryChunkStore(state => state.reverseStory);
  return (
    <div className='relative lg:h-full lg:w-full'>
      <Textarea
        placeholder='Type your story here...'
        value={story}
        onChange={e => setStory(e.target.value)}
        className='min-h-60 lg:h-full lg:w-full'
      />
      {oldStory ? (
        <Button
          className='absolute bottom-2 right-2 h-10 w-10 p-2 lg:bottom-1 lg:right-1'
          onClick={reverseStory}
        >
          <RotateCcw className='h-full w-full' />
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
}

function LLMAssistanceButton() {
  const setStoryWithLLM = useStoryChunkStore(state => state.setNewStoryWithLLM);
  const story = useStoryChunkStore(state => state.story);
  const setGeneratingStatus = useStoryChunkStore(
    state => state.setGeneratingStatus
  );
  const isGeneratingWithLLM = useStoryChunkStore(
    state => state.isGeneratingWithLLM
  );
  // a bit quirky as the mutation does not really mutate anything, but the interaction is just a prototype
  // TODO: rethink which method to use for AI assistance
  const { mutate: LLMSupportMutation } = useApiPost<
    GenerateTextPayload,
    GenerateTextBody
  >({
    path: '/generateText',
    invalidate: [],
    onSuccess: text => {
      setStoryWithLLM(text.generatedText);
    }
  });

  const handleLLMSupport = () => {
    setGeneratingStatus();
    LLMSupportMutation({
      prompt: story
    });
  };

  return (
    <Button
      className='flex w-full items-center gap-2 bg-white p-2 text-xs'
      onClick={handleLLMSupport}
      disabled={isGeneratingWithLLM}
    >
      {isGeneratingWithLLM ? (
        <>Generating...</>
      ) : (
        <>
          <Bot className='' />
          Rewrite with LLM
        </>
      )}
    </Button>
  );
}

function ActionsAccordion() {
  return (
    <Accordion type='multiple' className='w-4/5'>
      <AccordionItem value='story'>
        <AccordionTrigger className='flex w-full flex-row items-center text-2xl text-primary'>
          Story
        </AccordionTrigger>
        <AccordionContent className='flex flex-col gap-2'>
          <StoryTextArea />
          <LLMAssistanceButton />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='image'>
        <AccordionTrigger className='flex w-full flex-row items-center text-2xl text-primary'>
          Image
        </AccordionTrigger>
        <AccordionContent className=''>
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
  const roomCharacters = useQuasmStore(
    state => state.roomCharacters as CharacterDetails[] // again temporary solution as room Characters will need to be filled with sockets
  );

  const { width } = useWindowSize();

  const handleSubmit = () => {
    console.log('jestem zsubmitowany');
  };

  const isGameMaster = useQuasmStore(state => state.isGameMaster);

  const navigate = useNavigate({ from: '/room/$roomId/submitStory' });

  useEffect(() => {
    console.log(isGameMaster);
  });

  useEffect(() => {
    if (!isGameMaster) {
      void navigate({
        to: '/room/$roomId'
      });
    }
  }, [isGameMaster, navigate]);

  if (!isGameMaster) {
    return (
      <div className='flex items-center justify-center p-10'>
        <SvgSpinner className='h-24 w-24' />
      </div>
    );
  }

  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-full grid-cols-5 grid-rows-6 gap-2 p-2'>
          <div className='col-span-3 row-span-3'>
            <StoryTextArea />
          </div>
          <div className='col-span-2 col-start-1 row-span-3 row-start-4'>
            <ImageHandler />
          </div>
          <div className='col-span-2 col-start-4 row-span-6 row-start-1 max-h-full overflow-y-auto rounded-md border-2 border-secondary p-2'>
            <h1 className='font-decorative text-2xl text-primary'>
              Player's turn submits
            </h1>
            <hr className='my-2' />
            <div className='flex h-fit min-h-full flex-col justify-end gap-2'>
              {roomCharacters.map(character => (
                <TurnSubmitCard characterInfo={character} />
              ))}
            </div>
          </div>
          <div className='col-start-3 row-span-3 row-start-4 flex flex-col gap-2'>
            <LLMAssistanceButton />
            <Button
              className='flex w-full items-center gap-2 p-2 text-xs'
              onClick={handleSubmit}
            >
              <CheckCircle className='' />
              Submit story chunk
            </Button>
          </div>
        </div>
      ) : (
        <div className='flex min-h-screen w-full flex-col items-center gap-2 bg-crust from-[#222] to-[#111]'>
          <CharacterSubmitTab roomCharacters={roomCharacters} />
          <ActionsAccordion story={story} setStory={setStory} />
          <Button className='flex w-4/5 items-center' onClick={handleSubmit}>
            <CheckCircle className='' />
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
