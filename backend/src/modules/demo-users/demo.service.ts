import { Injectable } from '@nestjs/common';
import { DemoUserLastNotificationRequest, DemoUserLastNotificationResponse } from './demo.interface';
import { DemoUsersRepository } from './demo.repository';
import { LogErrors } from '../../_shared/log/log-errors.decorator';

@Injectable()
export class DemoUsersService {
    constructor(
        protected repository: DemoUsersRepository,
    ) {}

    @LogErrors()
    async updateUsersPrivacyResponseDate(query: DemoUserLastNotificationRequest): Promise<DemoUserLastNotificationResponse> {
            query.userId = Array.isArray(query.userId) ? query.userId.shift() : query.userId;
            const { clientId, userId } = query;

            await this.repository.updateUsersPrivacyResponseDate(+clientId, +userId);
            return {
                userId: +userId,
                clientId: +clientId
            };
    }

    @LogErrors()
    async getUsersPrivacyTimeoutFlag(query: DemoUserLastNotificationRequest): Promise<DemoUserLastNotificationResponse> {
            query.userId = Array.isArray(query.userId) ? query.userId.shift() : query.userId;
            const { clientId, userId } = query;
            const privacyTimeoutFlag = await this.repository.getUsersPrivacyTimeoutFlag(+clientId, +userId);

            return {
                userId: +userId,
                clientId: +clientId,
                privacyTimeoutFlag
            };
    }
}
