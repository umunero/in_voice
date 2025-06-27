import { useRef, useState, useEffect, useCallback } from 'react';


/**
 * @description This hook is used to check if an element is in view.
 * @param options - The options for the IntersectionObserver.
 * @param options.root - The root element to observe.
 * @param options.rootMargin - The margin around the root element.
 * It behaves like CSS margin properties but oppposite (e.g., "10px 20px 30px 40px" for bottom, left, top, right).
 * @param options.threshold - The threshold for the IntersectionObserver, will effect rootMargin.
 * - `> 0`: if margin is negative, threshold will increase the margin value (-100 - (100*0.1)= -110).
 * - `< 0`: if margin is positive, threshold will decrease the margin value (100 - (100*0.1)= 90).
 * @returns A tuple containing the ref and the inView state.
 */
function useInView<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit
): [React.MutableRefObject<T | null>, boolean] {
  const elementRef = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        setInView(entry.isIntersecting);
      });
    },
    []
  );

  useEffect(() => {
    const currentElement = elementRef.current;
    let observer: IntersectionObserver | null = null;

    if (currentElement) {
      observer = new IntersectionObserver(observerCallback, options);
      observer.observe(currentElement);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [options, observerCallback]);

  return [elementRef, inView];
}

export default useInView;