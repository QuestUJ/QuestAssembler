import { create } from 'zustand';

type StoryChunkState = {
  story: string;
  oldStory: string | undefined; // used for storing story after using llm
  currentPhotoURL: string | undefined;
  isGeneratingWithLLM: boolean;
};

type StoryChunkActions = {
  setNewStoryWithLLM: (newStory: string) => void;
  setStory: (newStory: string) => void;
  reverseStory: () => void;
  setGeneratingStatus: () => void;
};

export const useStoryChunkStore = create<StoryChunkState & StoryChunkActions>()(
  set => ({
    story: '',
    oldStory: undefined,
    currentPhotoURL: undefined,
    isGeneratingWithLLM: false,
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
    reverseStory: () =>
      set(state => ({
        story: state.oldStory,
        oldStory: undefined
      })),
    setGeneratingStatus: () =>
      set(() => ({
        isGeneratingWithLLM: true
      }))
  })
);
