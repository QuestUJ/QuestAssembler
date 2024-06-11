import { create } from 'zustand';

type StoryChunkState = {
  story: string;
  oldStory: string | undefined; // used for storing story after using llm
  isGeneratingWithLLM: boolean;
};

type StoryChunkActions = {
  setNewStoryWithLLM: (newStory: string) => void;
  setStory: (newStory: string) => void;
  revertStory: () => void;
  setGeneratingStatus: (val: boolean) => void;
};

export const useStoryChunkStore = create<StoryChunkState & StoryChunkActions>()(
  set => ({
    story: '',
    oldStory: undefined,
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
    revertStory: () =>
      set(state => ({
        story: state.oldStory,
        oldStory: undefined
      })),
    setGeneratingStatus: val =>
      set(() => ({
        isGeneratingWithLLM: val
      }))
  })
);
