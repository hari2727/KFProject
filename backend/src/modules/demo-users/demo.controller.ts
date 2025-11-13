import { Controller, Get, Post, Query } from '@nestjs/common';
import { DemoUsersService } from './demo.service';
import { DemoUsersRoute } from './demo.route';
import { DemoUserLastNotificationRequest, DemoUserLastNotificationResponse, } from './demo.interface';

@Controller(DemoUsersRoute.BASE)
export class DemoUsersController {
    constructor(protected service: DemoUsersService) {}

    // apiTitle: 'Get DEMO users notification last notification date from DB',
    @Get()
    async getUsersPrivacyTimeoutFlag(@Query() query: DemoUserLastNotificationRequest): Promise<DemoUserLastNotificationResponse> {
        return await this.service.getUsersPrivacyTimeoutFlag(query);
    }

    // apiTitle: 'Save Demo user last notification date to DB',
    @Post()
    async updateUsersPrivacyResponseDate(@Query() body: DemoUserLastNotificationRequest): Promise<DemoUserLastNotificationResponse> {
        return await this.service.updateUsersPrivacyResponseDate(body);
    }
}
