import { Module } from '@nestjs/common';
import { KfTarcPMJobsVisibilityStatusController } from './kftarc-jobsvisibility-pm.controller';
import { KfTarcPMJobsVisibilityStatusService } from './kftarc-jobsvisibility-pm.service';

@Module({
    providers: [
        KfTarcPMJobsVisibilityStatusService,
    ],
    controllers: [
        KfTarcPMJobsVisibilityStatusController,
    ],
})
export class KfTarcPMJobsVisibilityStatusModule {}
