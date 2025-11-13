export interface DemoUserLastNotificationResponse {
    userId: number;
    clientId: number;
    privacyTimeoutFlag?: boolean;
}

export interface DemoUserLastNotificationRequest {
    clientId: number
    userId: number;
}
