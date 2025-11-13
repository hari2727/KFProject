import { ForbiddenException, Injectable } from '@nestjs/common';
import { toLocale, toPositiveInteger, toStringOr } from '../../convert';
import { Request } from 'express';
import { isNullish } from '../../is';
import { UserService } from '../../user/user.service';
import { Caches } from '../../cache/caches';
import { Cache } from '../../cache/cache';
import { LogErrors } from '../../log/log-errors.decorator';
import { StopErrors } from '../../error/stop-errors.decorator';
import { TokenMetadata, User } from '../../user/user.i';
import { RequestMeta } from './request-meta.i';
import { RequestMetaRawReader } from './request-meta.reader';

const defaultLocale = 'en';

@Injectable()
export class RequestMetaService {

    protected isSuperUserCache: Cache<boolean, string>;
    protected tokenMetadataCache: Cache<TokenMetadata, string>;

    constructor(
        protected reader: RequestMetaRawReader,
        protected users: UserService,
        caches: Caches,
    ) {
        this.isSuperUserCache = caches.getCache<boolean, string>(RequestMetaService.name + '/isSuperUser');
        this.tokenMetadataCache = caches.getCache<TokenMetadata, string>(RequestMetaService.name + '/tokenMetadata');
    }

    @StopErrors()
    @LogErrors()
    protected async fetchUser(authToken: string, userId?: string | number): Promise<User> {
        return await this.users.getUser(authToken, userId);
    }

    protected async checkIfSuperUser(authToken: string, userId?: string | number): Promise<boolean> {
        const key = [authToken ?? userId].join();

        if (!this.isSuperUserCache.has(key)) {
            const user = await this.fetchUser(authToken, userId);
            this.isSuperUserCache.set(key, this.users.checkIfSuperUser(user));
        }

        return this.isSuperUserCache.get(key);
    }

    protected async getTokenMetadata(authToken: string): Promise<TokenMetadata> {
        const key = authToken;

        if (!this.tokenMetadataCache.has(key)) {
            const data = await this.users.getTokenMetadata(authToken);
            this.tokenMetadataCache.set(key, data);
        }

        return this.tokenMetadataCache.get(key);
    }

    @LogErrors()
    async getMeta(req: Request): Promise<RequestMeta> {
        const raw = await this.reader.getRawMeta(req);

        const authToken = toStringOr(raw.authToken);
        const sessionId = toStringOr(raw.sessionId);
        if (isNullish(authToken)) {
            throw 'No authToken';
        }

        if ([raw.sourceClientId, raw.sourceUserId, raw.sourceLocale].some(isNullish)) {
            const tokenMetadata = await this.getTokenMetadata(authToken);
            raw.sourceClientId = tokenMetadata.clientId;
            raw.sourceUserId = tokenMetadata.userId;
            raw.sourceLocale = tokenMetadata.locale;
        }
        if (isNullish(raw.sourceClientId)) {
            throw 'No clientId';
        }
        if (isNullish(raw.sourceUserId)) {
            throw 'No userId';
        }
        if (isNullish(raw.sourceLocale)) {
            throw 'No locale';
        }

        const sourceClientId = toPositiveInteger(raw.sourceClientId);
        const sourceUserId = toPositiveInteger(raw.sourceUserId);
        const sourceLocale = toLocale(raw.sourceLocale, defaultLocale);
        if (isNullish(sourceClientId)) {
            throw 'Bad clientId';
        }
        if (isNullish(sourceUserId)) {
            throw 'Bad userId';
        }
        if (isNullish(sourceLocale)) {
            throw 'Bad locale';
        }

        const preferredClientId = toPositiveInteger(raw.preferredClientId);
        const preferredUserId = toPositiveInteger(raw.preferredUserId);
        const preferredLocale = toLocale(raw.preferredLocale, sourceLocale);
        if (!isNullish(raw.preferredClientId) && isNullish(preferredClientId)) {
            throw 'Bad preferred clientId';
        }
        if (!isNullish(raw.preferredUserId) && isNullish(preferredUserId)) {
            throw 'Bad preferred userId';
        }
        if (!isNullish(raw.preferredLocale) && isNullish(preferredLocale)) {
            throw 'Bad preferred locale';
        }

        const isSuperUser = authToken && await this.checkIfSuperUser(authToken, sourceUserId);

        const meta: RequestMeta = {
            authToken,
            sessionId,
            sourceClientId: sourceClientId,
            sourceUserId: sourceUserId,
            sourceLocale: sourceLocale,
            clientId: preferredClientId ?? sourceClientId,
            userId: preferredUserId ?? sourceUserId,
            locale: preferredLocale ?? sourceLocale,
            isSuperUser: isSuperUser,
        };

        if (!isSuperUser) {
            if (
                meta.clientId !== meta.sourceClientId ||
                meta.userId !== meta.sourceUserId
            ) {
                throw new ForbiddenException('Credentials mismatch');
            }
        }

        return meta;
    }
}
