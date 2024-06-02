import { STORY_IMAGE_PIXEL_WIDTH } from '@quasm/common';

import { ImageHandler } from '../ImageHandler';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { LLMAssistanceButton } from './LLMAssistanceButton';
import { StoryTextArea } from './StoryTextArea';

export function ActionsAccordion({
  saveImageCallback,
  removeImageSelectionCallback
}: {
  saveImageCallback: (imageBlob: Blob, imageURL: string) => void;
  removeImageSelectionCallback: () => void;
}) {
  return (
    <Accordion type='multiple' className='w-4/5'>
      <AccordionItem value='story'>
        <AccordionTrigger className='flex w-full flex-row items-center text-2xl text-primary'>
          Story
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex flex-col gap-2'>
            <StoryTextArea />
            <LLMAssistanceButton />
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='image'>
        <AccordionTrigger className='flex w-full flex-row items-center text-2xl text-primary'>
          Image
        </AccordionTrigger>
        <AccordionContent>
          <div className='flex h-80 w-80'>
            <ImageHandler
              handlerId='accordion_story_image'
              onImageSave={saveImageCallback}
              onSelectionRemove={() => {
                removeImageSelectionCallback();
              }}
              width={STORY_IMAGE_PIXEL_WIDTH}
              height={STORY_IMAGE_PIXEL_WIDTH}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
