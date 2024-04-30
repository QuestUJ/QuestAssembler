import { InputBar } from '@/components/InputBar';
import { createFileRoute } from '@tanstack/react-router';

type DisplayMessage = {
  authorName: string;
  characterPictureURL: string | undefined;
  messageTimeStamp: Date;
  messageContent: string;
};

function Message({ message }: { message: DisplayMessage }) {
  return (
    <div className='m-1 my-3 flex min-h-10 w-full'>
      <img
        src={message.characterPictureURL}
        className='aspect-square h-full max-h-10 rounded-full'
      />
      <div className='mx-2 w-full'>
        <div className='flex flex-nowrap items-center'>
          <h1 className='text-md mr-2 text-primary'>{message.authorName}</h1>
          <h3 className='pt-1 text-xs text-secondary'>
            {message.messageTimeStamp.toDateString()}
          </h3>
        </div>
        <p className='text-xs'>{message.messageContent}</p>
      </div>
    </div>
  );
}

// for testing only
const PLACEHOLDER_DUMMY_MESSAGES: DisplayMessage[] = [
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Kolgomorov',
    characterPictureURL:
      'https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg',
    messageContent: 'Siemano, jakaś kompresja ktoś coś?',
    messageTimeStamp: new Date()
  },
  {
    authorName: 'Nie Kolgomorov',
    characterPictureURL:
      'https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ',
    messageContent: 'Siemano, może nie?',
    messageTimeStamp: new Date()
  }
];

function MessageContainer({ messages }: { messages: DisplayMessage[] }) {
  return (
    <div className='h-full overflow-y-auto p-3'>
      <div className='flex h-fit min-h-full flex-col justify-end'>
        {messages.map((message: DisplayMessage) => (
          <Message message={message} />
        ))}
      </div>
    </div>
  );
}

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
