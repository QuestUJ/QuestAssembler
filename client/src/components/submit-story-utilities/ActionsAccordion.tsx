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
  saveImageCallback
}: {
  saveImageCallback: (imageBlob: Blob, imageURL: string) => void;
}) {
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
        <AccordionContent className='flex h-80 w-80'>
          <ImageHandler callback={saveImageCallback} width={256} height={256} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
