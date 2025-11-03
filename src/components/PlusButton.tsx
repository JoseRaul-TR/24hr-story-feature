// src/components/PlusButton.tsx
import React, { useRef } from "react";
import "./StoryList/StoryList.css";

// Define the component's props
interface PlusButtonProps {
  onImageUpload: (file: File) => void;
}

export const PlusButton: React.FC<PlusButtonProps> = ({ onImageUpload }) => {
  // Use a ref to control the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to simulate a click on the hidden file input
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle the file selection change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    // Reset the input value so the same file can be uploaded again
    event.target.value = "";
  };

  return (
    <div className="plus-button-container">
      {/* Visual Plus Button/Icon */}
      <button onClick={handleClick} className="plus-button" title="Add Story">
        +
      </button>
      <span className="plus-button-label">Add Story</span>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        className="plus-button-input"
      />
    </div>
  );
};
