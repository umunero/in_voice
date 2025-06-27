'use client'

import { Theme } from "@/lib/constants/enums";
import { useThemeStore } from "@/providers";
import { useEffect } from "react";

export default function ThemeHandler() {
    // TO ENHANCE: straight change to current mode
    // problem for now: if user is dark mode, bg-white => bg-black
    const { theme, initializeTheme } = useThemeStore(state => ({
        theme: state.theme,
        initializeTheme: state.initializeTheme
    }));

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');

            if (!savedTheme) {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT;
                localStorage.setItem('theme', systemTheme);
            }

            initializeTheme();
        }
    }, [initializeTheme]);

    useEffect(() => {
        if (typeof window !== 'undefined' && theme) {
            document.documentElement.classList.toggle('dark', theme === Theme.DARK);
            document.body.classList.toggle('dark', theme === Theme.DARK);
            localStorage.setItem("theme", theme);
        }
    }, [theme]);

    // listen to system theme change
    useEffect(() => {
        const applyTheme = (theme: Theme) => {
            document.documentElement.classList.toggle('dark', theme === Theme.DARK);
            document.body.classList.toggle('dark', theme === Theme.DARK);
        };

        const stored = localStorage.getItem('theme') as Theme | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(stored ?? (prefersDark ? Theme.DARK : Theme.LIGHT));

        const onStorage = (e: StorageEvent) => {
            if (e.key === 'theme' && (e.newValue === Theme.DARK || e.newValue === Theme.LIGHT)) {
                applyTheme(e.newValue);
            }
        };

        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);


    return null;
}