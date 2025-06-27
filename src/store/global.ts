import { Locale } from "@/lib/constants/enums"
import { createStore } from "zustand"

interface PathProps {
    previous: {
        url: string | undefined,
        locale: Locale | undefined
    },
    current: {
        url: string | undefined,
        locale: Locale | undefined
    }
}

export type GlobalState = {
    // path history
    path: PathProps,
    // handle resize
    size: {
        width: number,
        height: number
    },
    // for mobile
    // is mobile
    isMobile: boolean,
}

export type GlobalActions = {
    updatePath: (path: PathProps) => void,
    updateResize: (size: { width: number, height: number }) => void,
    updateIsMobile: (isMobile: boolean) => void,
}

export type GlobalStore = GlobalState & GlobalActions

export const initGlobalStore = async (initData?: Partial<GlobalState>): Promise<GlobalState> => {
    return { ...defaultInitGlobalState, ...initData }
};

export const defaultInitGlobalState: GlobalState = {
    path: {
        previous: {
            url: undefined,
            locale: undefined
        },
        current: {
            url: undefined,
            locale: undefined
        }
    },
    size: {
        width: 0,
        height: 0
    },
    isMobile: false
}

export const createGlobalStore = (initState: Promise<GlobalState>) => {
    const store = createStore<GlobalStore>()((set) => ({
        ...defaultInitGlobalState,
        updatePath(path) {
            set({ path })
        },
        updateResize(size) {
            set({ size })
        },
        updateIsMobile(isMobile) {
            set({ isMobile })
        },
    }))
    initState.then(store.setState);
    return store;
}