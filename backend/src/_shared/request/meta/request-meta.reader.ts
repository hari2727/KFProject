import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RawRequestMeta } from './request-meta.i';

@Injectable()
export class RequestMetaRawReader {

    async getRawMeta(req: Request): Promise<RawRequestMeta> {
        const query = req.query ?? {};
        const headers = req.headers ?? {};
        return {
            authToken: headers['authtoken'],
            sessionId: headers['ps-session-id'],
            sourceClientId: query['loggedInUserClientId'],
            sourceUserId: query['userId'],
            sourceLocale: query['locale'],
            preferredClientId: query['preferredClientId'],
            preferredUserId: query['preferredUserId'],
            preferredLocale: query['preferredLocale'],
        };
    }
}
