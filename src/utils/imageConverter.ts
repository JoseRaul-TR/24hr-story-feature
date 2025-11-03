// src/utils/imageConverter.ts

const MAX_WIDTH = 1080;
const MAX_HEIGHT = 1920;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.9; // JPEG quality from 0 to 1

/**
 * Reads an image file and converts it into a constrained Base64 string.
 * This handles both the conversion and the dimension constraint (resizing if necessary).
 * * @param file The image File object from the user input.
 * @returns A Promise that resolves with the Base64 data URL string.
 */
export function convertAndConstrainImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Check if the file is an image
    if (!file.type.startsWith("image/")) {
      return reject(new Error("File is not a valid image."));
    }

    // 2. Read the file as a data URL (Base64)
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read the file."));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;

      // 3. Load the image onto a virtual HTML Image element
      const img = new Image();
      img.onerror = () =>
        reject(new Error("Failed to load image for processing."));

      img.onload = () => {
        // 4. Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;
        const aspectRatio = width / height;

        if (width > MAX_WIDTH) {
          width = MAX_WIDTH;
          height = width / aspectRatio;
        }

        if (height > MAX_HEIGHT) {
          height = MAX_HEIGHT;
          width = height * aspectRatio;
        }

        // 5. Use Canvas to draw the image at the new size and get the constrained Base64 string
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get 2D rendering context."));
        }

        // Draw the image onto the canvas at the constrained size
        ctx.drawImage(img, 0, 0, width, height);

        // Export the canvas content as a Base64 data URL
        const constrainedBase64 = canvas.toDataURL(MIME_TYPE, QUALITY);

        resolve(constrainedBase64);
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
