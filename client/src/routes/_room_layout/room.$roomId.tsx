import { InputBar } from '@/components/InputBar';
import {
  MessageContainer,
  MessageTypes
} from '@/components/chatUtilities/Messages';
import { createFileRoute } from '@tanstack/react-router';

// for testing only
const PLACEHOLDER_DUMMY_MESSAGES: MessageTypes[] = [
  {
    type: 'Message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    type: 'Message',
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  }
];

function Room() {
  return (
    <div className='flex h-full flex-col justify-end'>
      <MessageContainer messages={PLACEHOLDER_DUMMY_MESSAGES} />
      <InputBar
        handleSend={() => console.log('send handled')}
        sendButtonText='Send'
      />
    </div>
  );
}

export const Route = createFileRoute('/_room_layout/room/$roomId')({
  component: Room
});
