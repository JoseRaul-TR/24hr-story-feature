// src/hooks/useStories.ts (Simplified for React Compiler)

import { useEffect } from "react"; // useCallback is removed
import { useLocalStorage } from "./useLocalStorage";
import type { Story, StoryList } from "../types/story";
import { v4 as uuidv4 } from "uuid";

const STORY_EXPIRATION_MS = 24 * 60 * 60 * 1000;
const LOCAL_STORAGE_KEY = "24hr_stories";

export function useStories() {
  const [stories, setStories] = useLocalStorage<StoryList>(
    LOCAL_STORAGE_KEY,
    []
  );

  // --- 1. Expiration & Cleanup Logic (useCallback removed) ---
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cleanupExpiredStories = () => {
    const now = Date.now();

    const activeStories = stories.filter((story) => {
      return now - story.timestamp < STORY_EXPIRATION_MS;
    });

    if (activeStories.length !== stories.length) {
      console.log(
        `[Stories] Cleaning up: Removed ${
          stories.length - activeStories.length
        } expired story(ies).`
      );
      setStories(activeStories);
    }
    return activeStories;
  }; 
  // The React Compiler will make this function stable based on its dependencies (stories, setStories).

  // --- 2. Initial Load & Interval Setup ---
  useEffect(() => {
    cleanupExpiredStories();

    // The compiler ensures cleanupExpiredStories is stable, so this dependency is fine.
    const intervalId = setInterval(() => {
      cleanupExpiredStories();
    }, 60 * 60 * 1000); 

    return () => clearInterval(intervalId);
  }, [cleanupExpiredStories]);    

  // --- 3. Story Addition Function (useCallback removed) ---
  const addStory = (base64Image: string) => {
    const newStory: Story = {
      id: uuidv4(),
      base64Image,
      timestamp: Date.now(),
    };

    setStories((prevStories) => [...prevStories, newStory]);

    console.log(`[Stories] New story added with ID: ${newStory.id}`);
  };
  // The React Compiler will make this function stable based on setStories.

  return {
    stories,
    addStory,
    cleanupExpiredStories,
  };
}