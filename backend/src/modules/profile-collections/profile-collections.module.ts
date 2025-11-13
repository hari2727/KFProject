import { Module } from '@nestjs/common';
import { ProfileCollectionsRepository } from './profile-collections.repository';
import { ProfileCollectionsService } from './profile-collections.service';
import { ProfileCollectionsController } from './profile-collections.controller';

@Module({
    providers: [
        ProfileCollectionsService,
        ProfileCollectionsRepository,
    ],
    controllers: [
        ProfileCollectionsController,
    ],
})
export class ProfileCollectionsModule {}
