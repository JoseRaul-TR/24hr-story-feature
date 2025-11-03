// src/components/StoryViewer/StoryViewer.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, useMotionValue } from "framer-motion";
import { useDrag } from "@use-gesture/react"; // Using the recommended package
import type { Story } from "../../types/story";
import "./StoryViewer.css";

interface StoryViewerProps {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
  markAsViewed: (storyId: string) => void;
}

const VIEW_DURATION_MS = 3000; // Duration for displaying ONE story (3 seconds)

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  startIndex,
  onClose,
  markAsViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const currentStory = stories[currentIndex];

  const x = useMotionValue(0);

  // --- Animation State ---
  // Key state is used to reset and re-trigger the animation on every story change
  const [animationKey, setAnimationKey] = useState(0);

  // --- Navigation & Timer Logic ---

  const handleNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnimationKey((prev) => prev + 1); // Reset animation key for the next story
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnimationKey((prev) => prev + 1); // Reset animation key for the previous story
    }
  }, [currentIndex]);

  // Effect to handle automatic progression and marking as viewed
  useEffect(() => {
    if (!currentStory) return;

    markAsViewed(currentStory.id);

    const timer = setTimeout(() => {
      handleNext();
    }, VIEW_DURATION_MS);

    x.set(0);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    stories.length,
    markAsViewed,
    currentStory?.id,
    handleNext,
  ]); // handleNext is stable

  // --- Gesture Implementation (remains the same) ---
  const SWIPE_THRESHOLD = 100;

  const bind = useDrag(
    ({ down, movement: [mx], direction: [dx] }) => {
      if (down) {
        x.set(mx);
        // Optional: Pause the timer/animation here if implemented with global state
      } else {
        const isSwipeNext = mx < -SWIPE_THRESHOLD && dx < 0;
        const isSwipePrev = mx > SWIPE_THRESHOLD && dx > 0;

        if (isSwipeNext) {
          handleNext();
        } else if (isSwipePrev) {
          handlePrev();
        }

        x.start(0);
      }
    },
    { axis: "x" }
  );

  if (!currentStory) {
    return null;
  }

  return (
    <div className="story-viewer-overlay">
      {/* 1. Top Progress Bar Container */}
      <div className="progress-bar-container">
        {stories.map((story, index) => (
          <div key={story.id} className="progress-segment-wrapper">
            {/* PROGRESS BAR LOGIC */}
            <div
              className="progress-segment-background"
              style={{
                backgroundColor:
                  index <= currentIndex
                    ? "rgba(255, 255, 255, 0.4)"
                    : "rgba(255, 255, 255, 0.2)",
              }}
            >
              {/* Animated Foreground */}
              {index === currentIndex && (
                <motion.div
                  key={animationKey} // Key change: forces re-render/re-animation on index change
                  className="progress-segment-foreground"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: VIEW_DURATION_MS / 1000, // Duration in seconds
                    ease: "linear",
                  }}
                  // If previous segments are done, they should be 100% white
                />
              )}
              {/* Checkmark for previously viewed/completed stories */}
              {index < currentIndex && (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Close Button, 3. Navigation Buttons, and 4. Story Content (all remain the same) */}
      <button className="close-button" onClick={onClose}>
        &times;
      </button>

      <motion.div
        {...bind()}
        className="story-content-wrapper"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        dragElastic={0.1}
      >
        <img
          src={currentStory.base64Image}
          alt={`Story ${currentIndex + 1}`}
          className="story-image"
        />
      </motion.div>

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
    </div>
  );
};
