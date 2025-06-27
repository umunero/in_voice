'use client'

import { createThemeStore, ThemeStore, initThemeStore } from '@/store/theme'
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type ThemeStoreApi = ReturnType<typeof createThemeStore>

export const ThemeStoreContext = createContext<ThemeStoreApi | undefined>(
    undefined,
)

export interface ThemeStoreProviderProps {
    children: ReactNode
}

export const ThemeStoreProvider = ({
    children
}: ThemeStoreProviderProps) => {
    const storeRef = useRef<ThemeStoreApi>(undefined)
    if (!storeRef.current) {
        storeRef.current = createThemeStore(initThemeStore())
    }

    return (
        <ThemeStoreContext.Provider value={storeRef.current}>
            {children}
        </ThemeStoreContext.Provider>
    )
}

export const useThemeStore = <T,>(
    selector: (store: ThemeStore) => T,
): T => {
    const counterStoreContext = useContext(ThemeStoreContext)

    if (!counterStoreContext) {
        throw new Error(`useThemeStore must be used within ThemeStoreProvider`)
    }

    return useStore(counterStoreContext, useShallow(selector))
}