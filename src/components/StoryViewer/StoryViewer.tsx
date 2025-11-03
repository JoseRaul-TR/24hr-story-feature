// src/components/StoryViewer/StoryViewer.tsx
import React, { useState, useEffect, useCallback } from "react";
import type { Story } from "../../types/story";
import "./StoryViewer.css"; // For full-screen styles and responsiveness

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  startIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const currentStory = stories[currentIndex];

  // Timer for automatic progression (e.g., 5 seconds per story)
  useEffect(() => {
    if (!currentStory) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, stories.length]); // Re-start timer when current story changes

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Last story, close the viewer
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    // Cannot go back from the first story
  }, [currentIndex]);

  // Handle keyboard navigation for desktop users
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  if (!currentStory) {
    return null; // Should not happen if stories array is managed correctly
  }

  // Calculate expiration progress (for the top bar)
  const elapsedTime = Date.now() - currentStory.timestamp;
  const totalDuration = 24 * 60 * 60 * 1000;
  const expirationProgress = Math.min(100, (elapsedTime / totalDuration) * 100);

  return (
    <div className="story-viewer-overlay">
      {/* 1. Top Progress Bar */}
      <div className="progress-bar-container">
        {stories.map((story, index) => (
          <div key={story.id} className="progress-segment-wrapper">
            <div
              className="progress-segment"
              style={{
                // Fill the bar based on status
                backgroundColor:
                  index < currentIndex ? "white" : "rgba(255, 255, 255, 0.4)",
                width:
                  index === currentIndex
                    ? `${100 - expirationProgress}%`
                    : index < currentIndex
                    ? "100%"
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* 2. Close Button */}
      <button className="close-button" onClick={onClose}>
        &times;
      </button>

      {/* 3. Navigation Buttons (Simulated Swipe) */}
      <button
        className="nav-button prev"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        {"<"}
      </button>
      <button
        className="nav-button next"
        onClick={handleNext}
        disabled={currentIndex === stories.length - 1}
      >
        {">"}
      </button>

      {/* 4. Story Content */}
      <div className="story-content-wrapper">
        <img
          src={currentStory.base64Image}
          alt={`Story ${currentIndex + 1}`}
          className="story-image"
        />
      </div>
    </div>
  );
};
