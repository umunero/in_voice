// components/Popover.tsx
'use client'; // This component needs to run on the client-side for DOM manipulation

import React, { useState, useRef, useEffect, useCallback, ReactNode } from 'react';

// Define the possible placement options for the popover
type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

// Define the possible trigger events
type PopoverTriggerEvent = 'click' | 'hover';

// Define the props for the Popover component
interface PopoverProps {
  children: ReactNode; // The trigger element
  content: ReactNode; // The content to be displayed in the popover
  placement?: PopoverPlacement; // Optional placement of the popover, defaults to 'bottom-start'
  triggerEvent?: PopoverTriggerEvent; // Optional trigger event, 'click' or 'hover', defaults to 'click'
}

const Popover: React.FC<PopoverProps> = ({
  children,
  content,
  placement = 'bottom-start',
  triggerEvent = 'click', // Default to click
}) => {
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const triggerRef = useRef<HTMLDivElement>(null); // Ref for the trigger element
  const popoverRef = useRef<HTMLDivElement>(null); // Ref for the popover content element
  // Removed hoverTimeoutRef as we want instant closing

  // Function to calculate and set popover position
  const positionPopover = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverRect = popoverRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = triggerRect.top - popoverRect.height - 8; // 8px offset
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'top-start':
        top = triggerRect.top - popoverRect.height - 8;
        left = triggerRect.left;
        break;
      case 'top-end':
        top = triggerRect.top - popoverRect.height - 8;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'bottom':
        top = triggerRect.bottom + 8;
        left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + 8;
        left = triggerRect.left;
        break;
      case 'bottom-end':
        top = triggerRect.bottom + 8;
        left = triggerRect.right - popoverRect.width;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.left - popoverRect.width - 8;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - popoverRect.width - 8;
        break;
      case 'left-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.left - popoverRect.width - 8;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
        left = triggerRect.right + 8;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + 8;
        break;
      case 'right-end':
        top = triggerRect.bottom - popoverRect.height;
        left = triggerRect.right + 8;
        break;
      default:
        top = triggerRect.bottom + 8; // Default to bottom-start if placement is invalid
        left = triggerRect.left;
        break;
    }

    // Basic adjustments for viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Ensure popover doesn't go off screen horizontally
    if (left + popoverRect.width > viewportWidth - 16) {
      left = viewportWidth - popoverRect.width - 16;
    }
    if (left < 16) {
      left = 16;
    }

    // Ensure popover doesn't go off screen vertically
    if (top + popoverRect.height > viewportHeight - 16) {
      if (placement.startsWith('bottom')) {
        top = triggerRect.top - popoverRect.height - 8; // Try flipping to top
      } else {
        top = viewportHeight - popoverRect.height - 16;
      }
    }
    if (top < 16) {
      if (placement.startsWith('top')) {
        top = triggerRect.bottom + 8; // Try flipping to bottom
      } else {
        top = 16;
      }
    }

    // Apply calculated styles
    popoverRef.current.style.top = `${top + window.scrollY}px`;
    popoverRef.current.style.left = `${left + window.scrollX}px`;
  }, [placement]);

  // Handle popover visibility and positioning
  useEffect(() => {
    if (showPopover) {
      positionPopover();
      // Recalculate position on scroll and resize
      window.addEventListener('resize', positionPopover);
      window.addEventListener('scroll', positionPopover);
    }

    // Cleanup event listeners
    return () => {
      window.removeEventListener('resize', positionPopover);
      window.removeEventListener('scroll', positionPopover);
    };
  }, [showPopover, positionPopover]);

  // Handle click outside to close popover (only for 'click' trigger)
  useEffect(() => {
    if (triggerEvent === 'hover') return; // Click outside not needed for hover

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopover, triggerEvent]);

  // Handle Escape key to close popover
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPopover) {
        setShowPopover(false);
        triggerRef.current?.focus(); // Return focus to the trigger
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showPopover]);

  // Event handlers based on triggerEvent prop
  const handleTriggerClick = () => {
    if (triggerEvent === 'click') {
      setShowPopover((prev) => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (triggerEvent === 'hover') {
      setShowPopover(true); // Show instantly on mouse enter
    }
  };

  const handleMouseLeave = () => {
    if (triggerEvent === 'hover') {
      setShowPopover(false); // Hide instantly on mouse leave
    }
  };

  // Removed handlePopoverMouseEnter and handlePopoverMouseLeave
  // If you want to keep the popover open while hovering its content,
  // you would re-introduce them and their related mouse events on popoverRef.
  // For instant close on leaving *any* part of the popover or trigger,
  // these are not needed.

  return (
    <>
      {/* Trigger Element */}
      <div
        ref={triggerRef}
        onClick={handleTriggerClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-haspopup="dialog"
        aria-expanded={showPopover}
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Toggle for click event, or simply show/hide for hover
            if (triggerEvent === 'click') {
              handleTriggerClick();
            } else if (triggerEvent === 'hover') {
              setShowPopover((prev) => !prev); // Toggle for keyboard in hover mode
            }
          }
        }}
      >
        {children}
      </div>

      {/* Popover Content */}
      {showPopover && (
        <div
          ref={popoverRef}
          role="dialog"
          className="fixed z-50 p-4 bg-white border border-gray-200 rounded shadow-lg
                     outline-none focus:outline-none"
          tabIndex={-1}
          style={{ opacity: showPopover ? 1 : 0 }}
          // Removed onMouseEnter and onMouseLeave from popoverRef for instant closing
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Popover;