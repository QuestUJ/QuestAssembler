import {
  ApiGenerateTextPayload,
  ApiTurnSubmitWithCharacterPayload,
  GenerateTextBody
} from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate
} from '@tanstack/react-router';
import { Bot, CheckCircle, RotateCcw } from 'lucide-react';
import { useEffect } from 'react';
import shortUUID from 'short-uuid';

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
import { useToast } from '@/components/ui/use-toast';
import { useWindowSize } from '@/hooks/windowSize';
import { useApiGet, useApiPost } from '@/lib/api';
import { useQuasmStore } from '@/lib/quasmStore';
import { useSocket, useSocketEvent } from '@/lib/socketIOStore';
import { useStoryChunkStore } from '@/lib/storyChunkStore';
import { getResponseErrorToast, SocketErrorToast } from '@/lib/toasters';
import { cn } from '@/lib/utils';

interface TurnSubmitDetails {
  content: string;
  timestamp: string;
}

interface CharacterDetails {
  profileIMG?: string;
  nick: string;
  characterID: string;
  submit: TurnSubmitDetails | null;
}

function TabNavigation({ characterInfo }: { characterInfo: CharacterDetails }) {
  const { characterID, profileIMG } = characterInfo;
  return (
    <TabsTrigger value={characterID}>
      <img src={profileIMG} className='mx-1 h-7 w-7 rounded-full' />
    </TabsTrigger>
  );
}

function TurnSubmitCard({
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
            {nick}
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
  const reverseStory = useStoryChunkStore(state => state.revertStory);
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
    ApiGenerateTextPayload,
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

const route = getRouteApi('/_auth/room/$roomId/submitStory');

function SubmitStory() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data } = useApiGet<ApiTurnSubmitWithCharacterPayload[]>({
    path: `/fetchTurnSubmits/${roomUUID}`,
    queryKey: ['fetchTurnSubmits', roomUUID]
  });

  useSocketEvent('newPlayer', ({ id, nick, profileIMG }) => {
    if (!data) {
      return;
    }

    const newEmptySubmit: CharacterDetails = {
      characterID: id,
      nick,
      profileIMG,
      submit: null
    };

    queryClient.setQueryData(
      ['fetchTurnSubmits', roomUUID],
      [...data, newEmptySubmit]
    );
  });

  useSocketEvent(
    'turnSubmit',
    ({ characterID, nick, profileIMG, content, timestamp }) => {
      toast({
        title: `${nick} ended his turn`
      });

      if (!data) {
        return;
      }

      const updated: CharacterDetails = {
        characterID,
        nick,
        profileIMG,
        submit: {
          content,
          timestamp
        }
      };
      const at = data.findIndex(ch => ch.characterID === characterID);

      data[at] = updated;

      queryClient.setQueryData(['fetchTurnSubmits', roomUUID], [...data]);
    }
  );

  const { width } = useWindowSize();

  const { story, setStory } = useStoryChunkStore();

  const socket = useSocket();

  const handleSubmit = () => {
    if (story.length <= 0) return;
    if (!socket) {
      toast(SocketErrorToast);
      return;
    }

    socket.emit(
      'submitStory',
      {
        roomID: roomUUID,
        story
      },
      async res => {
        if (res.success) {
          setStory('');
          toast({
            title: 'Story submitted'
          });

          await navigate({
            to: '/room/$roomId',
            params: {
              roomId
            }
          });
        } else {
          toast(getResponseErrorToast(res.error));
        }
      }
    );
  };

  useSocketEvent('newTurn', async () => {
    await queryClient.invalidateQueries({
      queryKey: ['fetchTurnSubmits', roomUUID]
    });
  });

  const isGameMaster = useQuasmStore(state => state.isGameMaster);

  const navigate = useNavigate({ from: '/room/$roomId/submitStory' });

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
          <div className='col-span-2 col-start-4 row-span-6 row-start-1 h-full overflow-y-auto rounded-md border-2 border-secondary p-2'>
            <h1 className='font-decorative text-2xl text-primary'>
              Player's turn submits
            </h1>
            <hr className='my-2' />
            <div className='flex h-fit flex-col gap-2'>
              {data ? (
                data.map(character => (
                  <TurnSubmitCard
                    characterInfo={character}
                    key={character.characterID}
                  />
                ))
              ) : (
                <div className='flex h-full w-full justify-center pt-20'>
                  <SvgSpinner className='h-20 w-20' />
                </div>
              )}
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
          {data ? (
            <CharacterSubmitTab roomCharacters={data} />
          ) : (
            <div className='flex h-full w-full justify-center pt-20'>
              <SvgSpinner className='h-20 w-20' />
            </div>
          )}
          <ActionsAccordion />
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
