'use client'

import { createGlobalStore, GlobalState, GlobalStore, initGlobalStore } from '@/store/global'
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
    undefined,
)

export interface GlobalStoreProviderProps {
    children: ReactNode,
    initData?: Partial<GlobalState>
}

export const GlobalStoreProvider = ({
    children,
    initData
}: GlobalStoreProviderProps) => {
    const storeRef = useRef<GlobalStoreApi>(undefined)
    if (!storeRef.current) {
        storeRef.current = createGlobalStore(initGlobalStore(initData))
    }

    return (
        <GlobalStoreContext.Provider value={storeRef.current}>
            {children}
        </GlobalStoreContext.Provider>
    )
}

export const useGlobalStore = <T,>(
    selector: (store: GlobalStore) => T,
): T => {
    const counterStoreContext = useContext(GlobalStoreContext)

    if (!counterStoreContext) {
        throw new Error(`useGlobalStore must be used within GlobalStoreProvider`)
    }

    return useStore(counterStoreContext, useShallow(selector))
}