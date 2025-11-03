# 📸 24-Hour Ephemeral Story Feature

Create a client-side instagram stories feature clone.

You are required to build a "Story" feature similar to those found in popular social media platforms like Instagram and WhatsApp. The goal is to allow a user to post short, ephemeral content that disappears after 24 hours. As this is a Frontend project this is going to be client-side only.

## Requirements
There will be a list of stories at the top and a plus button. Clicking the plus button will allow user to upload an image which will be converted to base64 and stored in local storage. The image will be displayed in the list of stories. The image will be removed after 24 hours. User should optionally be able to swipe through the stories.

<img width="1136" height="1790" alt="stories-project" src="https://github.com/user-attachments/assets/b3a21036-81a1-4a0f-8e23-92089a7a9d52" />

## Constraints

– You can use any frontend framework to build this.
– Feel free to use any libraries or tools you are comfortable with.
– The project should be client-side only.
– The project should be responsive.
– Image dimensions should be constrained to a maximum of 1080px x 1920px.

After building this project, you will have a better understanding of how to work with client-side storage, timeouts, and how to create a responsive design.

---

## 🚀 Technologies & Implementation Details

This feature was built using a modern, performance-focused stack:

| Category | Technology/Tool | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React (Vite)** | Frontend component architecture. |
| **Performance** | **React Compiler** | Automatic memoization of custom hooks (removing manual `useCallback`/`useMemo`). |
| **State/Data** | **`useLocalStorage`** | Client-side persistence for stories and viewed status. |
| **UX/Animation** | **`framer-motion`** & **`@use-gesture/react`** | Smooth, touch-enabled horizontal swiping and animated progress bars. |
| **Image Handling** | **Canvas API** (Native) | Resizing, constraining, and Base64 conversion for optimal storage. |

---

## ✨ Implemented Feature Breakdown

### 1. Ephemeral Content & Persistence
* **Storage:** Images are converted to **Base64** strings and stored in `localStorage` along with a timestamp.
* **Expiration:** A background timer runs in the `useStories` hook, automatically filtering and removing stories that are older than **24 hours**.
* **Time Display:** The `StoryIcon` displays the **remaining time** (e.g., "12h 35m left"), updating every minute for accuracy.

### 2. Image Processing & Constraints
* The `convertAndConstrainImage` utility ensures every uploaded image is capped at a maximum of **1080px by 1920px** before storage, respecting the constraint and maintaining a consistent vertical story format.

### 3. User Experience & Interactivity
* **Swiping:** The `StoryViewer` component implements **touch-based drag and swipe** navigation for a native feel, allowing users to move between stories.
* **Live Progress Bar:** The individual segment for the currently viewed story animates from 0% to 100% over **5 seconds** using `framer-motion`, showing the exact time remaining for that view.
* **Viewed Status:** Stories are tracked in a separate `viewedIds` list in local storage. **Unviewed stories** show a vibrant gradient border, while **viewed stories** show a subdued gray border.

---

## ⚙️ Setup and Run

To get this project running locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```
