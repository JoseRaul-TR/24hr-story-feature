// src/hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

/**
 * A custom hook to synchronize React state with localStorage.
 * * @param key The key to use for localStorage (e.g., 'stories').
 * @param initialValue The initial value if nothing is found in localStorage.
 * @returns An array containing the current state value and a setter function.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // 1. Initialize state with a value from localStorage or the initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error occurs (e.g., localStorage full or permissions issue),
      // return initial value and log the error.
      console.error("Error reading localStorage key “" + key + "”: ", error);
      return initialValue;
    }
  });

  // 2. useEffect to update localStorage whenever the state changes (storedValue)
  useEffect(() => {
    try {
      // Check if window is defined (important for potential server-side rendering, though client-side here)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      // A more robust app might show a user notification here.
      console.error("Error writing to localStorage key “" + key + "”: ", error);
    }
  }, [key, storedValue]);

  // Return the state value and the setter function
  return [storedValue, setStoredValue];
}
