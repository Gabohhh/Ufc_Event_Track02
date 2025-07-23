// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

// This custom hook makes it easy to use state that is also saved to Local Storage.
// It takes a storage key and an initial value as arguments.
function useLocalStorage(key, initialValue) {
  // Get the stored value from Local Storage or use the initial value.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // This effect runs whenever the storedValue changes,
  // saving the new value to Local Storage.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;