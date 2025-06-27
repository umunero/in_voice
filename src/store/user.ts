import { UserGeneralKeys, UserSignInKeys, UserSignInResponse } from "@types";
import { createStore } from "zustand";

export type UserState = UserSignInResponse 

export type UserActions = {
    updateUser: (user: UserState) => void,
    logoutUser: () => void,
}

export type UserStore = UserState & UserActions

export const initUserStore = async (initData: Partial<UserState>): Promise<UserState> => {
    return { ...defaultInitUserState, ...initData };
}

export const defaultInitUserState: UserState = {
    [UserSignInKeys.accessToken]: "",
    [UserGeneralKeys.userName]: "",
    [UserGeneralKeys.id]: "",
}

export const createUserStore = (initState: Promise<UserState>) => {
    const store = createStore<UserStore>()((set) => ({
        ...defaultInitUserState,
        updateUser: (user) => set({ ...user }),
        logoutUser: () => set({ ...defaultInitUserState }),
    }))
    initState.then(store.setState);
    return store;
}

