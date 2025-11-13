import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { toLocale, toNumber } from '../convert';
import { isNullish } from '../is';
import { TokenMetadata, User } from './user.i';
import { superUserRoles } from './user.const';
import { ConfigService } from '../config/config.service';

@Injectable()
export class UserService {

    protected getTokenMetadataUrl: string;
    protected getUserDetailsUrlBase: string;

    constructor(
        config: ConfigService,
    ) {
        const base = config.get('URL_KFHUB_API_BASE');
        this.getTokenMetadataUrl = base + '/v1/actions/token/metadata';
        this.getUserDetailsUrlBase = base + '/v1/users/';
    }

    checkIfSuperUser(user: User): boolean {
        return (user?.roles || []).some(role => superUserRoles.includes(role?.type));
    }

    async getUser(authToken: string, userId?: string | number): Promise<User> {
        if (isNullish(userId)) {
            userId = (await this.getTokenMetadata(authToken)).userId;
        }

        userId = toNumber(userId);
        if (isNullish(userId)) {
            throw 'Bad userId';
        }

        return await this.fetchUserDetails(authToken, userId);
    }

    protected async fetchUserDetails(authToken: string, userId: number): Promise<User> {
        return (
            await axios({
                method: 'get',
                url: this.getUserDetailsUrlBase + userId,
                headers: {
                    authToken,
                }
            })
        ).data.data as User;
    }

    async getTokenMetadata(authToken: string): Promise<TokenMetadata> {
        const raw = (
            await axios({
                method: 'get',
                url: this.getTokenMetadataUrl,
                headers: {
                    authToken
                }
            })
        ).data as any;

        return {
            userId: toNumber(raw.userid),
            clientId: toNumber(raw.clientId),
            locale: toLocale(raw.locale),
        };
    }
}
