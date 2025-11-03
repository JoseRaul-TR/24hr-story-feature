// src/types/story.ts

/**
 * Interface defining the structure of a single ephemeral Story.
 */
export interface Story {
  /** A unique identifier for the story. */
  id: string;

  /** The image data encoded as a Base64 string. */
  base64Image: string;

  /** * Timestamp (milliseconds since epoch) when the story was posted.
   * Used to calculate the 24-hour expiration.
   */
  timestamp: number;
}

/**
 * Type for the array of stories stored in state and localStorage.
 */
export type StoryList = Story[];
