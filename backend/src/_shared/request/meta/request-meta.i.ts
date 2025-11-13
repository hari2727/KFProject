import { AuthDetails } from '../../auth/auth.i';

export interface RawRequestMeta {
    sourceClientId: any;
    sourceUserId: any;
    sourceLocale: any;
    preferredClientId: any;
    preferredUserId: any;
    preferredLocale: any;
    authToken: any;
    sessionId: any;
}

export interface RequestMeta extends AuthDetails {
    readonly sourceClientId: number;
    readonly sourceUserId: number;
    readonly sourceLocale: string;
    readonly clientId: number;
    readonly userId: number;
    readonly locale: string;
    readonly authToken: string;
    readonly sessionId: string;
    readonly isSuperUser: boolean;
}
