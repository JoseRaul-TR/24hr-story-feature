// src/components/StoryContainer/StoryContainer.tsx
import React, { useState } from "react";
import { useStories } from "../../hooks/useStories";
import { convertAndConstrainImage } from "../../utils/imageConverter";
import { StoryList } from "../StoryList/StoryList";
import { StoryViewer } from "../StoryViewer/StoryViewer";
import "./StoryContainer.css";

export const StoryContainer: React.FC = () => {
  const { stories, addStory, hasBeenViewed, markAsViewed } = useStories();
  const [isProcessing, setIsProcessing] = useState(false);

  // State to manage the viewing of stories
  // Stores the index of the story that was clicked to start the viewer
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  /**
   * Handles the file upload, conversion, and addition to the story list.
   */
  const handleImageUpload = async (file: File) => {
    if (isProcessing) return;

    setIsProcessing(true);
    console.log(`[Upload] Processing file: ${file.name}`);

    try {
      // 1. Convert, constrain, and resize the image
      const base64Image = await convertAndConstrainImage(file);

      // 2. Add the resulting Base64 string to the stories list
      addStory(base64Image);

      console.log("[Upload] Image successfully processed and added.");
    } catch (error) {
      console.error("[Upload Error]", error);
      alert("Failed to process image. Please check the console for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Finds the index of the clicked story and opens the viewer.
   */
  const handleStoryClick = (storyId: string) => {
      const index = stories.findIndex((story) => story.id === storyId);
      if (index !== -1) {
        setActiveStoryIndex(index);
      }
    };

  /**
   * Closes the story viewer.
   */
  const handleCloseViewer = () => {
      setActiveStoryIndex(null);
    };

  return (
    <div className="story-container">
      <h1>📸 Stories 📸</h1>

      {/* --- Story List Area (Horizontal Scroll) --- */}
      <div className="story-list-wrapper">
        <StoryList
          stories={stories}
          onImageUpload={handleImageUpload}
          onStoryClick={handleStoryClick}
          hasBeenViewed={hasBeenViewed}
        />
      </div>

      {/* --- Status Indicators --- */}
      {isProcessing && (
        <p className="status-processing">
          Processing image... Please wait. (Image quality/size constraints are
          being applied)
        </p>
      )}

      {stories.length === 0 && !isProcessing && (
        <p className="status-empty">
          No active stories. Click the plus button to add one!
        </p>
      )}

      {/* --- Story Viewer (Full Screen Swiper) --- */}
      {/* Conditionally render the viewer if an active index is set */}
      {activeStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          startIndex={activeStoryIndex}
          onClose={handleCloseViewer}
          markAsViewed={markAsViewed}
        />
      )}
    </div>
  );
};
