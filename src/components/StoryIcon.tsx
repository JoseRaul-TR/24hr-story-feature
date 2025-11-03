// src/components/StoryIcon.tsx
import React from "react";
import type { Story } from "../types/story";
import "./StoryList/StoryList.css";

interface StoryIconProps {
  story: Story;
  hasBeenViewed: boolean; // Optional: for visual difference between viewed/unviewed
  onClick: (storyId: string) => void;
}

export const StoryIcon: React.FC<StoryIconProps> = ({
  story,
  hasBeenViewed,
  onClick,
}) => {
  // Use a temporary style for the circle border based on viewed status
  const borderColor = hasBeenViewed
    ? "#ccc"
    : "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

  const handleClick = () => {
    onClick(story.id);
  };

  return (
    <div className="story-icon-container" onClick={handleClick}>
      <div className="story-icon-border" style={{ background: borderColor }}>
        {/* Story Image */}
        <img
          src={story.base64Image}
          alt={`Story from ${story.id}`}
          className="story-icon-image"
        />
      </div>
      <span className="story-icon-label">Story</span>
    </div>
  );
};
