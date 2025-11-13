import { Module } from '@nestjs/common';
import { ProfileVersionsController } from './profile-versions.controller';
import { ProfileVersionsService } from './profile-versions.service';
import { ProfileVersionsRepository } from './profile-versions.repository';

@Module({
    providers: [
        ProfileVersionsService,
        ProfileVersionsRepository,
    ],
    controllers: [
        ProfileVersionsController,
    ],
})
export class ProfileVersionsModule {}
