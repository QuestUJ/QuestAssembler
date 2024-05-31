import {
  ApiTurnSubmitWithCharacterPayload,
  MAX_STORY_IMAGE_FILE_SIZE_IN_BYTES,
  STORY_IMAGE_PIXEL_WIDTH
} from '@quasm/common';
import { useQueryClient } from '@tanstack/react-query';
import {
  createLazyFileRoute,
  getRouteApi,
  useNavigate
} from '@tanstack/react-router';
import { CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import shortUUID from 'short-uuid';
import { toast } from 'sonner';

import { ImageHandler } from '@/components/ImageHandler';
import { SvgSpinner } from '@/components/Spinner';
import { ActionsAccordion } from '@/components/submit-story-utilities/ActionsAccordion';
import { CharacterSubmitTab } from '@/components/submit-story-utilities/CharactersTurnSubmitTab';
import { LLMAssistanceButton } from '@/components/submit-story-utilities/LLMAssistanceButton';
import { StoryTextArea } from '@/components/submit-story-utilities/StoryTextArea';
import { TurnSubmitCard } from '@/components/submit-story-utilities/TurnSubmitCard';
import { CharacterDetails } from '@/components/submit-story-utilities/types';
import { Button } from '@/components/ui/button';
import { useFetchTurnSubmits } from '@/lib/api/fetchTurnSubmits';
import { useWindowSize } from '@/lib/misc/windowSize';
import { useQuasmStore } from '@/lib/stores/quasmStore';
import { useSocket, useSocketEvent } from '@/lib/stores/socketIOStore';
import { useStoryChunkStore } from '@/lib/stores/storyChunkStore';
import { buildResponseErrorToast, SocketErrorTxt } from '@/lib/toasters';

const route = getRouteApi('/_sidebar-layout/room/$roomId/submitStory');

function SubmitStory() {
  const { roomId } = route.useParams();
  const roomUUID = shortUUID().toUUID(roomId);

  const queryClient = useQueryClient();

  const { data } = useFetchTurnSubmits(roomUUID);

  const [selectedImage, setSelectedImage] = useState<Blob>();

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

      queryClient.setQueryData(
        ['fetchTurnSubmits', roomUUID],
        data.map(submit =>
          submit.characterID !== characterID ? submit : updated
        )
      );
    }
  );

  useSocketEvent('changeCharacterDetails', ch => {
    if (!data) return;

    queryClient.setQueryData<ApiTurnSubmitWithCharacterPayload[]>(
      ['fetchTurnSubmits', roomUUID],
      data.map(submit =>
        submit.characterID !== ch.id
          ? submit
          : { ...submit, nick: ch.nick, profileIMG: ch.profileIMG }
      )
    );
  });

  const { width } = useWindowSize();
  const { story, setStory } = useStoryChunkStore();
  const socket = useSocket();
  const [submitInProgress, setSubmitInProgress] = useState(false);

  const handleSubmit = async () => {
    if (story.length <= 0) return;
    if (!socket) {
      toast.error(SocketErrorTxt);
      return;
    }

    if (
      selectedImage !== undefined &&
      selectedImage.size > MAX_STORY_IMAGE_FILE_SIZE_IN_BYTES
    ) {
      toast.error(
        ...buildResponseErrorToast(
          'Image is too big! Modify the image with the Modify Image button.'
        )
      );
      return;
    }
    // prepare image for being sent over the network
    const convertedSelectedImage = selectedImage
      ? new Uint8Array(await selectedImage.arrayBuffer())
      : undefined;

    socket.emit(
      'submitStory',
      {
        roomID: roomUUID,
        story,
        image: convertedSelectedImage
      },
      async res => {
        if (res.success) {
          setStory('');
          setSelectedImage(undefined);
          toast.success('Story submitted');

          await navigate({
            to: '/room/$roomId',
            params: {
              roomId
            }
          });
        } else {
          toast.error(...buildResponseErrorToast(res.error?.message));
        }
      }
    );

    setSubmitInProgress(true);
  };

  useSocketEvent('newTurn', async () => {
    await queryClient.invalidateQueries({
      queryKey: ['fetchTurnSubmits', roomUUID]
    });
  });

  useSocketEvent('playerLeft', async () => {
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

  const saveImageCallback = (imageBlob: Blob) => {
    setSelectedImage(imageBlob);
  };

  const removeImageSelectionCallback = () => {
    setSelectedImage(undefined);
  };

  return (
    <>
      {width >= 1024 ? (
        <div className='grid h-full grid-cols-5 grid-rows-6 gap-2 p-2'>
          <div className='col-span-3 row-span-3'>
            <StoryTextArea />
          </div>
          <div className='col-span-2 col-start-1 row-span-3 row-start-4'>
            <ImageHandler
              handlerId='story_image'
              onImageSave={saveImageCallback}
              onSelectionRemove={removeImageSelectionCallback}
              width={STORY_IMAGE_PIXEL_WIDTH}
              height={STORY_IMAGE_PIXEL_WIDTH}
            />
          </div>
          <div className='col-span-2 col-start-4 row-span-6 row-start-1 h-full overflow-y-auto rounded-md border-2 p-2'>
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
            {submitInProgress ? (
              <div className='flex w-full justify-center'>
                <SvgSpinner className='h-10 w-10' />
              </div>
            ) : (
              <Button
                className='flex w-full items-center gap-2 p-2 text-xs'
                onClick={() => void handleSubmit()}
              >
                <CheckCircle className='' />
                Submit story chunk
              </Button>
            )}
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
          <ActionsAccordion
            saveImageCallback={saveImageCallback}
            removeImageSelectionCallback={removeImageSelectionCallback}
          />
          {submitInProgress ? (
            <div className='flex w-full justify-center'>
              <SvgSpinner className='h-10 w-10' />
            </div>
          ) : (
            <div className='w-full px-10'>
              <Button
                className='flex w-full items-center gap-2 p-2 text-xs'
                onClick={() => void handleSubmit()}
              >
                <CheckCircle className='' />
                Submit story chunk
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export const Route = createLazyFileRoute(
  '/_sidebar-layout/room/$roomId/submitStory'
)({
  component: SubmitStory
});
