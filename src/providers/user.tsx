'use client'

import { createUserStore, defaultInitUserState, initUserStore, UserState, UserStore } from '@/store/user'
import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

export type UserStoreApi = ReturnType<typeof createUserStore>

export const UserStoreContext = createContext<UserStoreApi | undefined>(
    undefined,
)

export interface UserStoreProviderProps {
    children: ReactNode,
    initData?: Partial<UserState>
}

export const UserStoreProvider = ({
    children,
    initData
}: UserStoreProviderProps) => {
    const storeRef = useRef<UserStoreApi | null>(null)
    if (!storeRef.current) {
        storeRef.current = createUserStore(initUserStore(initData ?? defaultInitUserState))
    }

    return (
        <UserStoreContext.Provider value={storeRef.current}>
            {children}
        </UserStoreContext.Provider>
    )
}

export const useUserStore = <T,>(
    selector: (store: UserStore) => T,
): T => {
    const counterStoreContext = useContext(UserStoreContext)

    if (!counterStoreContext) {
        throw new Error(`useUserStore must be used within UserStoreProvider`)
    }

    return useStore(counterStoreContext, useShallow(selector))
}