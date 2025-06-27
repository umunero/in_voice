import { useState, useEffect } from "react";

/**
 * A custom React hook that debounces a value.
 * This hook delays updating a value for a specified duration,
 * which is useful for delaying expensive operations like API calls
 * until the user has stopped typing or interacting.
 *
 * @template T - The type of the value being debounced.
 * @param {T} value - The value to debounce.
 * @param {number} delay - The delay in milliseconds before the debounced value is updated.
 * If `delay` is 0, the value is updated immediately.
 * @returns {T} The debounced value.
 *
 * @example
 * // In a component:
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * useEffect(() => {
 *  if (debouncedSearchTerm) {
 *    // Only fetch data after the user stops typing for 500ms
 *    console.log('Fetching data for:', debouncedSearchTerm);
 *    // callApi(debouncedSearchTerm);
 *  }
 * }, [debouncedSearchTerm]);
 *
 * return (
 *  <input
 *    type="text"
 *    value={searchTerm}
 *    onChange={(e) => setSearchTerm(e.target.value)}
 *  />
 * );
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // If delay is 0, update immediately (no debounce)
    if (delay === 0) {
      setDebouncedValue(value);
      return;
    }

    // Set up a timeout to update the debounced value after the delay
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Clean up the timeout if value or delay changes before the timeout fires,
    // or when the component unmounts. This prevents memory leaks and ensures
    // the debounced value is only updated once per "stop" in changes.
    return () => clearTimeout(handler);
  }, [value, delay]); // Re-run effect only if value or delay changes

  return debouncedValue;
}


export default useDebounce;