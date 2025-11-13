import { Injectable } from '@nestjs/common';
import { TokenMetadata, User } from './user.interface';
import { KfPermissions } from '../common.interface';
import axios from 'axios';
import { ConfigService } from '../../_shared/config/config.service';

@Injectable()
export class UserService {

    constructor(
        protected configService: ConfigService,
    ) {
    }

    async getUser(authToken: string, userId?: string | number): Promise<User> {
        if (!userId) {
            userId = (await this.getTokenMetadata(authToken)).userid;
        }
        return await this.loadUserInfo(authToken, userId);
    }

    async getTokenMetadata(authToken: string): Promise<TokenMetadata> {
        const raw = (
            await axios({
                method: 'get',
                url: this.configService.get('URL_KFHUB_API_BASE') + '/v1/actions/token/metadata',
                headers: {
                    authToken
                }
            })
        ).data as any;
        return {
            userid: Number(raw.userid),
            clientId: Number(raw.clientId),
            locale: String(raw.locale),
        };
    }

    async getPermissions(authToken: string): Promise<KfPermissions> {
        return (
            await axios({
                method: 'get',
                url: this.configService.get('URL_KFHUB_API_BASE') + '/v1/hrms/successprofiles/permissions',
                headers: {
                    authToken
                }
            })
        ).data.data as KfPermissions;
    }

    protected async loadUserInfo(authToken: string, userId: string | number): Promise<User> {
        return (
            await axios({
                method: 'get',
                url: this.configService.get('URL_KFHUB_API_BASE') + '/v1/users/' + userId,
                headers: {
                    authToken,
                }
            })
        ).data.data as User;
    }
}
