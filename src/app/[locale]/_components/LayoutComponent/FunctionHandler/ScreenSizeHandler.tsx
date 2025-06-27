'use client'

import { useGlobalStore } from '@/providers';
import { useEffect } from 'react'

export default function ScreenSizeHandler() {
    const { updateResize, updateIsMobile } = useGlobalStore(state => ({
        updateResize: state.updateResize,
        updateIsMobile: state.updateIsMobile
    }))

    useEffect(() => {
        const handleResize = () => {
            updateResize({
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            })
            updateIsMobile(document.documentElement.clientWidth <= 768);
        };

        // Initial check
        handleResize();

        // Add event listener to update on resize
        window.addEventListener('resize', handleResize);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [updateIsMobile, updateResize]);

    return null;
}