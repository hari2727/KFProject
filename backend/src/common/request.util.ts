import { Request } from "express";
import { UserService } from "./user/user.service";
import { checkIfSuperUser } from "./user/user.utils";
import { safeNumber } from '../_shared/safety';

export const tryCustomClientIdValue = async (request: Request, service: UserService, customClientId?: any, defaultClientId?: any): Promise<number> => {
    defaultClientId = defaultClientId || request.query['loggedInUserClientId'];
    customClientId = customClientId || defaultClientId;

    if (customClientId != defaultClientId && !checkIfSuperUser(await service.getUser(String(request.headers.authtoken)))) {
        throw `Can't access provided clientId '${safeNumber(customClientId)}'`;
    }
    return Number(customClientId);
};

export const tryCustomLocaleValue = (request: Request, customLocale?: any, defaultLocale?: any): string => {
    return customLocale || defaultLocale || request.query['locale'];
};
