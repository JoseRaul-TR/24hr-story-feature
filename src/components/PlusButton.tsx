// src/components/PlusButton.tsx
import React, { useRef } from "react";

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
    <div
      style={{
        marginRight: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Visual Plus Button/Icon */}
      <button
        onClick={handleClick}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#ddd",
          border: "2px solid #ccc",
          fontSize: "30px",
          cursor: "pointer",
          color: "#555",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        title="Add Story"
      >
        +
      </button>
      <span style={{ fontSize: "12px", marginTop: "4px" }}>Add Story</span>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};
