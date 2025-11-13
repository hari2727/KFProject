export interface TokenMetadata {
    userId: number;
    clientId: number;
    locale: string;
}

export interface UserLocation {
    id: number;
    description: string;
    countryCode: string;
    countryName: string;
}

export interface UserSubscription {
    id: number;
    name: string;
    productTypes: UserProductSubscription[];
}

export interface UserProductSubscription {
    id: number;
    name: string;
    access: boolean;
}

export interface UserPreference {
    id: number;
    userId: number;
    name: string;
    description: string;
    productTypeId: number;
    productTypeName: string;
    systemDefault: string;
    userDefault: string;
    order: number;
    isUpdateProtected: boolean;
}

export interface UserRole {
    id: number;
    name: string;
    description: string;
    type: string;
    productTypes: UserProductRole[];
}

export interface UserProductRole {
    id: number;
    name: string;
    shortDescription: string;
    description: string;
}

export interface UserGroup {
    id: number;
    name: string;
    groups: UserGroupEntry[];
}

export interface UserGroupEntry {
    id: number;
    clientId: number;
    name: string;
    description: string;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    companyId: number;
    companyName?: string;
    createDateTime: number;
    modifiedDateTime?: number;
    pictureUrl?: string;
    externalClientId?: string;
    externalUserId?: string;
    locations?: UserLocation[];
    subscriptions: UserSubscription[];
    preferences: UserPreference[];
    roles: UserRole[];
    groupTypes: UserGroup[];
}
