// import { createStore, StateCreator } from "zustand";
// import { FetchStatus } from "@/lib/constants/enums";
// import { BusinessNatureActions, BusinessNatureState, creatorBusinessNature, defaultInitBusinessNatureState } from "./business_nature";
// export * from "./business_nature";

// export enum ConfigList {
//     merchant = "merchant",
// }

// export type ConfigState = {
//     fetchStatus: FetchStatus;
//     business_nature: BusinessNatureState;
// }

// export type ConfigActions = {
//     business_nature: BusinessNatureActions;
// }

// export type ConfigStore = ConfigState & ConfigActions

// export const defaultInitConfigState: ConfigState = {
//     fetchStatus: FetchStatus.IDLE,
//     business_nature: defaultInitBusinessNatureState
// }

// export const initConfigStore = async (initData: Partial<ConfigState> | undefined): Promise<ConfigState> => {
//     return { ...defaultInitConfigState, ...initData };
// }

// const creator: (paramState?: ConfigState) => StateCreator<ConfigStore> = (paramState) => (set) => ({
//     ...defaultInitConfigState,
//     ...paramState,
//     business_nature: creatorBusinessNature(set, paramState?.business_nature)
// })

// export const createConfigStore = (initState: Promise<ConfigState>) => {
//     const store = createStore<ConfigStore>(creator())
//     initState.then((value) => store.setState(creator(value)(store.setState, store.getState, store)))
//     return store;
// }