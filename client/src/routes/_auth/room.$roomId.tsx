import { InputBar } from "@/components/InputBar";
import { createFileRoute } from "@tanstack/react-router";


type DisplayMessage = {
    authorName: string;
    characterPictureURL: string | undefined;
    messageTimeStamp: Date;
    messageContent: string;
};

function Message({message}: {message: DisplayMessage}) {
    return (
        <div className="w-full min-h-10 flex m-1 my-3">
            <img src={message.characterPictureURL} className="max-h-10 h-full aspect-square rounded-full"/>
            <div className="w-full mx-2">
                <div className="flex flex-nowrap items-center">
                    <h1 className="text-md text-primary mr-2">{message.authorName}</h1>
                    <h3 className="text-xs text-secondary pt-1">{message.messageTimeStamp.toDateString()}</h3>
                </div>
                <p className="text-xs">{message.messageContent}</p>
            </div>
        </div>
    )
}

// for testing only
const PLACEHOLDER_DUMMY_MESSAGES: DisplayMessage[] = [
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Kolgomorov",
        characterPictureURL: "https://pl.mathigon.org/content/shared/bios/kolmogorov.jpg",
        messageContent: "Siemano, jakaś kompresja ktoś coś?",
        messageTimeStamp: new Date()
    },
    {
        authorName: "Nie Kolgomorov",
        characterPictureURL: "https://ocdn.eu/pulscms-transforms/1/yvok9kqTURBXy83NDI4OWE2NDBlMWU5MTFiN2Q3YTljY2FhOWJjNzEyYy5qcGVnkpUDABTNAmzNAV2TBc0EDs0CSN4AAaEwBQ",
        messageContent: "Siemano, może nie?",
        messageTimeStamp: new Date()
    },
]

function MessageContainer({messages}: {messages: DisplayMessage[]}) {
    return (
        <div className="overflow-y-auto h-full p-3">
            <div className="h-fit min-h-full flex flex-col justify-end">
                {messages.map((message: DisplayMessage) => <Message message={message}/>)}
            </div>
        </div>
    )
}

function Room() {
    return (
        <div className="flex flex-col justify-end h-full">
            <MessageContainer messages={PLACEHOLDER_DUMMY_MESSAGES}/>
            <InputBar handleSend={() => console.log("send handled")} sendButtonText="Send"/>
        </div>
    )
}

export const Route = createFileRoute('/_auth/room/$roomId')({
    component: Room
})