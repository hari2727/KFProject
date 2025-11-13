export interface AuthSessionDetails {
    authToken: string;
    sessionId: string;
}

export interface AuthUserDetails {
    userId: number;
    clientId: number;
    locale: string;
}

export type AuthDetails = AuthSessionDetails & AuthUserDetails;
