export enum UserSignInKeys {
    userName = "userName",
    password = "password",
    accessToken = "accessToken",
    id = "id"
}

export interface UserSignInRequest {
    [UserSignInKeys.userName]: string;
    [UserSignInKeys.password]: string;
}

export interface UserSignInResponse {
    [UserSignInKeys.userName]: string,
    [UserSignInKeys.accessToken]: string
    [UserSignInKeys.id]: string
}