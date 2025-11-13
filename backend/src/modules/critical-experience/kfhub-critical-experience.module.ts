import { Module } from '@nestjs/common';
import { KfhubCriticalExperienceController } from './kfhub-critical-experience.controller';
import { KfhubCriticalExperienceService } from './kfhub-critical-experience.service';

@Module({
    providers: [
        KfhubCriticalExperienceService,
    ],
    controllers: [
        KfhubCriticalExperienceController,
    ],
})
export class KfhubCriticalExperienceModule {}
