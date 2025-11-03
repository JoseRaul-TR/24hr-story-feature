// src/components/StoryIcon.tsx
import React from "react";
import type { Story } from "../types/story";

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
  const borderColor = hasBeenViewed ? "#ccc" : "#E1306C"; // Grey for viewed, Instagram Pink for unviewed

  const handleClick = () => {
    onClick(story.id);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginRight: "16px",
        cursor: "pointer",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          padding: "2px", // Space for the border effect
          background: `linear-gradient(45deg, ${borderColor}, ${borderColor})`,
        }}
      >
        {/* Story Image */}
        <img
          src={story.base64Image}
          alt={`Story from ${story.id}`}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid white", // Inner white border for contrast
          }}
        />
      </div>
      <span
        style={{
          fontSize: "10px",
          marginTop: "4px",
          maxWidth: "64px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Story
      </span>
    </div>
  );
};
