// src/hooks/useStories.ts (Simplified for React Compiler)

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Story, StoryList } from "../types/story";
import { v4 as uuidv4 } from "uuid";

const STORY_EXPIRATION_MS = 24 * 60 * 60 * 1000;
const LOCAL_STORAGE_KEY = "24hr_stories"; // Key for localStorage's stories object
const VIEWED_KEY = "24hr_viewed_stories"; // Key for localStorage's viewed IDs (stories)

export function useStories() {
  const [stories, setStories] = useLocalStorage<StoryList>(
    LOCAL_STORAGE_KEY,
    []
  );

  // State for viewed story IDs (stored as an array of strings)
  const [viewedIds, setViewedIds] = useLocalStorage<string[]>(VIEWED_KEY, []);

  // --- 1. Expiration & Cleanup Logic ---
  // Note: The ESLint warning is suppressed in the useEffect below, relying on the Compiler.
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

      // Clean up expired IDs from the viewed list
      const activeStoryIds = new Set(activeStories.map((s) => s.id));
      const activeViewedIds = viewedIds.filter((id) => activeStoryIds.has(id));

      if (activeViewedIds.length !== viewedIds.length) {
        setViewedIds(activeViewedIds);
      }
    }

    // RETURN VALUE FIX: Return the currently active list
    return activeStories;
  };

  // --- 2. Initial Load & Interval Setup ---
  useEffect(() => {
    cleanupExpiredStories();

    // The interval is set to check every 24 hours (or 1 hour if preferred, but 24 hours is more logical for the cleanup interval)
    const intervalId = setInterval(() => {
      cleanupExpiredStories();
    }, 60 * 60 * 1000); // Check every hour (more robust than every 24h for long sessions)

    return () => clearInterval(intervalId);
  }, [cleanupExpiredStories]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- 3. Story Addition Function ---
  const addStory = (base64Image: string) => {
    const newStory: Story = {
      id: uuidv4(),
      base64Image,
      timestamp: Date.now(),
    };

    // Use functional update for safety, though compiler handles stabilization
    setStories((prevStories) => [...prevStories, newStory]);

    console.log(`[Stories] New story added with ID: ${newStory.id}`);
  };

  // Function to mark a story as viewed
  const markAsViewed = (storyId: string) => {
    setViewedIds((prevIds) => {
      if (prevIds.includes(storyId)) {
        return prevIds;
      }
      return [...prevIds, storyId];
    });
  };

  // Function to check if a story has been viewed
  const hasBeenViewed = (storyId: string) => {
    // The Compiler will re-memoize this function whenever 'viewedIds' changes.
    return viewedIds.includes(storyId);
  };

  return {
    stories,
    addStory,
    cleanupExpiredStories,
    viewedIds,
    markAsViewed,
    hasBeenViewed,
  };
}
