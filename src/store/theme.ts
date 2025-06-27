import { Theme } from "@/lib/constants/enums";
import { createStore } from "zustand";

export type ThemeState = {
    theme: Theme | undefined;
}

export type ThemeActions = {
    toggleTheme: (isDark: boolean) => void;
    initializeTheme: () => void;
}

export type ThemeStore = ThemeState & ThemeActions;

export const initThemeStore = async (): Promise<ThemeState> => {
    return defaultInitThemeState
}

export const defaultInitThemeState: ThemeState = {
    theme: undefined
}

export const createThemeStore = (initState: Promise<ThemeState>) => {
    const store = createStore<ThemeStore>()((set) => ({
        ...defaultInitThemeState,
        toggleTheme(isDark: boolean) {
            const theme = isDark ? Theme.DARK : Theme.LIGHT;
            set({ theme: theme });
        },
        initializeTheme: () => {
            const savedTheme = localStorage.getItem('theme');
            set({ theme: savedTheme === 'dark' ? Theme.DARK : Theme.LIGHT });
        },
    }))
    initState.then(store.setState);
    return store;
}