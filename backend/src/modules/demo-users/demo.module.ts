import { Module } from '@nestjs/common';
import { DemoUsersService } from './demo.service';
import { DemoUsersController } from './demo.controller';
import { DemoUsersRepository } from './demo.repository';

@Module({
    providers: [
        DemoUsersService,
        DemoUsersRepository,
    ],
    controllers: [
        DemoUsersController,
    ],
})
export class DemoUsersModule {}
