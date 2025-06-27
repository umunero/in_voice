export enum UserGeneralKeys {
    id = "id",
    userName = "userName",
}

export interface UserGeneral {
    [UserGeneralKeys.id]: string,
    [UserGeneralKeys.userName]: string,
}