// src/components/StoryList/StoryList.tsx
import React from "react";
import type { Story } from "../../types/story";
import { StoryIcon } from "../StoryIcon";
import { PlusButton } from "../PlusButton";
import "./StoryList.css";

interface StoryListProps {
  stories: Story[];
  onImageUpload: (file: File) => void;
  onStoryClick: (storyId: string) => void;
  hasBeenViewed: (storyId: string) => boolean;
}

// NOTE: This assumes StoryContainer now renders the PlusButton separately,
// but we include it here for completeness if you prefer it consolidated.

export const StoryList: React.FC<StoryListProps> = ({
  stories,
  onImageUpload,
  onStoryClick,
  hasBeenViewed,
}) => {
  return (
    <div className="story-list">
      {/* 1. Add Story Button */}
      <PlusButton onImageUpload={onImageUpload} />

      {/* 2. List of Stories */}
      {stories.map((story) => (
        <StoryIcon
          key={story.id}
          story={story}
          hasBeenViewed={hasBeenViewed(story.id)}
          onClick={onStoryClick}
        />
      ))}
    </div>
  );
};
