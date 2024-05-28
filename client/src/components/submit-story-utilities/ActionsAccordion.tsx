import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion';
import { ImageHandler } from './ImageHandler';
import { LLMAssistanceButton } from './LLMAssistanceButton';
import { StoryTextArea } from './StoryTextArea';

export function ActionsAccordion({saveImageCallback} : {saveImageCallback: (imageBlob: Blob, imageURL: string) => void}) {
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
          <ImageHandler callback={saveImageCallback} width={250} height={250}/>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
