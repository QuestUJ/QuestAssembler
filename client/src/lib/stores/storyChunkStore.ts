import { create } from 'zustand';

type StoryChunkState = {
  story: string;
  oldStory: string | undefined; // used for storing story after using llm
  currentImageURL: string | undefined;
  currentImageBlob: Blob | undefined;
  isGeneratingWithLLM: boolean;
};

type StoryChunkActions = {
  setNewStoryWithLLM: (newStory: string) => void;
  setStory: (newStory: string) => void;
  revertStory: () => void;
  setGeneratingStatus: () => void;
  setCurrentImageURL: (url: string) => void;
  setCurrentImageBlob: (imageBlob: Blob) => void;
};

export const useStoryChunkStore = create<StoryChunkState & StoryChunkActions>()(
  set => ({
    story: '',
    oldStory: undefined,
    currentImageURL: undefined,
    isGeneratingWithLLM: false,
    currentImageBlob: undefined,
    setNewStoryWithLLM: newStory =>
      set(state => ({
        oldStory: state.story,
        story: newStory,
        isGeneratingWithLLM: false
      })),
    setStory: newStory =>
      set(() => ({
        story: newStory
      })),
    revertStory: () =>
      set(state => ({
        story: state.oldStory,
        oldStory: undefined
      })),
    setGeneratingStatus: () =>
      set(() => ({
        isGeneratingWithLLM: true
      })),
    setCurrentImageURL: (url: string) =>
      set(() => ({
        currentImageURL: url
      })),
    setCurrentImageBlob: (imageBlob: Blob) =>
      set(() => ({
        currentImageBlob: imageBlob
      }))
  })
);
