// import { OrderingModeEnum, RecordStatusEnum } from "@/lib/constants/fetch.enums"
// import { BusinessNatureQueryRequest, BusinessNatureQueryResponse, BusinessNatureGetRequest, BusinessNatureGetResponse, BusinessNatureUpdateRequest, BusinessNatureGeneralKeys, BusinessNatureGetKeys, BusinessNatureQueryKeys, BusinessNatureUpdateKeys } from "@/types/fetch/business_nature"
// import { GeneralQueryKeys } from "@/types/fetch/general.types"
// import { StoreApi } from "zustand"
// import { ConfigStore } from "."

// export type BusinessNatureState = {
//     query: {
//         params: BusinessNatureQueryRequest
//         result: BusinessNatureQueryResponse
//         fetchStatus: FetchStatus
//     },
//     details: {
//         params: BusinessNatureGetRequest
//         result: BusinessNatureGetResponse
//         fetchStatus: FetchStatus
//     },
//     edit: {
//         params: BusinessNatureUpdateRequest,
//         result: BusinessNatureGetResponse,
//         fetchStatus: FetchStatus
//     }
// }

// export type BusinessNatureActions = {
//     setQuery: (query: BusinessNatureState["query"]) => void,
//     setQueryParams: (params: BusinessNatureState["query"]["params"]) => void,
//     setQueryResult: (result: BusinessNatureState["query"]["result"]) => void,
//     setQueryFetchStatus: (fetchStatus: BusinessNatureState["query"]["fetchStatus"]) => void,
//     setDetails: (details: BusinessNatureState["details"]) => void,
//     setDetailsParams: (params: BusinessNatureState["details"]["params"]) => void,
//     setDetailsResult: (result: BusinessNatureState["details"]["result"]) => void,
//     setDetailsFetchStatus: (fetchStatus: BusinessNatureState["details"]["fetchStatus"]) => void,
//     setEdit: (edit: BusinessNatureState["edit"]) => void,
//     setEditParams: (params: BusinessNatureState["edit"]["params"]) => void,
//     setEditResult: (result: BusinessNatureState["edit"]["result"]) => void,
//     setEditFetchStatus: (fetchStatus: BusinessNatureState["edit"]["fetchStatus"]) => void,
// }

// export type BusinessNatureStore = BusinessNatureState & BusinessNatureActions

// export const defaultInitBusinessNatureState: BusinessNatureState = {
//     query: {
//         params: {
//             [GeneralQueryKeys.pageIndex]: 1,
//             [GeneralQueryKeys.pageSize]: 20,
//             [BusinessNatureQueryKeys.orderBy]: OrderingModeEnum.Ascending,
//         },
//         result: {
//             [GeneralQueryKeys.data]: [],
//             [GeneralQueryKeys.currentPageIndex]: 0,
//             [GeneralQueryKeys.pageSize]: 0,
//             [GeneralQueryKeys.totalRecords]: 0
//         },
//         fetchStatus: FetchStatus.IDLE
//     },
//     details: {
//         params: {
//             [BusinessNatureGetKeys.id]: ""
//         },
//         result: {
//             [BusinessNatureGetKeys.updatedBy]: "",
//             [BusinessNatureGetKeys.updatedDt]: new Date(0),
//             [BusinessNatureGeneralKeys.id]: "",
//             [BusinessNatureGeneralKeys.name]: "",
//             [BusinessNatureGeneralKeys.desc]: "",
//             [BusinessNatureGeneralKeys.status]: RecordStatusEnum.Active,
//             [BusinessNatureGeneralKeys.locationIP]: "",
//             [BusinessNatureGeneralKeys.createdBy]: "",
//             [BusinessNatureGeneralKeys.createdDt]: new Date(0)
//         },
//         fetchStatus: FetchStatus.IDLE
//     },
//     edit: {
//         params: {
//             [BusinessNatureGetKeys.id]: "",
//             [BusinessNatureUpdateKeys.name]: "",
//             [BusinessNatureUpdateKeys.desc]: "",
//             [BusinessNatureUpdateKeys.status]: RecordStatusEnum.Active,
//         },
//         result: {
//             [BusinessNatureGetKeys.updatedBy]: "",
//             [BusinessNatureGetKeys.updatedDt]: new Date(0),
//             [BusinessNatureGeneralKeys.id]: "",
//             [BusinessNatureGeneralKeys.name]: "",
//             [BusinessNatureGeneralKeys.desc]: "",
//             [BusinessNatureGeneralKeys.status]: RecordStatusEnum.Active,
//             [BusinessNatureGeneralKeys.locationIP]: "",
//             [BusinessNatureGeneralKeys.createdBy]: "",
//             [BusinessNatureGeneralKeys.createdDt]: new Date(0)
//         },
//         fetchStatus: FetchStatus.IDLE
//     }
// }

// export const creatorBusinessNature = (
//     set: StoreApi<ConfigStore>["setState"],
//     paramState?: BusinessNatureState
// ): BusinessNatureStore => ({
//     ...defaultInitBusinessNatureState,
//     ...paramState,
//     setQuery: (query) => { set((state) => ({ fetchStatus: query.fetchStatus, business_nature: { ...state.business_nature, query } })) },
//     setQueryParams: (params) => { set((state) => ({ business_nature: { ...state.business_nature, query: { ...state.business_nature.query, params } } })) },
//     setQueryResult: (result) => { set((state) => ({ business_nature: { ...state.business_nature, query: { ...state.business_nature.query, result } } })) },
//     setQueryFetchStatus: (fetchStatus) => { set((state) => ({ fetchStatus, business_nature: { ...state.business_nature, query: { ...state.business_nature.query, fetchStatus } } })) },
//     setDetails: (details) => { set((state) => ({ fetchStatus: details.fetchStatus, business_nature: { ...state.business_nature, details } })) },
//     setDetailsParams: (params) => { set((state) => ({ business_nature: { ...state.business_nature, details: { ...state.business_nature.details, params } } })) },
//     setDetailsResult: (result) => { set((state) => ({ business_nature: { ...state.business_nature, details: { ...state.business_nature.details, result } } })) },
//     setDetailsFetchStatus: (fetchStatus) => { set((state) => ({ fetchStatus, business_nature: { ...state.business_nature, details: { ...state.business_nature.details, fetchStatus } } })) },
//     setEdit: (edit) => { set((state) => ({ fetchStatus: edit.fetchStatus, business_nature: { ...state.business_nature, edit } })) },
//     setEditParams: (params) => { set((state) => ({ business_nature: { ...state.business_nature, edit: { ...state.business_nature.edit, params } } })) },
//     setEditResult: (result) => { set((state) => ({ business_nature: { ...state.business_nature, edit: { ...state.business_nature.edit, result } } })) },
//     setEditFetchStatus: (fetchStatus) => { set((state) => ({ fetchStatus, business_nature: { ...state.business_nature, edit: { ...state.business_nature.edit, fetchStatus } } })) },
// });
