// src/components/StoryList/StoryList.tsx
import React from "react";
import type { Story } from "../../types/story";
import { StoryIcon } from "../StoryIcon";
import { PlusButton } from "../PlusButton";

interface StoryListProps {
  stories: Story[];
  onImageUpload: (file: File) => void;
  onStoryClick: (storyId: string) => void;
}

// NOTE: This assumes StoryContainer now renders the PlusButton separately,
// but we include it here for completeness if you prefer it consolidated.

export const StoryList: React.FC<StoryListProps> = ({
  stories,
  onImageUpload,
  onStoryClick,
}) => {
  // In a real app, you'd track viewed IDs in local storage
  const viewedStoryIds = new Set<string>(); // Placeholder: assume none viewed for now

  return (
    <div
      style={{
        display: "flex",
        overflowX: "auto",
        padding: "10px 0",
        width: "100%",
        // Ensure scrollbar is hidden but scrolling is possible for mobile responsiveness
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {/* 1. Add Story Button */}
      <PlusButton onImageUpload={onImageUpload} />

      {/* 2. List of Stories */}
      {stories.map((story) => (
        <StoryIcon
          key={story.id}
          story={story}
          hasBeenViewed={viewedStoryIds.has(story.id)}
          onClick={onStoryClick}
        />
      ))}
    </div>
  );
};
