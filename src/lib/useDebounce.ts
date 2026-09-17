import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce high-frequency values (e.g. search bar keystrokes, window resize).
 * Delays updating the debounced state until the user has stopped changing it for `delay` milliseconds.
 *
 * @param value The value to debounce
 * @param delay Milliseconds to wait (default: 250ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
